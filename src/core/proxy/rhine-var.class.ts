import RhineVarItem from "@/core/proxy/rhine-var-item.class";
import WebsocketConnector from "@/core/connector/websocket-connector";

export default class RhineVar<T> extends RhineVarItem<T> {

  connector: WebsocketConnector | null = null
  
  isRoot(): boolean {
    return true
  }
  
  root(): RhineVar<any> {
    return this
  }

  bindConnector(connector: WebsocketConnector) {

    this.connector = connector

  }

}
