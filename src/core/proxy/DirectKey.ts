export const DIRECT_KEY_PREVIOUS = 'RHINE_VAR_DIRECT_PACKAGE_PREFIX_'

export function directKey(key: string | number) {
  return DIRECT_KEY_PREVIOUS + key
}

export function isDirectKey(key: string | any) {
  return typeof key === 'string' && key.startsWith(DIRECT_KEY_PREVIOUS)
}

export function originKey(key: string | symbol | number): string | symbol | number {
  if (typeof key === 'number') key = String(key)
  if (typeof key !== 'string') return key;
  if (key.startsWith(DIRECT_KEY_PREVIOUS)) {
    key = key.split(DIRECT_KEY_PREVIOUS)[1]
    let kn = parseInt(key)
    if (isNaN(kn)) {
      return key
    } else {
      return kn
    }
  }
  return key
}
