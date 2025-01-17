import RhineVarTextItem from "@/core/var/itmes/rhine-var-text-item.class";
import RhineVarXmlTextItem from "@/core/var/itmes/rhine-var-xml-text-item.class";
import RhineVarXmlElementItem from "@/core/var/itmes/rhine-var-xml-element-item.class";
import RhineVarXmlFragmentItem from "@/core/var/itmes/rhine-var-xml-fragment-item.class";
import RhineVarMapItem from "@/core/var/itmes/rhine-var-map-item.class";
import RhineVarArrayItem from "@/core/var/itmes/rhine-var-array-item.class";

export type RhineVarItem<T = any> = RhineVarMapItem<T> | RhineVarArrayItem<T> | RhineVarTextItem | RhineVarXmlTextItem | RhineVarXmlElementItem<T> | RhineVarXmlFragmentItem
