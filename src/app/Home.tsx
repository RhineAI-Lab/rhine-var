"use client"

import {useEffect, useRef} from "react";
import TestMain from "@/app/test/TestMain";


export function Home() {
  
  function onFirstEnter() {
  }
  
  function onFirstEffect() {
    TestMain.start()
  }
  
  const firstEnter = useRef<boolean>(true)
  if (firstEnter.current) {
    firstEnter.current = false
    onFirstEnter()
  }
  const firstEffect = useRef<boolean>(true)
  useEffect(() => {
    if (firstEffect.current) {
      firstEffect.current = false
      onFirstEffect()
    }
  }, [])
  
  return <div>
  
  </div>
}
