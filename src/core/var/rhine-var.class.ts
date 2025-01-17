import RhineVarBaseItem from "@/core/var/rhine-var-base-item.class";
import Connector from "@/core/connector/connector.abstract";

export default class RhineVar<T> extends RhineVarBaseItem<T> {

  connector: Connector | null = null
  
  isRoot(): boolean {
    return true
  }
  
  root(): RhineVar<any> {
    return this
  }

}
