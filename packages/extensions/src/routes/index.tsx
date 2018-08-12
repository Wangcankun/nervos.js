import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Menu from '../containers/Menu'
import routes from './routes'

const Routes = () => (
  <Router>
    <React.Fragment>
      <Route path="/" component={Menu} />
      {routes.map(route => <Route path={route.path} key={route.path} component={route.component} />)}
    </React.Fragment>
  </Router>
)
export default Routes
