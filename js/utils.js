export function stringTailUntil(string, until) {
  let i = string.length
  let n = 0
  while (i > 0 && n < 2) {
    i--
    if (string[i] == until) {
      n++
    }
  }
  return i == 0 ? string : string.substring(i + 1)
}
