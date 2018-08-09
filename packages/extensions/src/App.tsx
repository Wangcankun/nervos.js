import * as React from 'react'
import './App.css'
import nervos from './nervos'
const transaction = {}

const initState = {
  abi: '',
  bytecode: '',
  chainId: 1,
  current: '',
  // from:'',
  nonce: 999999,
  parameters: '',
  privateKey: '',
  quota: 1000000,
  signedMsg: '',
  transaction: JSON.stringify(transaction, null, 2),
  unsigned: '',
  validUntilBlock: 999999,
  value: '0x0',
  version: 0,
}

class App extends React.Component<{}, typeof initState> {
  public static transactionFields = ['chainId', 'nonce', 'quota', 'validUntilBlock', 'value', 'version']
  public readonly state = initState
  public componentDidMount() {
    this.updateHeight()
  }
  public updateHeight = () => {
    setInterval(() => {
      nervos.appchain.getBlockNumber().then((current: string) => {
        this.setState({ current })
      })
    }, 1000)
  }
  public addAccount = (e: any) => {
    const newAccount = nervos.eth.accounts.privateKeyToAccount(this.state.privateKey)
    nervos.eth.accounts.wallet.add(newAccount)
    this.setState({ privateKey: '' })
  }
  public randomPrivateKey = (e: any) => {
    this.setState({ privateKey: nervos.eth.accounts.create().privateKey })
  }
  public handleInput = (key: string) => (e: any) => {
    const { value } = e.currentTarget
    this.setState(state => ({
      ...state,
      [key]: value,
    }))
  }
  public sign = (e: any) => {
    if (!nervos.eth.accounts.wallet[0]) {
      alert('add account please')
      return
    }
    const tx = this.getTx()
    const signedMsg = nervos.appchain.signer(tx, nervos.eth.accounts.wallet[0].privateKey)
    this.setState({
      signedMsg,
    })
  }
  public unsign = (e: any) => {
    try {
      const unsigned = JSON.stringify(nervos.appchain.unsigner(this.state.signedMsg), null, 2)
      this.setState({ unsigned })
    } catch (e) {
      window.console.error(e)
    }
  }
  public deploy = (e: any) => {
    if (!this.state.bytecode) {
      return alert('enter bytecode please')
    }
    if (!this.state.abi) {
      return alert('enter abi please')
    }
    const parameters = this.state.parameters || '[]'
    // if (!this.state.parameters) {

    // }
    try {
      const parsedAbi = JSON.parse(this.state.abi)
      const myContract = new nervos.appchain.Contract(parsedAbi)
      const tx = this.getTx()
      const p = JSON.parse(parameters)
      myContract
        .deploy({
          arguments: p,
          data: this.state.bytecode,
        })
        .send({ ...tx, privateKey: nervos.eth.accounts.wallet[0].privateKey })
        .then((res: any) => {
          if (res.hash) {
            return nervos.listeners.listenToTransactionReceipt(res.hash)
          }
          throw new Error('no tx hash received')
        })
        .then((receipt: any) => {
          window.console.log(receipt)
          if (receipt.errorMessage) {
            throw new Error(receipt.errorMessage)
          }
          if (receipt.contractAddress) {
            window.alert('Contract deployed at ' + receipt.contractAddress)
          }
        })
        .catch((err: any) => {
          window.alert(err)
        })
    } catch (e) {
      window.alert(e)
    }
  }
  public getTx = () => {
    const tx = { from: '' }
    if (nervos.eth.accounts.wallet.length) {
      tx.from = nervos.eth.accounts.wallet[0].address
    }
    App.transactionFields.forEach(field => {
      tx[field] = this.state[field]
    })
    return tx
  }

  public render() {
    return (
      <div className="App">
        <div>current height: {this.state.current}</div>
        <div>of chain: {nervos.currentProvider.host}</div>
        <div>
          <div>add account</div>
          <input type="password" value={this.state.privateKey} onChange={this.handleInput('privateKey')} />
          <button onClick={this.randomPrivateKey}>random private key</button>
          <button onClick={this.addAccount}>add</button>
          <div>account count: {nervos.eth.accounts.wallet.length}</div>
        </div>
        <div style={{ border: '1px solid #ccc', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div>signer</div>
          <div>transaction</div>
          {App.transactionFields.map(field => (
            <div key={field} style={{ textAlign: 'left', display: 'block', margin: '0 auto' }}>
              <label htmlFor={field} style={{ display: 'block' }}>
                {field}:
              </label>
              <input value={this.state[field]} onChange={this.handleInput(field)} />
            </div>
          ))}
          <div>signed msg</div>
          <textarea
            name="signedMsg"
            cols={30}
            rows={10}
            value={this.state.signedMsg}
            onChange={this.handleInput('signedMsg')}
          />
          <button onClick={this.sign}>sign</button>
          {this.state.signedMsg ? <button onClick={this.unsign}>unsign</button> : null}
          {this.state.unsigned}
        </div>
        <div style={{ border: '1px solid #ccc' }}>
          <div>bytecode</div>
          <textarea
            name="bytecode"
            onChange={this.handleInput('bytecode')}
            cols={30}
            rows={10}
            value={this.state.bytecode}
          />
          <div>parameters</div>
          <input type="text" onChange={this.handleInput('parameters')} value={this.state.parameters} />
          <div>ABI</div>
          <textarea name="abi" onChange={this.handleInput('abi')} cols={30} rows={10} value={this.state.abi} />
          <button onClick={this.deploy}>deploy</button>
        </div>
      </div>
    )
  }
}

export default App
