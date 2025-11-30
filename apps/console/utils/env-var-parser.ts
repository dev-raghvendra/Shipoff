/**
 * Parses environment variables from text content (e.g., from .env file format)
 * Supports formats like:
 * - KEY=value
 * - KEY="value"
 * - KEY='value'
 * - KEY=value # comment
 * - Empty lines and comments are ignored
 */
export interface ParsedEnvVar {
  name: string
  value: string
}

export function parseEnvVarsFromText(text: string): ParsedEnvVar[] {
  const envVars: ParsedEnvVar[] = []
  const lines = text.split('\n')

  for (const line of lines) {
    // Trim whitespace
    const trimmed = line.trim()
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    // Find the first = sign
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) {
      // No = sign, skip this line
      continue
    }

    // Extract key (before =)
    const key = trimmed.substring(0, equalIndex).trim()
    if (!key) {
      continue
    }

    // Extract value (after =)
    let value = trimmed.substring(equalIndex + 1).trim()

    // Remove inline comments (everything after # that's not inside quotes)
    const commentIndex = findCommentIndex(value)
    if (commentIndex !== -1) {
      value = value.substring(0, commentIndex).trim()
    }

    // Handle quoted values
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    // Unescape common escape sequences
    value = value.replace(/\\n/g, '\n')
                 .replace(/\\t/g, '\t')
                 .replace(/\\"/g, '"')
                 .replace(/\\'/g, "'")
                 .replace(/\\\\/g, '\\')

    envVars.push({ name: key, value })
  }

  return envVars
}

/**
 * Finds the index of a comment (#) that's not inside quotes
 */
function findCommentIndex(str: string): number {
  let inDoubleQuotes = false
  let inSingleQuotes = false
  let escaped = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const prevChar = i > 0 ? str[i - 1] : ''

    if (escaped) {
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes
      continue
    }

    if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes
      continue
    }

    if (char === '#' && !inDoubleQuotes && !inSingleQuotes) {
      return i
    }
  }

  return -1
}

