import * as React from 'react'
import { withNervos } from '../../contexts/nervos'

declare const chrome: any

class Editors extends React.Component {
  public componentDidmount() {
    function getBody() {
      return document.body
    }
    chrome.tabs.executeScript(
      {
        code: '(' + getBody + ')()',
      },
      (results: any) => {
        window.console.log(results)
      },
    )
  }
  public render() {
    return <div>hello</div>
  }
}
export default withNervos(Editors)
