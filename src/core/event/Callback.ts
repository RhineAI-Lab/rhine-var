import {ChangeType} from "@/core/event/ChangeType";
import {Transaction, YArrayEvent, YMapEvent} from "yjs";
import {Native, YPath} from "@/core/native/Native";

// The property name only indicates its meaning in the context of a list.
export type Callback<T> = (
  key: keyof T,
  value: T[keyof T],
  oldValue: T[keyof T],
  type: ChangeType,
  nativeEvent: YMapEvent<any> | YArrayEvent<any>,
  nativeTransaction: Transaction
) => void

export type DeepCallback<T> = (
  key: YPath,
  value: any,
  oldValue: any,
  type: ChangeType,
  nativeTarget: Native,
  nativeEvent: YMapEvent<any> | YArrayEvent<any>,
  nativeTransaction: Transaction
) => void
