import {ChangeType} from "@/core/event/change-type.enum";
import {Transaction, YArrayEvent, YMapEvent} from "yjs";
import {YPath} from "@/core/native/native.type";
import {ProxiedRhineVar} from "@/core/proxy/proxied-rhine-var.type";

// The property name only indicates its meaning in the context of a list.
export type Callback<T> = (
  key: keyof T,
  value: T[keyof T] | ProxiedRhineVar<T[keyof T]>,
  oldValue: T[keyof T],
  type: ChangeType,
  nativeEvent: YMapEvent<any> | YArrayEvent<any>,
  nativeTransaction: Transaction
) => void

export type DeepCallback<T> = (
  path: YPath,
  value: any | ProxiedRhineVar<any>,
  oldValue: any,
  type: ChangeType,
  nativeEvent: YMapEvent<any> | YArrayEvent<any>,
  nativeTransaction: Transaction
) => void

export type SyncedCallback = (synced: boolean) => void
