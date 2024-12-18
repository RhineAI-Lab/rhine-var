import {rhineProxy, useRhine, enableRhineVarLog, enableRhineVarSyncHandshakeCheck} from 'rhine-var'

enableRhineVarLog(true)
enableRhineVarSyncHandshakeCheck(true)

const defaultValue = {count: 0}
const url = 'room-1'
const state = rhineProxy(defaultValue, url, false)

function Counter() {
  
  const snap = useRhine(state)
  
  return <div className='page'>
    <button onClick={() => state.count-- }> - 1 </button>
    <span>{snap.count}</span>
    <button onClick={() => state.count++ }> + 1 </button>
  </div>
}

export default Counter
