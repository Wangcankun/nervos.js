import * as React from 'react'
import nervos from '../nervos'

export interface INervosContext {
  nervos: typeof nervos
}

const { Provider, Consumer } = React.createContext<INervosContext>(nervos)

export const NervosProvider = (props: React.Props<any>) => <Provider value={nervos}>{props.children}</Provider>
export const withNervos = (Comp: typeof React.Component) => (props: React.Props<any>) => (
  <Consumer>{nervosCtx => <Comp {...props} nervos={nervosCtx} />}</Consumer>
)
