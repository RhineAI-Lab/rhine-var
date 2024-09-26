"use client"
import {useEffect, useState} from "react";
import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";

export default function useRhine<T extends object>(proxy: ProxiedRhineVar<T>) {
  
  const getState = () => proxy.json() as T
  const [state, setState] = useState<T>(getState)
  
  useEffect(() => {
    proxy.subscribeDeep(() => {
      // TODO: 提高性能
      setState(getState)
    })
    proxy.connector?.addSyncedListener(() => {
      setState(getState)
    })
  }, [])
  
  return state
}

