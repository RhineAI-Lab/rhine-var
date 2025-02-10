import {rhineProxy, useRhine, enableRhineVarLog} from 'rhine-var'

enableRhineVarLog(true)

const defaultValue = {
  data: {
    count: 0
  }
}
const url = 'room-1'
const state = rhineProxy(defaultValue, url)

function Counter() {
  
  const snap = useRhine(state.data)
  
  return <div className='page' onClick={() => {
    console.log(state.json())
  }}>
    <button onClick={() => state.data.count-- }> - 1 </button>
    <span onClick={() => state.data.count = 0}>{snap.count}</span>
    <button onClick={() => state.data.count++ }> + 1 </button>
  </div>
}

export default Counter
