import {ChangeType} from "@/core/event/ChangeType";
import {Transaction, YArrayEvent, YMapEvent} from "yjs";

export type Callback = (value: any, key: string, oldValue: any, type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) => void
