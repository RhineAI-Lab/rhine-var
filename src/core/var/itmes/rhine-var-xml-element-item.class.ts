import RhineVarBaseItem from "@/core/var/rhine-var-base-item.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarXmlElementItem<T> extends RhineVarBaseItem<T> {

  type: NativeType.XmlFragment = NativeType.XmlFragment

}
