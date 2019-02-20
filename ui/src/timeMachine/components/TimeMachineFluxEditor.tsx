// Libraries
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

// Components
import FluxEditor from 'src/shared/components/FluxEditor'
import Threesizer from 'src/shared/components/threesizer/Threesizer'
import FluxFunctionsToolbar from 'src/timeMachine/components/fluxFunctionsToolbar/FluxFunctionsToolbar'
import VariablesToolbar from 'src/timeMachine/components/variableToolbar/VariableToolbar'
import ToolbarTab from 'src/timeMachine/components/ToolbarTab'

// Actions
import {setActiveQueryText, submitScript} from 'src/timeMachine/actions'

// Utils
import {getActiveQuery} from 'src/timeMachine/selectors'

// Constants
import {HANDLE_VERTICAL, HANDLE_NONE} from 'src/shared/constants'

// Types
import {AppState} from 'src/types/v2'

import 'src/timeMachine/components/TimeMachineFluxEditor.scss'

interface StateProps {
  activeQueryText: string
}

interface DispatchProps {
  onSetActiveQueryText: typeof setActiveQueryText
  onSubmitScript: typeof submitScript
}

interface State {
  displayFluxFunctions: boolean
}

type Props = StateProps & DispatchProps

class TimeMachineFluxEditor extends PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      displayFluxFunctions: false,
    }
  }

  public render() {
    const {activeQueryText, onSetActiveQueryText, onSubmitScript} = this.props

    const divisions = [
      {
        size: 0.75,
        handleDisplay: HANDLE_NONE,
        render: () => (
          <FluxEditor
            script={activeQueryText}
            status={{type: '', text: ''}}
            onChangeScript={onSetActiveQueryText}
            onSubmitScript={onSubmitScript}
            suggestions={[]}
          />
        ),
      },
      {
        render: () => this.rightDivision,
        handlePixels: 6,
        size: 0.25,
      },
    ]

    return (
      <div className="time-machine-flux-editor">
        <Threesizer orientation={HANDLE_VERTICAL} divisions={divisions} />
      </div>
    )
  }

  private get rightDivision(): JSX.Element {
    const {displayFluxFunctions} = this.state

    if (displayFluxFunctions) {
      return (
        <>
          <div className="toolbar--tabs">
            <ToolbarTab
              onSetActive={this.hideFluxFunctions}
              name={'Variables'}
              active={!displayFluxFunctions}
            />
            <ToolbarTab
              onSetActive={this.showFluxFunctions}
              name={'Functions'}
              active={displayFluxFunctions}
            />
          </div>
          <FluxFunctionsToolbar />
        </>
      )
    }

    return (
      <>
        <div className="toolbar--tabs">
          <ToolbarTab
            onSetActive={this.hideFluxFunctions}
            name={'Variables'}
            active={!displayFluxFunctions}
          />
          <ToolbarTab
            onSetActive={this.showFluxFunctions}
            name={'Functions'}
            active={displayFluxFunctions}
          />
        </div>
        <VariablesToolbar />
      </>
    )
  }

  private showFluxFunctions = () => {
    this.setState({displayFluxFunctions: true})
  }

  private hideFluxFunctions = () => {
    this.setState({displayFluxFunctions: false})
  }
}

const mstp = (state: AppState) => {
  const activeQueryText = getActiveQuery(state).text

  return {activeQueryText}
}

const mdtp = {
  onSetActiveQueryText: setActiveQueryText,
  onSubmitScript: submitScript,
}

export default connect<StateProps, DispatchProps, {}>(
  mstp,
  mdtp
)(TimeMachineFluxEditor)
