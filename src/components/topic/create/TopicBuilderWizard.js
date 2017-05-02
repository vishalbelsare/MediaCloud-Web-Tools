import React from 'react';
import { connect } from 'react-redux';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import { FormattedMessage, injectIntl } from 'react-intl';
import BackLinkingControlBar from '../BackLinkingControlBar';
import TopicCreate1ConfigureContainer from './TopicCreate1ConfigureContainer';
import TopicCreate2PreviewContainer from './TopicCreate2PreviewContainer';
import TopicCreate3ConfirmContainer from './TopicCreate3ConfirmContainer';
import { goToCreateTopicStep } from '../../../actions/topicActions';

const localMessages = {
  backToTopicManager: { id: 'backToTopicManager', defaultMessage: 'back to Topic Builder' },
  step0Name: { id: 'topic.create.step0Name', defaultMessage: 'Create A Topic' },
  step1Name: { id: 'topic.create.step1Name', defaultMessage: 'Preview' },
  step2Name: { id: 'topic.create.step3Name', defaultMessage: 'Confirm' },
};

class TopicBuilderWizard extends React.Component {

  componentWillMount = () => {
    const { startStep, goToStep } = this.props;
    goToStep(startStep || 0);
  }

  componentWillUnmount = () => {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { currentStep, location, initialValues } = this.props;
    const steps = [
      TopicCreate1ConfigureContainer,
      TopicCreate2PreviewContainer,
      TopicCreate3ConfirmContainer,
    ];
    const CurrentStepComponent = steps[currentStep];
    const stepLabelStyle = { height: 45 };
    return (
      <div className="topic-builder-wizard">
        <BackLinkingControlBar message={localMessages.backToTopicManager} linkTo={'/topics/'} >
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
          </Stepper>
        </BackLinkingControlBar>
        <CurrentStepComponent location={location} initialValues={initialValues} />
      </div>
    );
  }

}

TopicBuilderWizard.propTypes = {
  // from parent
  topicId: React.PropTypes.number,
  initialValues: React.PropTypes.object,
  startStep: React.PropTypes.number,
  location: React.PropTypes.object,
  // from state
  currentStep: React.PropTypes.number.isRequired,
  // from dispatch
  goToStep: React.PropTypes.func.isRequired,
  handleUnmount: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentStep: state.topics.create.preview.workflow.currentStep,
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreateTopicStep(step));
  },
  handleUnmount: () => {
    dispatch(goToCreateTopicStep(0));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicBuilderWizard
    )
  );
