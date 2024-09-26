import WebsocketRhineConnector from "@/core/connector/WebsocketRhineConnector";
import {useEffect, useState} from "react";
import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";
import RhineVarItem from "@/core/proxy/RhineVarItem";

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
    if (target instanceof RhineVarItem) {
      return target.subscribeSynced((value: boolean) => setSynced(value))
    }
  }, [])
  
  return synced
}
