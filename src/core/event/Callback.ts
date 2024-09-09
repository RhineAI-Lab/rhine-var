import {ChangeType} from "@/core/event/ChangeType";
import {Transaction, YArrayEvent, YMapEvent} from "yjs";

// The property name only indicates its meaning in the context of a list.
export type Callback<T> = (
  value: T[keyof T],
  key: keyof T,
  oldValue: T[keyof T],
  type: ChangeType,
  nativeEvent: YMapEvent<any> | YArrayEvent<any>,
  nativeTransaction: Transaction
) => void
