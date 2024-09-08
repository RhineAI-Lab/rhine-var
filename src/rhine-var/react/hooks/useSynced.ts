import WebsocketRhineConnector from "@/rhine-var/core/connector/WebsocketRhineConnector";
import {ProxiedRhineVar} from "@/rhine-var/core/Proxy";
import {useEffect, useState} from "react";

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
