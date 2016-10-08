import React from 'react';
import { connect } from 'react-redux';
import CreateFocusSetupContainer from './CreateFocusSetupContainer';
import CreateFocusEditContainer from './CreateFocusEditContainer';
import CreateFocusConfirmContainer from './CreateFocusConfirmContainer';
import { setNewFocusProperties, goToCreateFocusStep } from '../../../../../actions/topicActions';
import { INITIAL_STATE } from '../../../../../reducers/topics/selected/focalSets/create/properties';
import BackLinkingControlBar from '../../../BackLinkingControlBar';

const localMessages = {
  backToFociManager: { id: 'backToFociManager', defaultMessage: 'back to Foci Manager' },
};

class CreateFocusContainer extends React.Component {

  componentWillUnmount = () => {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { topicId, currentStep } = this.props;
    const steps = [
      CreateFocusSetupContainer,
      CreateFocusEditContainer,
      CreateFocusConfirmContainer,
    ];
    const CurrentStepComponent = steps[currentStep];
    return (
      <div className="create-focus">
        <BackLinkingControlBar message={localMessages.backToFociManager} linkTo={`/topics/${topicId}/snapshot/foci`} />
        <CurrentStepComponent topicId={topicId} />
      </div>
    );
  }

}

CreateFocusContainer.propTypes = {
  // from context:
  topicId: React.PropTypes.number.isRequired,
  // from state
  currentStep: React.PropTypes.number.isRequired,
  // from dispatch
  handleUnmount: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  currentStep: state.topics.selected.focalSets.create.workflow.currentStep,
});


const mapDispatchToProps = dispatch => ({
  handleUnmount: () => {
    dispatch(goToCreateFocusStep(0));
    dispatch(setNewFocusProperties(INITIAL_STATE));
  },
});

export default
  connect(mapStateToProps, mapDispatchToProps)(
    CreateFocusContainer
  );
