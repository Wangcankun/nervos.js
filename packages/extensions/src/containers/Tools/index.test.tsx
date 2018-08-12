import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Tools from './index'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Tools />, div)
  ReactDOM.unmountComponentAtNode(div)
})
