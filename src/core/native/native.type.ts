import { YMap, YArray, YText, YXmlText, YXmlElement, YXmlFragment } from "@/index"
import YObject from "@/core/native/y-object";


export type Native<T extends object = any> = YObject<T> | YMap<T> | YArray<T> | YText | YXmlText | YXmlElement<any> | YXmlFragment

export type YKey = string | number

export type YPath = YKey[]
