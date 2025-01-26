import {RhineVarAny, YArray} from "@/index";
import SupportBase from "@/core/var/support/support-base";
import {ensureNativeOrBasic} from "@/core/utils/var.utils";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";

export default class SupportArray extends SupportBase {

  static TARGET_TAG = 'RhineVarArray'

  static convertProperty<T>(key: string | symbol, object: RhineVarAny): any {
    if (!(object.native instanceof YArray) || !(object instanceof RhineVarArray)) {
      console.error('Unsupported convertProperty:', object, object.native)
      return
    }
    const native = object.native as any as YArray<T>

    const get = (i: number) => {
      if (i in object) {
        return Reflect.get(object, i)
      } else {
        return native.get(i)
      }
    }

    if (key === 'length') {
      return native.length
    } if (key === 'push') {
      return (...items: any[]): number => {
        for (let i = 0; i < items.length; i++) {
          items[i] = ensureNativeOrBasic(items[i])
        }
        native.push(items)
        return native.length
      }
    }

    return null
  }

  static SUPPORTED_PROPERTIES = new Set<string | symbol>([
    'length',
    'push',
    'pop',
    'unshift',
    'shift',
    'slice',
    'splice',
    'forEach',
    'map',
    'indexOf',
    'includes',
    'at',
    'with',
    'join',
    'filter',
    'some',
    'every',
    'find',
    'findIndex',
    'findLast',
    'findLastIndex',
    'entries',
    'keys',
    'values',
  ])

  static UNSUPPORTED_PROPERTIES = new Set<string | symbol>([
    'contact',
    'copyWithin',
    'flat',
    'flatMap',
    'reduce',
    'reduceRight',
    'reverse',
    'sort',
    'toReversed',
    'toSorted',
    'toSpliced',
  ])
}
