import {ChangeType} from "@/core/event/change-type.enum";
import {Text as YText, Transaction, YArrayEvent, YMapEvent, YTextEvent} from "yjs";
import {YPath} from "@/core/native/native.type";
import {ProxiedRhineVar} from "@/core/var/rhine-var.type";

// The property name only indicates its meaning in the context of a list.
export type Callback<T> = (
  key: keyof T,
  value: T[keyof T] extends object ? T[keyof T] | ProxiedRhineVar<T[keyof T]> : T[keyof T],
  oldValue: T[keyof T],
  type: ChangeType,
  nativeEvent: YMapEvent<any> | YArrayEvent<any> | YTextEvent,
  nativeTransaction: Transaction
) => void

export type DeepCallback<T> = (
  path: YPath,
  value: any | ProxiedRhineVar<any>,
  oldValue: any,
  type: ChangeType,
  nativeEvent: YMapEvent<any> | YArrayEvent<any> | YTextEvent,
  nativeTransaction: Transaction
) => void

export type SyncedCallback = (synced: boolean) => void
