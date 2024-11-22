import RhineVarItem from "@/core/proxy/RhineVarItem";
import WebsocketConnector from "@/core/connector/WebsocketConnector";

export default class RhineVar<T> extends RhineVarItem<T> {

  connector: WebsocketConnector | null = null
  
  isRoot(): boolean {
    return true
  }
  
  root(): RhineVar<any> {
    return this
  }

}
