import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Radio,
  TextField,
} from '@material-ui/core'
import AutoRenewIcon from '@material-ui/icons/Autorenew'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import * as React from 'react'
import { INervosContext, withNervos } from '../../contexts/nervos'
import withErrorHandler, { IHandleError } from '../../hoc/handleError'
import { handleInputOf } from '../../utils/compActions'
import { getActiveAccountIndex, getLocalPwd, setActiveAccountIndex, setLocalPwd } from '../../utils/localStorage'

const initState = {
  activeIdx: getActiveAccountIndex(),
  deleteIdx: -1,
  privateKey: '',
}

class Account extends React.Component<INervosContext & IHandleError, typeof initState> {
  public readonly state = initState
  public handleInput = handleInputOf(this)
  public componentDidMount() {
    const { wallet } = this.props.nervos.appchain.accounts
    const keystore = window.localStorage.getItem(wallet.defaultKeyName)
    if (!wallet.length && keystore) {
      wallet.load(getLocalPwd())
      this.forceUpdate()
    }
  }
  public addAccount = (e: any) => {
    try {
      const newAccount = this.props.nervos.appchain.accounts.privateKeyToAccount(this.state.privateKey)
      this.props.nervos.appchain.accounts.wallet.add(newAccount)
      this.saveWallet()
      this.setState({ privateKey: '' })
    } catch (err) {
      this.props.handleError(err.message)
    }
  }
  // public removeAccount = (e: any) => {}
  public saveWallet = () => {
    let pwd = getLocalPwd()
    if (pwd.length >= 8) {
      this.props.nervos.appchain.accounts.wallet.save(pwd)
    } else {
      pwd = window.prompt('Please enter pwd') || ''
      setLocalPwd(pwd)
      this.saveWallet()
    }
  }
  public randomPrivateKey = (e: any) => {
    this.setState({ privateKey: this.props.nervos.appchain.accounts.create().privateKey })
  }
  public optAccount = (e: any) => {
    const { target } = e
    if (target.type === 'radio' && target.value !== undefined) {
      // set active account
      setActiveAccountIndex(target.value)
      this.setState({
        activeIdx: +target.value,
      })
    }
  }
  public setDeleteIdx = (idx: number) => (e: any) => {
    this.setState({ deleteIdx: idx })
  }
  public removeAccount = (e: any) => {
    if (this.props.nervos.appchain.accounts.wallet.remove(this.state.deleteIdx)) {
      this.saveWallet()
      this.setState(state => {
        if (state.deleteIdx < state.activeIdx) {
          return {
            ...state,
            activeIdx: state.activeIdx - 1,
            deleteIdx: -1,
          }
        } else {
          return {
            ...state,
            deleteIdx: -1,
          }
        }
      })
      this.forceUpdate()
    }
  }
  public render() {
    const { activeIdx, deleteIdx } = this.state
    const { accounts } = this.props.nervos.appchain
    return (
      <div>
        <TextField label="private key" value={this.state.privateKey} onChange={this.handleInput('privateKey')} />
        <IconButton title="random key" onClick={this.randomPrivateKey}>
          <AutoRenewIcon />
        </IconButton>
        <IconButton title="save" onClick={this.addAccount}>
          <SaveIcon />
        </IconButton>
        <List onClick={this.optAccount}>
          <ListSubheader>Including {accounts.wallet.length} accounts</ListSubheader>
          {Array.from(accounts.wallet)
            .filter(account => account)
            .map((account: any, idx: number) => (
              <ListItem key={account.address}>
                <Radio checked={activeIdx === idx} value={'' + idx} />
                <ListItemText primary={account.address} />
                {activeIdx === idx ? null : (
                  <ListItemSecondaryAction>
                    {deleteIdx === idx ? (
                      <React.Fragment>
                        <IconButton onClick={this.removeAccount}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={this.setDeleteIdx(-1)}>
                          <DeleteIcon />
                        </IconButton>
                      </React.Fragment>
                    ) : (
                      <IconButton onClick={this.setDeleteIdx(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
        </List>
      </div>
    )
  }
}
export default withNervos(withErrorHandler(Account))
