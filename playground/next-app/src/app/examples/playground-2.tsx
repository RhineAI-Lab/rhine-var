"use client"

import React from "react";
import {rhineProxy, enableRhineVarLog, map} from "rhine-var";
import {StoredRhineVar} from "../../../../../src";
import {string} from "prop-types";

console.log('\n\n=================== Rhine Var Playground 2 ===================\n\n')

enableRhineVarLog(true)



const defaultValue = {
  names: map<string>()
}

const state = rhineProxy(defaultValue, 'ws://localhost:11600/room-3', {
  overwrite: true
})


export default function Playground2() {
  return <div className='page'/>
}
