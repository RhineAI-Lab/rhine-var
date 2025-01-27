import RhineVarBase from "@/core/var/rhine-var-base.class";
import {NativeType} from "@/core/native/native-type.enum";

export default class RhineVarArray<T = any> extends RhineVarBase<T[]> implements Iterable<T> {

  type: NativeType.Array = NativeType.Array;

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

  length: number = 0

  push(...items: T[]): number {
    return 0
  }

  pop(): T | undefined {
    return {} as T | undefined
  }

  shift(): T | undefined {
    return {} as T | undefined
  }

  unshift(...items: T[]): number {
    return 0
  }

  slice(start?: number, end?: number): RhineVarArray<T> {
    return [] as any as RhineVarArray<T>
  }

  splice(start: number, deleteCount?: number, ...items: T[]): T[] {
    return []
  }

  forEach(callback: (value: T, index: number, array: RhineVarArray<T>) => void, thisArg?: any): void {
  }

  map<U>(callback: (value: T, index: number, array: RhineVarArray<T>) => U, thisArg?: any): RhineVarArray<U> {
    return {} as RhineVarArray<U>
  }

  filter(callback: (value: T, index: number, array: RhineVarArray<T>) => boolean, thisArg?: any): RhineVarArray<T> {
    return [] as any as RhineVarArray<T>
  }

  indexOf(searchElement: T, fromIndex?: number): number {
    return 0
  }

  lastIndexOf(searchElement: T, fromIndex?: number): number {
    return 0
  }

  includes(searchElement: T, fromIndex?: number): boolean {
    return false
  }

  find(predicate: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): T | undefined {
    return {} as T | undefined
  }

  findIndex(predicate: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): number {
    return 0
  }

  findLast(predicate: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): T | undefined {
    return {} as T | undefined
  }

  findLastIndex(predicate: (value: T, index: number, obj: RhineVarArray<T>) => boolean, thisArg?: any): number {
    return 0
  }

  every(callback: (value: T, index: number, array: RhineVarArray<T>) => boolean, thisArg?: any): boolean {
    return false
  }

  some(callback: (value: T, index: number, array: RhineVarArray<T>) => boolean, thisArg?: any): boolean {
    return false
  }

  reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: RhineVarArray<T>) => U, initialValue: U): U {
    return {} as U
  }

  reduceRight<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: RhineVarArray<T>) => U, initialValue: U): U {
    return {} as U
  }

  sort(compareFn?: (a: T, b: T) => number): this {
    return this
  }

  reverse(): this {
    return this
  }

  join(separator?: string): string {
    return ''
  }

  toString(): string {
    return ''
  }

  toLocaleString(): string {
    return ''
  }

  concat(...items: ConcatArray<T>[]): RhineVarArray<T> {
    return [] as any as RhineVarArray<T>
  }

  flat<U>(depth?: number): U[] {
    return [] as U[]
  }

  flatMap<U>(callback: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    return [] as U[]
  }

  copyWithin(target: number, start: number, end?: number): this {
    return this
  }

  fill(value: T, start?: number, end?: number): this {
    return this
  }

  at(index: number): T | undefined {
    return {} as T | undefined
  }

  with(index: number, value: T): RhineVarArray<T> {
    return this
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
  
  toReversed(): T[] {
    return [] as T[]
  }
  
  toSorted(compareFn?: (a: T, b: T) => number): T[] {
    return [] as T[]
  }

  toSpliced(start: number, deleteCount?: number, ...items: T[]): RhineVarArray<T> {
    return [] as any as RhineVarArray<T>
  }
}
