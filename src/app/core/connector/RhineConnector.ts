import {Map as YMap, Array as YArray, Doc as YDoc} from "yjs";


export default class RhineConnector {
  
  yDoc: YDoc
  yBaseMap: YMap<any>
  url: string = ''
  
  constructor(url = '') {
    this.yDoc = new YDoc()
    this.yBaseMap = this.yDoc.getMap()
    url && this.connect(url)
  }
  
  bind(target: YMap<any> | YArray<any>) {
    this.yBaseMap.set('state', target)
  }
  
  connect(url: string) {
    this.url = url
  }
  
  
}
