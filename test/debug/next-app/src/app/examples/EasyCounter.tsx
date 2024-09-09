
import {rhineProxy, useRhine} from 'rhine-var'

const defaultValue = {value: 0}
const count = rhineProxy(defaultValue, 'localhost:6600/room-0')

function Counter() {
  
  const countSnap = useRhine(count)
  
  return <div className='page'>
    <button onClick={() => count.value-- }> - 1 </button>
    <span>{countSnap.value}</span>
    <button onClick={() => count.value++ }> + 1 </button>
  </div>
}



export default Counter
