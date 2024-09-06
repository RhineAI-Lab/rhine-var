
export default interface User {
  name: string
  age: number
  friends: Friend[]
  job: {
    enterprise: string
    position: string
    range: Range
  }
}

export enum Sex {
  Male = 'Male',
  Female = 'Female',
}

export interface Friend {
  name: string
  sex: string
}

export interface Range {
  start: number
  end: number
}
