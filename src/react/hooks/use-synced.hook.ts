import WebsocketConnector from "@/core/connector/websocket-connector.class";
import {useEffect, useState} from "react";
import {ProxiedRhineVar} from "@/core/proxy/proxied-rhine-var.type";
import RhineVarItem from "@/core/proxy/rhine-var-item.class";

export default function useSynced(target?: WebsocketConnector | ProxiedRhineVar<any>) {
  
  const checkSynced = (): boolean => {
    let connector: WebsocketConnector | null = null
    if (target instanceof WebsocketConnector) {
      connector = target
    } else if (target instanceof RhineVarItem) {
      connector = target.getConnector()
    }
    return connector?.synced ?? false
  }
  
  const [synced, setSynced] = useState(checkSynced)
  
  useEffect(() => {
    if (target instanceof WebsocketConnector) {
      return target.subscribeSynced((value: boolean) => setSynced(value))
    }
    if (target instanceof RhineVarItem) {
      return target.subscribeSynced((value: boolean) => setSynced(value))
    }
  }, [target])
  
  return synced
}
