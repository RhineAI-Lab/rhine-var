import {RhineVar} from "@/core/var/rhine-var.type";
import {Native} from "@/core/native/native.type";
import {Array as YArray, Map as YMap, XmlFragment as YXmlFragment, XmlElement as YXmlElement, Text as YText, XmlText as YXmlText} from "yjs";
import RhineVarMap from "@/core/var/itmes/rhine-var-map.class";
import RhineVarArray from "@/core/var/itmes/rhine-var-array.class";
import RhineVarText from "@/core/var/itmes/rhine-var-text.class";
import RhineVarXmlFragment from "@/core/var/itmes/rhine-var-xml-fragment.class";
import RhineVarXmlElement from "@/core/var/itmes/rhine-var-xml-element.class";
import RhineVarXmlText from "@/core/var/itmes/rhine-var-xml-text.class";

export function createRhineVar<T = any>(target: Native, parent: RhineVar | null): RhineVar<T> {
  if (target instanceof YMap) {
    return new RhineVarMap<T>(target, parent)
  } else if (target instanceof YArray) {
    return new RhineVarArray<T>(target, parent)
  } else if (target instanceof YXmlText) {
    return new RhineVarXmlText(target, parent)
  } else if (target instanceof YXmlElement) {
    return new RhineVarXmlElement(target, parent)
  } else if (target instanceof YXmlFragment) {
    return new RhineVarXmlFragment(target, parent)
  } else if (target instanceof YText) {
    return new RhineVarText(target, parent)
  } else {
    throw new Error('Unsupported target type to createRhineVar')
  }
}
