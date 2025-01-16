import HocuspocusConnector from "@/core/connector/hocuspocus/hocuspocus-connector.class";


export const PROTOCOL_LIST = ['ws://', "wss://"]
export const DEFAULT_PUBLIC_URL = 'wss://rvp.rhineai.com/'

export function createConnector(connectorText: string | number) {
  let text = String(connectorText)

  // Connector is String but not start with protocol
  if (PROTOCOL_LIST.every(protocol => !text.startsWith(protocol))) {
    // Default to use public url
    text = DEFAULT_PUBLIC_URL + text
  }

  // Use HocuspocusConnector by default
  const connector = new HocuspocusConnector(text)
  // const connector = new WebsocketConnector(text)

  if (typeof window !== 'undefined') {
    connector.connect(String(text))
  }

  return connector
}
