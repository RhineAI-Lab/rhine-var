import RhineVarItem from "@/core/proxy/RhineVarItem";
import WebsocketRhineConnector from "@/core/connector/WebsocketRhineConnector";

export default class RhineVar<T> extends RhineVarItem<T> {
  
  connector: WebsocketRhineConnector | null = null
  
  parent: RhineVarItem<any> | null = null
  isRoot: boolean = true
  
  root() {
    return this
  }
  
  afterSynced(callback: () => void) {
    if (this.connector) {
      this.connector.afterSynced(callback)
    }
  }
  async waitSynced() {
    if (this.connector) {
      await this.connector.waitSynced()
    }
  }

}
