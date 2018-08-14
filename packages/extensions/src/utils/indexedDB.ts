export const openDB = (name: string = 'abis', version: number = 1): IDBOpenDBRequest => {
  return window.indexedDB.open(name)
}
