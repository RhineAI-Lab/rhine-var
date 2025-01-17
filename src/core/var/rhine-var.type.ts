import RhineVarText from "@/core/var/items/rhine-var-text.class";
import RhineVarXmlText from "@/core/var/items/rhine-var-xml-text.class";
import RhineVarXmlElement from "@/core/var/items/rhine-var-xml-element.class";
import RhineVarXmlFragment from "@/core/var/items/rhine-var-xml-fragment.class";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";

export type RhineVar<T = any> = RhineVarMap<T> | RhineVarArray<T> | RhineVarText | RhineVarXmlText | RhineVarXmlElement<T> | RhineVarXmlFragment

export type RecursiveCrossRhineVar<T = any> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVar<T[K]> & RhineVar<T[K]> : T[K]
}

export type StoredRhineVar<T = any> = T & RecursiveCrossRhineVar<T> & RhineVar<T>

export type ProxiedRhineVar<T = any> = StoredRhineVar<T>
