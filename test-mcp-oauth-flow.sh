#!/usr/bin/env bash
#
# test-mcp-oauth-flow.sh
#
# End-to-end tester for the MCP OAuth flow. You give it ONLY the MCP server
# URL - it discovers everything else itself, the same way Claude/Codex do:
#
#   1. Hit MCP_URL unauthenticated -> expect 401 + WWW-Authenticate header
#      pointing at the protected-resource metadata URL.
#   2. Fetch that metadata -> get authorization_servers[0].
#   3. Fetch that issuer's /.well-known/oauth-authorization-server
#      (falls back to /.well-known/openid-configuration) -> get
#      registration_endpoint / authorization_endpoint / token_endpoint.
#   4. POST /register, GET /authorize (browser), POST /token.
#   5. Replay + protected-call sanity checks.
#
# Usage:
#   ./test-mcp-oauth-flow.sh https://yourserver.com/mcp
#   MCP_URL=https://yourserver.com/mcp ./test-mcp-oauth-flow.sh
#
# Requires: curl, jq, openssl
set -euo pipefail

MCP_URL="${1:-${MCP_URL:-}}"
[[ -n "$MCP_URL" ]] || { echo "Usage: $0 <mcp-server-url>" >&2; exit 1; }

REDIRECT_URI="${REDIRECT_URI:-http://localhost:8787/callback}"
CALLBACK_PORT="${CALLBACK_PORT:-8787}"
SCOPE="${SCOPE:-read write}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing dependency: $1" >&2; exit 1; }; }
need curl; need jq; need openssl

log()  { printf "\n\033[1;34m==> %s\033[0m\n" "$1"; }
ok()   { printf "\033[1;32m✓ %s\033[0m\n" "$1"; }
fail() { printf "\033[1;31m✗ %s\033[0m\n" "$1"; exit 1; }

# ---------------------------------------------------------------------------
# 0. PKCE: generate code_verifier + code_challenge (S256)
# ---------------------------------------------------------------------------
log "Generating PKCE pair"
CODE_VERIFIER=$(openssl rand -base64 96 | tr -d '=+/\n' | cut -c1-64)
CODE_CHALLENGE=$(printf '%s' "$CODE_VERIFIER" | openssl dgst -sha256 -binary | openssl base64 | tr '+/' '-_' | tr -d '=')
STATE=$(openssl rand -hex 16)
echo "code_verifier : $CODE_VERIFIER"
echo "code_challenge: $CODE_CHALLENGE"
echo "state         : $STATE"

