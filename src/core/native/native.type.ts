import {
  Array as YArray,
  Map as YMap,
  Text as YText,
  XmlFragment as YXmlFragment,
  XmlElement as YXmlElement,
  XmlText as YXmlText
} from "yjs";

export type Native = YMap<any> | YArray<any> | YText | YXmlFragment | YXmlElement<any> | YXmlText

export type YKey = string | number

export type YPath = YKey[]
