import RhineVarItem from "@/core/proxy/RhineVarItem";
import RhineVar from "@/core/proxy/RhineVar";

export type RecursiveCrossRhineVarItem<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVarItem<T[K]> & RhineVarItem<T[K]> : T[K]
}

export type StoredRhineVarItem<T> = T & RecursiveCrossRhineVarItem<T> & RhineVarItem<T>

export type ProxiedRhineVarItem<T> = StoredRhineVarItem<T>


export type RecursiveCrossRhineVar<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVarItem<T[K]> & RhineVarItem<T[K]> : T[K]
}

export type StoredRhineVar<T> = T & RecursiveCrossRhineVar<T> & RhineVar<T>

export type ProxiedRhineVar<T> = StoredRhineVar<T>
