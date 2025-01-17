import RhineVarText from "@/core/var/itmes/rhine-var-text.class";
import RhineVarXmlText from "@/core/var/itmes/rhine-var-xml-text.class";
import RhineVarXmlElement from "@/core/var/itmes/rhine-var-xml-element.class";
import RhineVarXmlFragment from "@/core/var/itmes/rhine-var-xml-fragment.class";
import RhineVarMap from "@/core/var/itmes/rhine-var-map.class";
import RhineVarArray from "@/core/var/itmes/rhine-var-array.class";

export type RhineVar<T = any> = RhineVarMap<T> | RhineVarArray<T> | RhineVarText | RhineVarXmlText | RhineVarXmlElement<T> | RhineVarXmlFragment
