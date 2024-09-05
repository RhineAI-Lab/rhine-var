"use client"

import {useEffect, useRef} from "react";
import MainService from "@/app/MainService";


export function Home() {
  
  function onFirstEnter() {
  }
  
  function onFirstEffect() {
    MainService.initialize()
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
