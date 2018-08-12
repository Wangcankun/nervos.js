import * as React from 'react'

export interface IHandleError {
  handleError: (errorMsg: string) => void
}
const ErrorHandlerHOC = (Comp: typeof React.Component) =>
  class extends React.Component {
    public readonly state = {
      errorMsg: '',
    }
    public handleError = (errorMsg: string) => {
      this.setState({ errorMsg })
    }
    public render() {
      return (
        <React.Fragment>
          <span>{this.state.errorMsg}</span>
          <Comp {...this.props} handleError={this.handleError} />
        </React.Fragment>
      )
    }
  }
export default ErrorHandlerHOC
