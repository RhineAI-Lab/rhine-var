import {rhineProxy, rhineProxyGeneral} from "@/core/proxy/rhine-proxy";
import { RhineVar, RecursiveCrossRhineVar, StoredRhineVar, ProxiedRhineVar, RhineVarAny } from "@/core/var/rhine-var.type";
import Connector from "@/core/connector/connector.abstract";
import useRhine from "@/react/hooks/use-rhine.hook"
import useSynced from "@/react/hooks/use-synced.hook"
import {Native, YPath} from "@/core/native/native.type";
import { getRhineVarConfig, enableRhineVarLog, enableRhineVarSyncHandshakeCheck } from "@/config/config";
import RhineVarBase from "@/core/var/rhine-var-base.class";
import RhineVarMap from "@/core/var/items/rhine-var-map.class";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";
import RhineVarText from "@/core/var/items/rhine-var-text.class";
import RhineVarXmlText from "@/core/var/items/rhine-var-xml-text.class";
import RhineVarXmlElement from "@/core/var/items/rhine-var-xml-element.class";
import RhineVarXmlFragment from "@/core/var/items/rhine-var-xml-fragment.class";
import SupportManager from "@/core/var/support/support-manager";
import { text } from "@/core/proxy/items/text";
import { map } from "./core/proxy/items/map";
import {
  Doc as YDoc,
  Array as YArray,
  Map as YMap,
  Text as YText,
  XmlFragment as YXmlFragment,
  XmlElement as YXmlElement,
  XmlText as YXmlText
} from "yjs";

export {
  Connector,
  rhineProxy,
  rhineProxyGeneral,
  text,
  map,
  RhineVarBase,
  RhineVarAny,
  RhineVar,
  RhineVarMap,
  RhineVarArray,
  RhineVarText,
  RhineVarXmlText,
  RhineVarXmlElement,
  RhineVarXmlFragment,
  SupportManager,
  RecursiveCrossRhineVar,
  StoredRhineVar,
  ProxiedRhineVar,
  YPath,
  Native,
  enableRhineVarLog,
  enableRhineVarSyncHandshakeCheck,
  getRhineVarConfig,
  useRhine,
  useSynced,
  YDoc,
  YMap,
  YArray,
  YText,
  YXmlFragment,
  YXmlElement,
  YXmlText,
}
