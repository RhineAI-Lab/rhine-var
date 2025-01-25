import RhineVarText from "@/core/var/items/rhine-var-text.class";
import RhineVarXmlText from "@/core/var/items/rhine-var-xml-text.class";
import RhineVarXmlElement from "@/core/var/items/rhine-var-xml-element.class";
import RhineVarXmlFragment from "@/core/var/items/rhine-var-xml-fragment.class";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";
import {
  Array as YArray,
  Map as YMap,
  Text as YText,
  XmlFragment as YXmlFragment,
  XmlElement as YXmlElement,
  XmlText as YXmlText
} from "yjs";

export type RhineVarAny<T = any> = RhineVarMap<T> | RhineVarArray<T> | RhineVarText | RhineVarXmlText | RhineVarXmlElement<T> | RhineVarXmlFragment

export type RhineVar<T> = T extends YXmlText | RhineVarXmlText
  ? RhineVarXmlText
  : T extends YXmlElement | RhineVarXmlElement<any>
    ? RhineVarXmlElement<T>
    : T extends YXmlFragment | RhineVarXmlFragment
      ? RhineVarXmlFragment
      : T extends YText | RhineVarText
        ? RhineVarText
        : T extends (infer U)[]
          ? RhineVarArray<U>
          : RhineVarMap<T>

export type RecursiveCrossRhineVar<T> =
  T extends YXmlText | RhineVarXmlText | YText | RhineVarText | YXmlFragment | RhineVarXmlFragment
    ? RhineVar<T>
    : (T extends (infer U)[]
      ? RecursiveCrossRhineVar<U>[]
      : T extends YArray<infer U> | RhineVarArray<infer U>
        ? RecursiveCrossRhineVar<U>[]
        : {
          [K in keyof T]: RecursiveCrossRhineVar<T[K]>
        }
    ) & RhineVar<T>


export type StoredRhineVar<T = any> = RecursiveCrossRhineVar<T>

export type ProxiedRhineVar<T = any> = StoredRhineVar<T>
