import RhineVarItem from "@/core/proxy/RhineVarItem";
import WebsocketRhineConnector from "@/core/connector/WebsocketRhineConnector";

export default class RhineVar<T> extends RhineVarItem<T> {
  
  connector: WebsocketRhineConnector | null = null
  
  isRoot(): boolean {
    return true
  }
  
  root(): RhineVar<any> {
    return this
  }

}
