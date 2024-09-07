"use client"
import {ProxiedRhineVar} from "@/rhine-var/core/Proxy";
import {useEffect, useState} from "react";

export default function useRhine<T extends object>(proxy: ProxiedRhineVar<T>) {

  const [state, setState] = useState<T>(proxy.json() as T)
  
  useEffect(() => {
    proxy.subscribe(() => {
      setState(proxy.json() as T)
    })
    proxy.connector?.addSyncedListener(() => {
      setState(proxy.json() as T)
    })
  }, [])
  
  return state
}

