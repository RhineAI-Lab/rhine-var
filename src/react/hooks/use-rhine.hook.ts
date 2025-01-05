"use client"
import {useEffect, useState} from "react";
import {ProxiedRhineVar} from "@/core/proxy/proxied-rhine-var.type";

export default function useRhine<T extends object>(proxy: ProxiedRhineVar<T>): Readonly<T> {
  
  const createSnapshot = () => proxy.json() as Readonly<T>
  const [state, setState] = useState(createSnapshot)
  
  useEffect(() => {
    const updateState = () => setState(createSnapshot)
    const unsubscribeSynced = proxy.subscribeSynced(updateState)
    const unsubscribeDeep = proxy.subscribeDeep(updateState)
    return () => {
      unsubscribeSynced()
      unsubscribeDeep()
    }
  }, [proxy])
  
  return state
}
