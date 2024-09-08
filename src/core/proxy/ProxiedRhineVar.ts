import RhineVar from "@/core/proxy/RhineVar";

export type RecursiveCrossRhineVar<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVar<T[K]> & RhineVar : T[K]
}

export type ProxiedRhineVar<T> = T & RecursiveCrossRhineVar<T> & RhineVar
