import * as React from 'react'
import './App.css'
import nervos from './nervos'
const account = nervos.eth.accounts.create()
const transaction = {
  chainId: 1,
  from: account.address,
  nonce: 999999,
  privateKey: account.privateKey,
  quota: 1000000,
  validUntilBlock: 999999,
  value: '0x0',
  version: 0,
}

const initState = {
  current: '',
  signedMsg: '',
  transaction: JSON.stringify(transaction, null, 2),
}

class App extends React.Component<{}, typeof initState> {
  public readonly state = initState
  public componentDidMount() {
    this.updateHeight()
    nervos.appchain.getBlockNumber().then(window.console.log)
  }
  public updateHeight = () => {
    setInterval(() => {
      nervos.appchain.getBlockNumber().then((current: string) => {
        this.setState({ current })
      })
    }, 1000)
  }
  public handleInput = (key: string) => (e: any) => {
    this.setState(state => ({
      ...state,
      [key]: e.target.value,
    }))
  }
  public sign = (e: any) => {
    const signedMsg = nervos.appchain.signer(JSON.parse(this.state.transaction))
    this.setState({
      signedMsg,
    })
  }

  public render() {
    return (
      <div className="App">
        <div>current height: {this.state.current}</div>
        <div style={{ border: '1px solid #ccc' }}>
          <h5>signer</h5>
          <div>transaction</div>
          <textarea
            onChange={this.handleInput('transaction')}
            name="transaction"
            cols={30}
            rows={10}
            value={this.state.transaction}
          />
          <div>signed msg</div>
          <textarea name="signedMsg" cols={30} rows={10} value={this.state.signedMsg} />
          <button onClick={this.sign}>sign</button>
        </div>
      </div>
    )
  }
}

export default App
