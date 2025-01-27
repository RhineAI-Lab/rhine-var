import {Native, RhineVarAny, YArray} from "@/index";
import SupportBase from "@/core/var/support/support-base";
import {ensureNativeOrBasic, isRhineVar} from "@/core/utils/var.utils";
import RhineVarArray from "@/core/var/items/rhine-var-array.class";
import {isNative} from "@/core/native/native.utils";
import RhineVarBase from "@/core/var/rhine-var-base.class";

export default class SupportArray extends SupportBase {

  static native_TAG = 'RhineVarArray'

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

    const getJson = (i: number) => {
      let item = get(i)
      if (isNative(item)) {
        return (item as Native).toJSON() as T
      }
      if (isRhineVar(item)) {
        return item.json()
      }
      return item as T
    }

    if (key === 'length') {
      return native.length
    } else if (key === 'push') {
      return (...items: any[]): number => {
        for (let i = 0; i < items.length; i++) {
          items[i] = ensureNativeOrBasic(items[i])
        }
        native.push(items)
        return native.length
      }
    } else if (key === 'pop') {
      return (): T | undefined => {
        if (native.length === 0) return undefined
        let key = native.length - 1
        let item = getJson(key)
        native.delete(key)
        return item as T
      }
    } else if (key === 'shift') {
      return (): T | undefined => {
        if (native.length === 0) return undefined
        let key = 0
        let item = getJson(key)
        native.delete(key)
        return item as T
      }
    } else if (key === 'unshift') {
      return (...items: any[]): number => {
        for (let i = 0; i < items.length; i++) {
          items[i] = ensureNativeOrBasic(items[i])
        }
        native.unshift(items)
        return native.length
      }
    } else if (key === 'slice') {
      return (start: number, end?: number): RhineVarBase<any>[] => {
        if (end === undefined) end = native.length
        if (start < 0) start = native.length + start
        if (end < 0) end = native.length + end
        if (start < 0) start = 0
        if (end > native.length) end = native.length
        let result = []
        for (let i = start; i < end; i++) {
          result.push(getJson(i))
        }
        return result
      }
    } else if (key === 'splice') {
      return (start: number, deleteCount: number, ...items: T[]): T[] => {
        const removed = []
        for (let i = start; i < start + deleteCount; i++) {
          let item = getJson(i)
          removed.push(item)
        }
        native.delete(start, deleteCount)
        if (items.length > 0) {
          let nativeItems: any[] = []
          for (let i = 0; i < items.length; i++) {
            nativeItems.push(ensureNativeOrBasic(items[i]))
          }
          native.insert(start, nativeItems)
        }
        return removed
      }
    } else if (key === 'forEach') {
      return (callback: (value: T, index: number, arr: YArray<any>) => void) => {
        return native.forEach((yValue, yIndex, yArray) => {
          callback(getJson(yIndex), yIndex, yArray)
        })
      }
    } else if (key === 'map') {
      return <R>(callback: (value: T, index: number, arr: YArray<any>) => R) => {
        const result: R[] = []
        native.forEach((yValue, yIndex, yArray) => {
          result.push(callback(getJson(yIndex), yIndex, yArray))
        })
        return result
      }
    } else if (key === 'filter') {
      return (callback: (item: T) => boolean): T[] => {
        let result: T[] = []
        for (let i = 0; i < native.length; i++) {
          let item = getJson(i)
          if (callback(item)) result.push(item)
        }
        return result
      }
    } else if (key === 'indexOf') {
      return (item: T) => {
        for (let i = 0; i < native.length; i++) {
          if (getJson(i) === item) return i
        }
        return -1
      }
    } else if (key === 'lastIndexOf') {
      return (item: T) => {
        for (let i = native.length - 1; i >= 0; i--) {
          if (getJson(i) === item) return i
        }
        return -1
      }
    } else if (key === 'includes') {
      return (item: T) => {
        for (let i = 0; i < native.length; i++) {
          if (get(i) === item) return true
        }
        return false
      }
    } else if (key === 'at') {
      return (i: number): T => {
        if (i < 0) i = native.length + i
        if (i < 0 || i >= native.length) return undefined as any
        return get(i)
      }
    } else if (key === 'with') {
      return (i: number, value: T): T[] => {
        if (i < 0) i = native.length + i
        if (i < 0 || i >= native.length) throw 'RangeError: Unexpect index ' + i + ' in RhineVarArray(' + native.length + ')'
        const array = object.json() as T[]
        array[i] = value
        return array
      }
    } else if (key === 'join') {
      return (str: string = ','): string => {
        let result = ''
        for (let i = 0; i < native.length; i++) {
          if (i > 0) result += str
          let item = getJson(i)
          result += item
        }
        return result
      }
    } else if (key === 'some') {
      return (callback: (item: T) => boolean): boolean => {
        for (let i = 0; i < native.length; i++) {
          if (callback(getJson(i))) return true
        }
        return false
      }
    } else if (key === 'every') {
      return (callback: (item: T) => boolean): boolean => {
        for (let i = 0; i < native.length; i++) {
          if (!callback(getJson(i))) return false
        }
        return true
      }
    } else if (key === 'find') {
      return (callback: (item: T) => boolean): T | undefined => {
        for (let i = 0; i < native.length; i++) {
          let item = getJson(i)
          if (callback(item)) return item
        }
        return undefined
      }
    } else if (key === 'findIndex') {
      return (callback: (item: T) => boolean): number => {
        for (let i = 0; i < native.length; i++) {
          if (callback(getJson(i))) return i
        }
        return -1
      }
    } else if (key === 'findLast') {
      return (callback: (item: T) => boolean): T | undefined => {
        for (let i = native.length - 1; i >= 0; i--) {
          let item = getJson(i)
          if (callback(item)) return item
        }
        return undefined
      }
    } else if (key === 'findLastIndex') {
      return (callback: (item: T) => boolean): number => {
        for (let i = native.length - 1; i >= 0; i--) {
          if (callback(getJson(i))) return i
        }
        return -1
      }
    } else if (key === 'entries') {
      return (): IterableIterator<[number, T]> => {
        let i = 0;
        return {
          next() {
            if (i < native.length) {
              return {value: [i, getJson(i++)], done: false}
            } else {
              return {value: undefined, done: true}
            }
          },
          [Symbol.iterator]() {
            return this
          }
        }
      }
    } else if (key === 'keys') {
      return (): IterableIterator<number> => {
        let i = 0
        return {
          next() {
            if (i < native.length) {
              return { value: i++, done: false }
            } else {
              return { value: undefined, done: true }
            }
          },
          [Symbol.iterator]() {
            return this;
          },
        }
      }
    } else if (key === 'values') {
      return (): IterableIterator<T> => {
        let i = 0
        return {
          next() {
            if (i < native.length) {
              return {value: getJson(i++), done: false}
            } else {
              return {value: undefined, done: true}
            }
          },
          [Symbol.iterator]() {
            return this
          },
        }
      }
    } else if (key === Symbol.iterator) {
      return (): IterableIterator<T> => {
        let i = 0
        return {
          next() {
            if (i < native.length) {
              return {value: getJson(i++), done: false}
            } else {
              return {value: undefined, done: true}
            }
          },
          [Symbol.iterator]() {
            return this
          },
        }
      }
    } else if (key === 'fill') {
      return (value: T, start: number = 0, end: number = native.length): void => {
        if (start < 0) start = native.length + start
        if (end < 0) end = native.length + end
        if (start < 0) start = 0
        if (end > native.length) end = native.length
        if (start >= end) return
        native.delete(start, end - start)
        let items: any[] = []
        for (let i = start; i < end; i++) {
          items.push(ensureNativeOrBasic(value))
        }
        native.insert(start, items)
      }
    } else if (key === 'concat') {
      return (...items: T[][]): T[] => {
        let result = object.json() as T[]
        return result.concat(...items)
      }
    } else if (key === 'toString') {
      return (): string => {
        return object.toString()
      }
    } else if (key === 'toLocaleString') {
      return (): string => {
        return object.toLocaleString()
      }
    } else if (key === Symbol.unscopables) {
      return {
        copyWithin: true,
        entries: true,
        fill: true,
        find: true,
        findIndex: true,
        flat: true,
        flatMap: true,
        includes: true,
        keys: true,
        values: true,
        join: true,
        map: true,
        reverse: true,
        slice: true,
        some: true,
        splice: true,
        toLocaleString: true,
        toString: true,
      }
    }

    return null
  }

  static SUPPORTED_PROPERTIES = new Set<string | symbol>([
    Symbol.iterator,
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
  ])

  static UNSUPPORTED_PROPERTIES = new Set<string | symbol>([
    Symbol.unscopables,
    'fill',
    'concat',
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
