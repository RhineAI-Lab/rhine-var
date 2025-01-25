import { YMap } from "@/index"

export default class YObject<T> extends YMap<any> {

  constructor() {
    super()
  }

  isObject = true
}
