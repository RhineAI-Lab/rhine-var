import Connector from "@/core/connector/connector.class";
import {DEFAULT_PUBLIC_URL, PROTOCOL_LIST} from "@/core/proxy/proxy";

export function createConnector(connectorText: string | number) {
  let text = String(connectorText)

  // Connector is String: Default for Websocket Connector
  if (PROTOCOL_LIST.every(protocol => !text.startsWith(protocol))) {
    text = DEFAULT_PUBLIC_URL + text
  }

  const connector = new Connector()
  if (typeof window !== 'undefined') {
    connector.connect(String(text))
  }
  return connector
}
