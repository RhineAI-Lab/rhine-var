import {RhineVar} from "@/core/var/rhine-var.type";

export type RecursiveCrossRhineVar<T = any> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVar<T[K]> & RhineVar<T[K]> : T[K]
}

export type StoredRhineVar<T = any> = T & RecursiveCrossRhineVar<T> & RhineVar<T>

export type ProxiedRhineVar<T = any> = StoredRhineVar<T>
