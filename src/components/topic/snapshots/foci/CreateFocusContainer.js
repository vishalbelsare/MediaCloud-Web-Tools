import React from 'react';
import { connect } from 'react-redux';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { FormattedMessage, injectIntl } from 'react-intl';
import FocusForm1TechniqueContainer from './create/FocusForm1TechniqueContainer';
import FocusForm2ConfigureContainer from './create/FocusForm2ConfigureContainer';
import FocusForm3DescribeContainer from './create/FocusForm3DescribeContainer';
import FocusForm4ConfirmContainer from './create/FocusForm4ConfirmContainer';
import { setNewFocusProperties, goToCreateFocusStep } from '../../../../actions/topicActions';
import { INITIAL_STATE } from '../../../../reducers/topics/selected/focalSets/create/properties';
import BackLinkingControlBar from '../../BackLinkingControlBar';

const localMessages = {
  backToFociManager: { id: 'backToFociManager', defaultMessage: 'back to Foci Manager' },
  step0Name: { id: 'focus.create.step0Name', defaultMessage: 'Pick a Technique' },
  step1Name: { id: 'focus.create.step1Name', defaultMessage: 'Configure' },
  step2Name: { id: 'focus.create.step2Name', defaultMessage: 'Describe' },
  step3Name: { id: 'focus.create.step3Name', defaultMessage: 'Confirm' },
};

class CreateFocusContainer extends React.Component {

  componentWillUnmount = () => {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { topicId, currentStep, location } = this.props;
    const steps = [
      FocusForm1TechniqueContainer,
      FocusForm2ConfigureContainer,
      FocusForm3DescribeContainer,
      FocusForm4ConfirmContainer,
    ];
    const CurrentStepComponent = steps[currentStep];
    const stepLabelStyle = { height: 45 };
    const initialValues = { };
    return (
      <div className="create-focus">
        <BackLinkingControlBar message={localMessages.backToFociManager} linkTo={`/topics/${topicId}/snapshot/foci`} >
          <Stepper activeStep={currentStep}>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step0Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step1Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step2Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step3Name} /></StepLabel>
            </Step>
          </Stepper>
        </BackLinkingControlBar>
        <CurrentStepComponent topicId={topicId} location={location} initialValues={initialValues} />
      </div>
    );
  }

}

CreateFocusContainer.propTypes = {
  // from context:
  topicId: React.PropTypes.number.isRequired,
  location: React.PropTypes.object.isRequired,
  // from state
  currentStep: React.PropTypes.number.isRequired,
  // from dispatch
  handleUnmount: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  params: ownProps.params,
  currentStep: state.topics.selected.focalSets.create.workflow.currentStep,
});

const mapDispatchToProps = dispatch => ({
  handleUnmount: () => {
    dispatch(goToCreateFocusStep(0));
    dispatch(setNewFocusProperties(INITIAL_STATE));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateFocusContainer
    )
  );
