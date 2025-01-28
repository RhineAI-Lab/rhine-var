import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";
import {InputItem, RecursiveArray} from "@/core/var/rhine-var.type";


export default class RhineVarArray<T = any, N = any> extends RhineVarBase<T[]> implements Iterable<T> {

  type: NativeType.Array = NativeType.Array;

  [key: number]: T

  length: number = 0

  push(...items: InputItem<N>[]): number {
    return -1
  }

  pop(): T | undefined {
    return undefined
  }

  shift(): T | undefined {
    return undefined
  }

  unshift(...items: InputItem<N>[]): number {
    return -1
  }

  slice(start?: number, end?: number): T[] {
    return []
  }

  splice(start: number, deleteCount?: number, ...items: InputItem<N>[]): T[] {
    return []
  }

  forEach(callback: (value: T, index: number, array: RecursiveArray<N>) => void, thisArg?: any): void {
  }

  map<U>(callback: (value: T, index: number, array: RecursiveArray<N>) => U, thisArg?: any): U[] {
    return [] as U[]
  }

  filter(callback: (value: T, index: number, array: RecursiveArray<N>) => boolean, thisArg?: any): T[] {
    return [] as T[]
  }

  indexOf(searchElement: InputItem<N>, fromIndex?: number): number {
    return -1
  }

  lastIndexOf(searchElement: InputItem<N>, fromIndex?: number): number {
    return -1
  }

  includes(searchElement: InputItem<N>, fromIndex?: number): boolean {
    return false
  }

  at(index: number): T | undefined {
    return undefined
  }

  with(index: number, value: InputItem<N>): T[] {
    return []
  }

  join(separator?: string): string {
    return ''
  }

  some(callback: (value: T, index: number, array: RecursiveArray<T>) => boolean, thisArg?: any): boolean {
    return false
  }

  every(callback: (value: T, index: number, array: RecursiveArray<T>) => boolean, thisArg?: any): boolean {
    return false
  }

  find(callback: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): T | undefined {
    return {} as T | undefined
  }

  findIndex(callback: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): number {
    return -1
  }

  findLast(callback: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): T | undefined {
    return {} as T | undefined
  }

  findLastIndex(callback: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): number {
    return -1
  }

  entries(): IterableIterator<[number, T]> {
    return {} as IterableIterator<[number, T]>
  }

  keys(): IterableIterator<number> {
    return {} as IterableIterator<number>
  }

  values(): IterableIterator<T> {
    return {} as IterableIterator<T>
  }

  reverse(): this {
    return this
  }

  sort(compareFn?: (a: T, b: T) => number): this {
    return this
  }

  fill(value: T, start?: number, end?: number): this {
    return this
  }

  concat(...items: InputItem<N>[]): T[] {
    return []
  }

  toReversed(): T[] {
    return []
  }

  toSorted(compareFn?: (a: T, b: T) => number): T[] {
    return []
  }

  toSpliced(start: number, deleteCount?: number, ...items: InputItem<N>[]): T[] {
    return []
  }

  copyWithin(target: number, start: number, end?: number): this {
    return this
  }

  toString(): string {
    return ''
  }

  toLocaleString(): string {
    return ''
  }

  flat<U>(depth?: number): U[] {
    return []
  }

  flatMap<U>(callback: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    return []
  }

  reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U {
    return {} as U
  }

  reduceRight<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U {
    return {} as U
  }

  [Symbol.iterator](): Iterator<T> {
    return {} as Iterator<T>
  }

  [Symbol.unscopables] = {
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
