import WebsocketRhineConnector from "@/core/connector/WebsocketRhineConnector";
import {useEffect, useState} from "react";
import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";
import RhineVarItem from "@/core/proxy/RhineVarItem";

export default function useSynced(target?: WebsocketRhineConnector | ProxiedRhineVar<any>) {
  
  const checkSynced = (): boolean => {
    let connector: WebsocketRhineConnector | null = null
    if (target instanceof WebsocketRhineConnector) {
      connector = target
    } else if (target instanceof RhineVarItem) {
      connector = target.getConnector()
    }
    return connector?.synced ?? false
  }
  
  const [synced, setSynced] = useState(checkSynced)
  
  useEffect(() => {
    if (target instanceof WebsocketRhineConnector) {
      return target.subscribeSynced((value: boolean) => setSynced(value))
    }
    if (target instanceof RhineVarItem) {
      return target.subscribeSynced((value: boolean) => setSynced(value))
    }
  }, [target])
  
  return synced
}