# ---------------------------------------------------------------------------
# 1. Hit the MCP server unauthenticated -> read WWW-Authenticate header
# ---------------------------------------------------------------------------
log "Probing $MCP_URL (unauthenticated)"
HEADERS_FILE=$(mktemp)
HTTP_CODE=$(curl -sS -o /dev/null -D "$HEADERS_FILE" -w "%{http_code}" -X POST "$MCP_URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}')

echo "HTTP $HTTP_CODE"
[[ "$HTTP_CODE" == "401" ]] || fail "expected 401 from unauthenticated call, got $HTTP_CODE (check auth is actually enforced)"

WWW_AUTH=$(grep -i '^www-authenticate:' "$HEADERS_FILE" | sed 's/^[Ww][Ww][Ww]-[Aa]uthenticate: *//' | tr -d '\r')
[[ -n "$WWW_AUTH" ]] || fail "no WWW-Authenticate header on 401 response - client can't discover auth server"
echo "WWW-Authenticate: $WWW_AUTH"

PRM_URL=$(echo "$WWW_AUTH" | grep -oE 'resource_metadata="[^"]+"' | sed -E 's/resource_metadata="([^"]+)"/\1/')
[[ -n "$PRM_URL" ]] || fail "no resource_metadata param found in WWW-Authenticate header"
ok "protected resource metadata URL = $PRM_URL"
rm -f "$HEADERS_FILE"

# ---------------------------------------------------------------------------
# 2. Discovery: protected resource metadata
# ---------------------------------------------------------------------------
log "Fetching $PRM_URL"
PRM=$(curl -sS -f "$PRM_URL") || fail "protected resource metadata fetch failed"
echo "$PRM" | jq .
AUTH_SERVER=$(echo "$PRM" | jq -r '.authorization_servers[0]')
[[ -n "$AUTH_SERVER" && "$AUTH_SERVER" != "null" ]] || fail "no authorization_servers[0] in metadata"
ok "authorization_servers[0] = $AUTH_SERVER"

# ---------------------------------------------------------------------------
# 3. Discovery: authorization server metadata (with OIDC fallback)
# ---------------------------------------------------------------------------
log "Fetching $AUTH_SERVER/.well-known/oauth-authorization-server"
ASM=$(curl -sS -f "$AUTH_SERVER/.well-known/oauth-authorization-server" 2>/dev/null) || true
if [[ -z "$ASM" ]]; then
  log "Falling back to $AUTH_SERVER/.well-known/openid-configuration"
  ASM=$(curl -sS -f "$AUTH_SERVER/.well-known/openid-configuration") \
    || fail "authorization server metadata fetch failed on both well-known paths"
fi
echo "$ASM" | jq .

REG_ENDPOINT=$(echo "$ASM" | jq -r '.registration_endpoint')
AUTHZ_ENDPOINT=$(echo "$ASM" | jq -r '.authorization_endpoint')
TOKEN_ENDPOINT=$(echo "$ASM" | jq -r '.token_endpoint')
[[ "$REG_ENDPOINT" != "null" ]]   || fail "no registration_endpoint advertised"
[[ "$AUTHZ_ENDPOINT" != "null" ]] || fail "no authorization_endpoint advertised"
[[ "$TOKEN_ENDPOINT" != "null" ]] || fail "no token_endpoint advertised"
ok "endpoints discovered"

# ---------------------------------------------------------------------------
# 4. Dynamic Client Registration
# ---------------------------------------------------------------------------
log "POST $REG_ENDPOINT"
REG_RESPONSE=$(curl -sS -f -X POST "$REG_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "client_name": "oauth-flow-test-script",
  "redirect_uris": ["$REDIRECT_URI"],
  "grant_types": ["authorization_code"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none"
}
EOF
) || fail "client registration failed"
echo "$REG_RESPONSE" | jq .
CLIENT_ID=$(echo "$REG_RESPONSE" | jq -r '.client_id')
[[ "$CLIENT_ID" != "null" && -n "$CLIENT_ID" ]] || fail "no client_id returned"
ok "registered client_id = $CLIENT_ID"

# ---------------------------------------------------------------------------
# 5. Authorization: open browser, spin up a local callback listener
# ---------------------------------------------------------------------------
log "Building /authorize URL"
AUTHZ_URL="$AUTHZ_ENDPOINT?response_type=code"
AUTHZ_URL+="&client_id=$(jq -rn --arg v "$CLIENT_ID" '$v|@uri')"
AUTHZ_URL+="&redirect_uri=$(jq -rn --arg v "$REDIRECT_URI" '$v|@uri')"
AUTHZ_URL+="&scope=$(jq -rn --arg v "$SCOPE" '$v|@uri')"
AUTHZ_URL+="&state=$STATE"
AUTHZ_URL+="&code_challenge=$CODE_CHALLENGE"
AUTHZ_URL+="&code_challenge_method=S256"

echo "$AUTHZ_URL"

log "Starting one-shot callback listener on port $CALLBACK_PORT"
CALLBACK_FILE=$(mktemp)

if command -v nc >/dev/null 2>&1; then
  (
    printf 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<html><body>You can close this tab and return to the terminal.</body></html>' \
      | nc -l "$CALLBACK_PORT" > "$CALLBACK_FILE" 2>/dev/null || true
  ) &
  LISTENER_PID=$!
else
  fail "netcat (nc) not found - install it, or manually paste the redirected URL when prompted"
fi

if command -v open >/dev/null 2>&1; then
  open "$AUTHZ_URL" >/dev/null 2>&1 || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$AUTHZ_URL" >/dev/null 2>&1 || true
else
  echo "Open this URL in a browser and complete login/consent:"
  echo "$AUTHZ_URL"
fi

echo "Waiting for redirect to $REDIRECT_URI ..."
wait "$LISTENER_PID" 2>/dev/null || true

FIRST_LINE=$(head -n1 "$CALLBACK_FILE" || true)
echo "Captured request line: $FIRST_LINE"

CALLBACK_QUERY=$(echo "$FIRST_LINE" | sed -E 's/^[A-Z]+ [^?]*\?([^ ]*) .*/\1/')

if [[ -z "$CALLBACK_QUERY" || "$CALLBACK_QUERY" == "$FIRST_LINE" ]]; then
  read -rp "Couldn't auto-capture callback. Paste the FULL redirected URL here: " PASTED_URL
  CALLBACK_QUERY="${PASTED_URL#*\?}"
fi

AUTH_CODE=$(echo "$CALLBACK_QUERY" | tr '&' '\n' | grep '^code=' | cut -d= -f2-)
RETURNED_STATE=$(echo "$CALLBACK_QUERY" | tr '&' '\n' | grep '^state=' | cut -d= -f2-)
ERROR_PARAM=$(echo "$CALLBACK_QUERY" | tr '&' '\n' | grep '^error=' | cut -d= -f2- || true)

[[ -z "$ERROR_PARAM" ]] || fail "authorization server returned error=$ERROR_PARAM"
[[ -n "$AUTH_CODE" ]] || fail "no code found in callback"
[[ "$RETURNED_STATE" == "$STATE" ]] || fail "state mismatch (possible CSRF or misrouted callback)"
ok "received authorization code, state verified"

# ---------------------------------------------------------------------------
# 6. Token exchange
# ---------------------------------------------------------------------------
log "POST $TOKEN_ENDPOINT"
TOKEN_RESPONSE=$(curl -sS -X POST "$TOKEN_ENDPOINT" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "code=$AUTH_CODE" \
  --data-urlencode "redirect_uri=$REDIRECT_URI" \
  --data-urlencode "client_id=$CLIENT_ID" \
  --data-urlencode "code_verifier=$CODE_VERIFIER")

echo "$TOKEN_RESPONSE" | jq . 2>/dev/null || echo "$TOKEN_RESPONSE"

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token // empty')
[[ -n "$ACCESS_TOKEN" ]] || fail "token exchange failed - no access_token in response"
ok "access_token received (expires_in=$(echo "$TOKEN_RESPONSE" | jq -r '.expires_in // "n/a"'))"

# ---------------------------------------------------------------------------
# 7. Sanity checks: reused code must fail
# ---------------------------------------------------------------------------
log "Verifying authorization code is single-use (replay should fail)"
REPLAY=$(curl -sS -X POST "$TOKEN_ENDPOINT" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "code=$AUTH_CODE" \
  --data-urlencode "redirect_uri=$REDIRECT_URI" \
  --data-urlencode "client_id=$CLIENT_ID" \
  --data-urlencode "code_verifier=$CODE_VERIFIER")
REPLAY_ERROR=$(echo "$REPLAY" | jq -r '.error // empty')
if [[ "$REPLAY_ERROR" == "invalid_grant" ]]; then
  ok "replay correctly rejected with invalid_grant"
else
  echo "⚠ WARNING: replay of used code did not return invalid_grant. Response: $REPLAY"
fi

# ---------------------------------------------------------------------------
# 8. Call the protected MCP endpoint with the access token
# ---------------------------------------------------------------------------
log "Calling protected resource with access_token"
MCP_RESPONSE=$(curl -sS -o /dev/null -w "%{http_code}" -X POST "$MCP_URL" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}')

if [[ "$MCP_RESPONSE" =~ ^2 ]]; then
  ok "protected resource responded with HTTP $MCP_RESPONSE"
else
  echo "⚠ protected resource responded with HTTP $MCP_RESPONSE (check auth middleware)"
fi

rm -f "$CALLBACK_FILE"
log "Flow complete ✅"
echo "client_id:    $CLIENT_ID"
echo "access_token: $ACCESS_TOKEN"
