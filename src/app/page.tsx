"use client"
import React from "react";
import useRhine from "@/rhine-var/react/hooks/useRhine";
import './page.css'
import {countState} from "@/app/data";


export default function page() {
  
  const count = useRhine(countState)
  
  return (
    <main className='page'>
      <button onClick={() => countState.value-- }>-</button>
      <span>{count.value}</span>
      <button onClick={() => countState.value++ }> + </button>
    </main>
  )
}

