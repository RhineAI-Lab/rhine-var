"use client"
import {useEffect, useState} from "react";
import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";

export default function useRhine<T extends object>(proxy: ProxiedRhineVar<T>) {
  
  const createSnapshot = () => proxy.json() as T
  const [state, setState] = useState<T>(createSnapshot)
  
  useEffect(() => {
    const updateState = () => {
      setState(createSnapshot)
    }
    proxy.subscribeDeep(updateState)
    proxy.afterSynced(updateState)
    return () => {
      proxy.unsubscribeDeep(updateState)
    }
  }, [proxy])
  
  return state
}
