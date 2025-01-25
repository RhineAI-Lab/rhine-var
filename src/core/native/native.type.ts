import {
  Array as YArray,
  Map as YMap,
  Text as YText,
  XmlFragment as YXmlFragment,
  XmlElement as YXmlElement,
  XmlText as YXmlText
} from "yjs";

export type Native<T = any> = YMap<T> | YArray<T> | YText | YXmlText | YXmlElement<any> | YXmlFragment

export type YKey = string | number

export type YPath = YKey[]
