// Libraries
import React, {PureComponent} from 'react'

// Components
import SearchBar from 'src/timeMachine/components/SearchBar'
import FancyScrollbar from 'src/shared/components/fancy_scrollbar/FancyScrollbar'
import ToolbarVariable from 'src/timeMachine/components/variableToolbar/ToolbarVariable'

// Styles
import 'src/timeMachine/components/variableToolbar/VariableToolbar.scss'
import {SpinnerContainer, TechnoSpinner} from 'src/clockface'
import Variables from 'src/timeMachine/components/variableToolbar/Variables'

interface State {
  searchTerm: string
}

class VariableToolbar extends PureComponent<{}, State> {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '',
    }
  }

  public render() {
    return (
      <Variables>
        {(variables, loading) => {
          return (
            <SpinnerContainer
              loading={loading}
              spinnerComponent={<TechnoSpinner />}
            >
              <div className="variable-toolbar">
                <SearchBar
                  onSearch={this.handleSearch}
                  resourceName={'Variables'}
                />
                <FancyScrollbar>
                  <div className="variables-toolbar--list">
                    {variables.map(v => {
                      return <ToolbarVariable variable={v} key={v.id} />
                    })}
                  </div>
                </FancyScrollbar>
              </div>
            </SpinnerContainer>
          )
        }}
      </Variables>
    )
  }

  private handleSearch = (searchTerm: string): void => {
    this.setState({searchTerm})
  }
}

export default VariableToolbar
