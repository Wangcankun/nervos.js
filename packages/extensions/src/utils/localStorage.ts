export enum LocalStorageKey {
  ACTIVE_ACCOUNT_INDEX = 'ACTIVE_ACCOUNT_INDEX',
  LOCAL_PWD = 'LOCAL_PWD',
}
// account index

export const getActiveAccountIndex = (): number => {
  const idx = window.localStorage.getItem(LocalStorageKey.ACTIVE_ACCOUNT_INDEX)
  return idx ? +idx : 0
}
export const setActiveAccountIndex = (idx: number | string) => {
  window.localStorage.setItem(LocalStorageKey.ACTIVE_ACCOUNT_INDEX, '' + idx)
}

// local pwd
export const getLocalPwd = () => {
  const pwd = window.localStorage.getItem(LocalStorageKey.LOCAL_PWD) || ''
  return pwd
}
export const setLocalPwd = (pwd: string) => {
  window.localStorage.setItem(LocalStorageKey.LOCAL_PWD, '' + pwd)
}
