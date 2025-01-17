import {
  Array as YArray,
  Map as YMap,
  Text as YText,
  XmlFragment as YXmlFragment,
  XmlElement as YXmlElement,
  XmlText as YXmlText
} from "yjs";

export type Native = YMap<any> | YArray<any> | YText | YXmlText | YXmlElement<any> | YXmlFragment

export type YKey = string | number

export type YPath = YKey[]
