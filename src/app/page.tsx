"use client"
import React from "react";
import useRhine from "@/rhine-var/react/hooks/useRhine";
import './page.css'
import {websocketRhineConnect} from "@/rhine-var/core/connector/WebsocketRhineConnector";
import {rhineProxy} from "@/rhine-var/core/Proxy";


const defaultData = {value: 0}
const connector = websocketRhineConnect('wss://rhineai.com/ws/room-0')

const countState = rhineProxy(defaultData, connector)

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




