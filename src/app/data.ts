import {websocketRhineConnect} from "@/rhine-var/core/connector/WebsocketRhineConnector";
import {rhineProxy} from "@/rhine-var/core/Proxy";

interface CountState {
  value: number
}
const defaultData: CountState = {
  value: 0
}

const connector = websocketRhineConnect('wss://rhineai.com/ws/test-room-0')

export const countState = rhineProxy<CountState>(defaultData, connector, false)

