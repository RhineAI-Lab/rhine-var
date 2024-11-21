import {Map as YMap} from "yjs";
import {log} from "@/utils/logger";

export default class SyncHandshakeCheck {

  static async wait(baseMap: YMap<any>) {
    const waitSync = (syncMap: YMap<any>) => {
      syncMap.set('role', 'client')
      syncMap.set('timestamp', Date.now())
      log('Sync handshake start', syncMap.toJSON())
      setTimeout(() => {
        const syncObserver = () => {
          if (syncMap.get('role') === 'server') {
            log('Sync handshake successfully', syncMap.toJSON())
            syncMap.unobserve(syncObserver)
          }
        }
        syncMap.observe(syncObserver)
        syncObserver()
      }, 1)
    }
    if (baseMap.has('sync')) {
      waitSync(baseMap.get('sync'))
    } else {
      log('Sync handshake waiting...')
      const mapObserver = () => {
        console.log(baseMap.toJSON())
        if (baseMap.has('sync')) {
          baseMap.unobserve(mapObserver)
          waitSync(baseMap.get('sync'))
        }
      }
      baseMap.observe(mapObserver)
    }
  }


}
