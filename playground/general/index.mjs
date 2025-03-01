import {rhineProxy, enableRhineVarLog, WebsocketConnector} from "rhine-var";


console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const state = rhineProxy({
    count: 0,
}, new WebsocketConnector('ws://localhost:8080'))

state.afterSynced(() => {
    console.log(++state.count)
    process.exit()
})

setInterval(() => {
    console.log('Waiting for sync...')
}, 1000)
