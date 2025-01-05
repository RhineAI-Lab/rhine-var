import RhineVarConfig from "@/config/config";

export function log(...items: any[]) {
  if (RhineVarConfig.ENABLE_LOG) {
    nativeLog(...items)
  }
}

export function nativeLog(...items: any[]) {
  console.log('%cRhineVar', 'color: #b6ff00', ...items)
}

export function warn(...items: any[]) {
  console.warn('RhineVar:', ...items)
}
