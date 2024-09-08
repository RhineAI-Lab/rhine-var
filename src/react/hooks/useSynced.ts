import WebsocketRhineConnector from "@/core/connector/WebsocketRhineConnector";
import {useEffect, useState} from "react";
import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";

export default function useSynced(target?: WebsocketRhineConnector | ProxiedRhineVar<any>) {
  let connector: WebsocketRhineConnector | null = null
  if (target) {
    if (target instanceof WebsocketRhineConnector) {
      connector = target
    } else {
      connector = target.connector
    }
  }
  
  const [synced, setSynced] = useState(connector?.synced)
  
  useEffect(() => {
    let listener = null
    if (connector) {
      listener = (synced: boolean) => setSynced(synced)
      connector.addSyncedListener(listener)
    }
    return () => {
      if (listener && connector) {
        connector.removeSyncedListener(listener)
      }
    }
  }, [])
  
  return synced
}
