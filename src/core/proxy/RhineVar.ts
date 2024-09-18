import RhineVarItem from "@/core/proxy/RhineVarItem";
import WebsocketRhineConnector from "@/core/connector/WebsocketRhineConnector";

export default class RhineVar<T> extends RhineVarItem<T> {
  
  connector: WebsocketRhineConnector | null = null
  
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
