import * as React from 'react'
import Account from '../containers/Account'
import Editors from '../containers/Editors'
import Tools from '../containers/Tools'
const Contract = () => <div>Contract</div>

const routes = [
  {
    component: Account,
    path: '/account',
  },
  {
    component: Contract,
    path: '/contract',
  },
  {
    component: Tools,
    path: '/tools',
  },
  {
    component: Editors,
    path: '/editors',
  },
]
export default routes
