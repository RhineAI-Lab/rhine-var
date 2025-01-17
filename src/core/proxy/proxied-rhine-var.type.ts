import RhineVarBaseItem from "@/core/var/rhine-var-base-item.class";
import RhineVar from "@/core/var/rhine-var.class";

export type RecursiveCrossRhineVarItem<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVarItem<T[K]> & RhineVarBaseItem<T[K]> : T[K]
}

export type StoredRhineVarItem<T> = T & RecursiveCrossRhineVarItem<T> & RhineVarBaseItem<T>

export type ProxiedRhineVarItem<T> = StoredRhineVarItem<T>


export type RecursiveCrossRhineVar<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVarItem<T[K]> & RhineVarBaseItem<T[K]> : T[K]
}

export type StoredRhineVar<T> = T & RecursiveCrossRhineVar<T> & RhineVar<T>

export type ProxiedRhineVar<T> = StoredRhineVar<T>
