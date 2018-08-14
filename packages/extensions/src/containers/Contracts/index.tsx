import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SaveIcon from '@material-ui/icons/Save'
import * as React from 'react'
import { INervosContext, withNervos } from '../../contexts/nervos'
import { handleInputOf } from '../../utils/compActions'
import { openDB } from '../../utils/indexedDB'

export interface IMethod {
  type: string
}
export interface IContract {
  methods: IMethod[]
}

export const ContractPanel = (contract: IContract) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Contract</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>hello</ExpansionPanelDetails>
  </ExpansionPanel>
)

const initState = {
  contracts: [] as IContract[],
  inputAbi: '',
  inputAbiError: '',
  name: '',
  nameError: '',
}
class Contracts extends React.Component<INervosContext, typeof initState> {
  public readonly state = initState
  public handleInput = handleInputOf(this)
  public AbiDB: IDBObjectStore | undefined
  public componentDidMount() {
    const abiReq = openDB()
    abiReq.onupgradeneeded = e => {
      if (e.target) {
        window.console.log(abiReq.result)
        // const db = e.target
      }
    }
  }

  public saveAbi = (e: any) => {
    if (!this.state.name) {
      return this.setState({ nameError: 'name required' })
    }
    if (this.state.inputAbi) {
      window.console.log('ha')
      let abi = []
      try {
        abi = JSON.parse(this.state.inputAbi)
        const contract = new this.props.nervos.appchain.Contract(abi)
        window.console.log(contract)
      } catch (err) {
        this.setState({
          inputAbiError: err.message,
        })
      }
    }
  }
  public render() {
    const { contracts, name, nameError, inputAbi, inputAbiError } = this.state
    return (
      <div>
        {contracts.map(ContractPanel)}
        <TextField
          helperText={nameError}
          error={!!nameError}
          label="name"
          value={name}
          onChange={this.handleInput('name')}
        />
        <TextField
          label={'ABI'}
          placeholder={'ABI'}
          helperText={inputAbiError}
          error={!!inputAbiError}
          rows={10}
          fullWidth={true}
          multiline={true}
          value={inputAbi}
          onChange={this.handleInput('inputAbi')}
        />
        <IconButton onClick={this.saveAbi}>
          <SaveIcon />
        </IconButton>
      </div>
    )
  }
}

export default withNervos(Contracts)
