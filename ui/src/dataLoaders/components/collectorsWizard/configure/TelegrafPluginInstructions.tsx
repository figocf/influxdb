// Libraries
import React, {PureComponent, ChangeEvent} from 'react'
import {connect} from 'react-redux'

// Components
import {Form, Input, InputType, ComponentSize} from 'src/clockface'
import FancyScrollbar from 'src/shared/components/fancy_scrollbar/FancyScrollbar'
import OnboardingButtons from 'src/onboarding/components/OnboardingButtons'
import PluginsSideBar from 'src/dataLoaders/components/collectorsWizard/configure/PluginsSideBar'

// Actions
import {
  setTelegrafConfigName,
  setActiveTelegrafPlugin,
  setPluginConfiguration,
  createOrUpdateTelegrafConfigAsync,
} from 'src/dataLoaders/actions/dataLoaders'
import {
  incrementCurrentStepIndex,
  decrementCurrentStepIndex,
} from 'src/dataLoaders/actions/steps'
import {createDashboardsForPlugins as createDashboardsForPluginsAction} from 'src/protos/actions'
import {notify as notifyAction} from 'src/shared/actions/notifications'

// Types
import {AppState} from 'src/types/v2/index'
import {TelegrafPlugin} from 'src/types/v2/dataLoaders'

// Constants
import {TelegrafConfigCreationSuccess} from 'src/shared/copy/notifications'

interface DispatchProps {
  onSetTelegrafConfigName: typeof setTelegrafConfigName
  onSetActiveTelegrafPlugin: typeof setActiveTelegrafPlugin
  onSetPluginConfiguration: typeof setPluginConfiguration
  onIncrementStep: typeof incrementCurrentStepIndex
  onDecrementStep: typeof decrementCurrentStepIndex
  notify: typeof notifyAction
  onSaveTelegrafConfig: typeof createOrUpdateTelegrafConfigAsync
  createDashboardsForPlugins: typeof createDashboardsForPluginsAction
}

interface StateProps {
  telegrafConfigName: string
  telegrafPlugins: TelegrafPlugin[]
  telegrafConfigID: string
}

type Props = DispatchProps & StateProps

export class TelegrafPluginInstructions extends PureComponent<Props> {
  public render() {
    const {telegrafConfigName, telegrafPlugins, onDecrementStep} = this.props
    return (
      <Form onSubmit={this.handleFormSubmit} className="data-loading--form">
        <div className="data-loading--scroll-content">
          <div>
            <h3 className="wizard-step--title">Configure Plugins</h3>
            <h5 className="wizard-step--sub-title">
              Configure each plugin from the menu on the left. Some plugins do
              not require any configuration.
            </h5>
          </div>
          <div className="data-loading--columns">
            <PluginsSideBar
              telegrafPlugins={telegrafPlugins}
              onTabClick={this.handleClickSideBarTab}
              title="Plugins"
              visible={this.sideBarVisible}
            />
            <div className="data-loading--column-panel">
              <FancyScrollbar
                autoHide={false}
                className="data-loading--scroll-content"
              >
                <Form.Element label="Telegraf Configuration Name">
                  <Input
                    type={InputType.Text}
                    value={telegrafConfigName}
                    onChange={this.handleNameInput}
                    titleText="Telegraf Configuration Name"
                    size={ComponentSize.Medium}
                    autoFocus={true}
                  />
                </Form.Element>
              </FancyScrollbar>
            </div>
          </div>
        </div>

        <OnboardingButtons
          onClickBack={onDecrementStep}
          nextButtonText={'Create and Verify'}
          className="data-loading--button-container"
        />
      </Form>
    )
  }

  private handleFormSubmit = async () => {
    const {
      onSaveTelegrafConfig,
      createDashboardsForPlugins,
      telegrafConfigID,
      notify,
    } = this.props

    await onSaveTelegrafConfig()
    notify(TelegrafConfigCreationSuccess)

    if (!telegrafConfigID) {
      await createDashboardsForPlugins()
    }

    this.props.onIncrementStep()
  }

  private get sideBarVisible() {
    const {telegrafPlugins} = this.props

    return telegrafPlugins.length > 0
  }

  private handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onSetTelegrafConfigName(e.target.value)
  }

  private handleClickSideBarTab = (tabID: string) => {
    const {
      onSetActiveTelegrafPlugin,
      telegrafPlugins,
      onSetPluginConfiguration,
    } = this.props

    const activeTelegrafPlugin = telegrafPlugins.find(tp => tp.active)
    if (!!activeTelegrafPlugin) {
      onSetPluginConfiguration(activeTelegrafPlugin.name)
    }

    onSetActiveTelegrafPlugin(tabID)
  }
}

const mstp = ({
  dataLoading: {
    dataLoaders: {telegrafConfigName, telegrafPlugins, telegrafConfigID},
  },
}: AppState): StateProps => {
  return {
    telegrafConfigName,
    telegrafPlugins,
    telegrafConfigID,
  }
}

const mdtp: DispatchProps = {
  onSetTelegrafConfigName: setTelegrafConfigName,
  onIncrementStep: incrementCurrentStepIndex,
  onDecrementStep: decrementCurrentStepIndex,
  onSetActiveTelegrafPlugin: setActiveTelegrafPlugin,
  onSetPluginConfiguration: setPluginConfiguration,
  onSaveTelegrafConfig: createOrUpdateTelegrafConfigAsync,
  createDashboardsForPlugins: createDashboardsForPluginsAction,
  notify: notifyAction,
}

export default connect<StateProps, DispatchProps, {}>(
  mstp,
  mdtp
)(TelegrafPluginInstructions)
