
export default class DirectPackage {
  constructor(
    public data: any
  ) {}
}

export function directPackage(data: any) {
  return new DirectPackage(data)
}
