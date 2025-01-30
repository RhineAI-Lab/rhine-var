import {RhineVarAny, YText} from "@/index";
import SupportBase from "@/core/var/support/support-base";
import RhineVarText from "@/core/var/items/rhine-var-text.class";


export default class SupportText extends SupportBase {

  static TARGET_TAG = 'RhineVarText'

  static convertProperty<T>(key: string | symbol, object: RhineVarAny): any {
    if (!(object.native instanceof YText) || !(object instanceof RhineVarText)) {
      console.error('Unsupported convertProperty:', object, object.native)
      return
    }
    const text = object as any as RhineVarText
    const native = object.native as any as YText


    switch (key) {
      case 'length':
        return native.length
      default:
        return null
    }
  }

  static SUPPORTED_PROPERTIES = new Set<string | symbol>([
    Symbol.iterator,
    Symbol.unscopables,
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
    'lastIndexOf',
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
    'toString',
    'toLocaleString',
    'fill',
    'concat',
    'copyWithin',
    'reverse',
    'sort',
    'toReversed',
    'toSorted',
    'toSpliced',
    'flat',
    'flatMap',
    'reduce',
    'reduceRight',
  ])

  static UNSUPPORTED_PROPERTIES = new Set<string | symbol>([
  ])
}
