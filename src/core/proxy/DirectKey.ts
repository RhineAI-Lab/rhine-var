export const DIRECT_KEY_PREVIOUS = 'RHINE_VAR_DIRECT_PACKAGE_PREFIX_'

export function directKey(key: string) {
  return DIRECT_KEY_PREVIOUS + key
}

export function isDirectKey(key: string | any) {
  return typeof key === 'string' && key.startsWith(DIRECT_KEY_PREVIOUS)
}
