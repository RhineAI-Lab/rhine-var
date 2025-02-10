"use client"
import {useEffect, useState} from "react";
import {RhineVarAny, StoredRhineVar} from "@/core/var/rhine-var.type";
import {getPathFromRoot} from "@/core/utils/get-path-from-root";
import {getTargetByPathFromRoot} from "@/core/utils/get-target-by-path-from-root";
import {log} from "@/utils/logger";

export default function useRhine<T extends object>(proxy: StoredRhineVar<T>): Readonly<T> {

  const [state, setState] = useState(() => proxy.json())
  
  useEffect(() => {
    const root = proxy.root()
    const path = getPathFromRoot(proxy)

    let updateState = () => setState(() => proxy.json())

    let unsubscribeDeep = proxy.subscribeDeep(updateState)
    let unsubscribeSynced = root.subscribeSynced(() => {
      updateState()
      setTimeout(() => {
        let newProxy = getTargetByPathFromRoot(root, path)
        if (newProxy && newProxy !== proxy) {
          log('useRhine: proxy changed')
          unsubscribeDeep()
          updateState = () => setState(() => newProxy.json())
          unsubscribeDeep = proxy.subscribeDeep(updateState)
        }
        updateState()
      }, 1)
    })

    return () => {
      unsubscribeSynced()
      unsubscribeDeep()
    }
  }, [proxy])
  
  return state
}
