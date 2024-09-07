
const ENABLE_LOG = true

export function log(...items: any[]) {
  if (ENABLE_LOG) {
    console.log('%cRhineVar', 'color: #b6ff00', ...items)
  }
}
