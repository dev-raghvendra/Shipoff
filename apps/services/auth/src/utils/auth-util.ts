import crypto from "crypto"
export function verifyPkce(
    codeVerifier: string,
    expectedCodeChallenge: string
): boolean {
    const calculated = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");

    return crypto.timingSafeEqual(
        Buffer.from(calculated),
        Buffer.from(expectedCodeChallenge)
    );
}