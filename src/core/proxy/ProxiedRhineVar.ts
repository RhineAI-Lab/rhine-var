import RhineVar from "@/core/proxy/RhineVar";

export type RecursiveCrossRhineVar<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVar<T[K]> & RhineVar<T[K]> : T[K]
}

export type StoredRhineVar<T> = T & RecursiveCrossRhineVar<T> & RhineVar<T>

export type ProxiedRhineVar<T> = StoredRhineVar<T>
