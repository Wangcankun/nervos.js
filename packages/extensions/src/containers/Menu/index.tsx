import Button from '@material-ui/core/Button'
import * as React from 'react'
import { Link } from 'react-router-dom'
import routes from '../../routes/routes'

const Menu = () => (
  <div>
    {routes.map(route => (
      <Link to={route.path} key={route.path}>
        <Button color="primary">{route.path}</Button>
      </Link>
    ))}
  </div>
)
export default Menu
