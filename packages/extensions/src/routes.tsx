import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const Account = () => <div>Account</div>
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
]

const Routes = () => (
  <Router>
    <React.Fragment>
      {routes.map(route => <Route path={route.path} key={route.path} component={route.component} />)}
    </React.Fragment>
  </Router>
)
export default Routes
