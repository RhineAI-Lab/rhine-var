"use client"

import React from "react";
import {rhineProxy, useRhine} from "rhine-var";


const defaultValue = {value: 0}
const count = rhineProxy<{value: number}>(defaultValue, 'RhineAI.com/ws/room-0', false)

count.subscribe((value) => {
  console.log('value:', value)
})

export default function EasyCounter() {
  
  const countSnap = useRhine(count)
  
  return <div className='page'>
    <button onClick={() => count.value-- }> - 1 </button>
    <span>{countSnap.value}</span>
    <button onClick={() => count.value++ }> + 1 </button>
  </div>
}


