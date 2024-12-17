export function isDeepEqual(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
): boolean {
  if (obj1 === obj2) return true

  if (
    obj1 == null ||
    obj2 == null ||
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object'
  ) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (
      !keys2.includes(key) ||
      !isDeepEqual(
        obj1[key] as Record<string, unknown>,
        obj2[key] as Record<string, unknown>
      )
    ) {
      return false
    }
  }

  return true
}
