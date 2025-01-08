import RhineVarItem from "@/core/proxy/rhine-var-item.class";
import Connector from "@/core/connector/connector.class";

export default class RhineVar<T> extends RhineVarItem<T> {

  connector: Connector | null = null
  
  isRoot(): boolean {
    return true
  }
  
  root(): RhineVar<any> {
    return this
  }

}
