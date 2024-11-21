
export default class RhineVarConfig {

  static ENABLE_LOG = false
  static ENABLE_SYNC_HANDSHAKE_CHECK = true

}

export function enableRhineVarLog(value: boolean) {
  RhineVarConfig.ENABLE_LOG = Boolean(value)
}

export function enableRhineVarSyncHandshakeCheck(value: boolean) {
  RhineVarConfig.ENABLE_SYNC_HANDSHAKE_CHECK = Boolean(value)
}

export function getRhineVarConfig() {
  return RhineVarConfig
}

