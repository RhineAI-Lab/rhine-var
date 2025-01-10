import {DEFAULT_PUBLIC_URL, PROTOCOL_LIST} from "@/core/proxy/proxy";
import HocuspocusConnector from "@/core/connector/hocuspocus/hocuspocus-connector.class";

export function createConnector(connectorText: string | number) {
  let text = String(connectorText)

  // Connector is String: Default for Websocket Connector
  if (PROTOCOL_LIST.every(protocol => !text.startsWith(protocol))) {
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
