import React from 'react';
import { connect } from 'react-redux';
import CreateFocusControlBar from './CreateFocusControlBar';
import CreateFocusSetupContainer from './CreateFocusSetupContainer';
import CreateFocusEditContainer from './CreateFocusEditContainer';
import CreateFocusConfirmContainer from './CreateFocusConfirmContainer';
import { setNewFocusProperties, goToCreateFocusStep } from '../../../../actions/topicActions';
import { INITIAL_STATE } from '../../../../reducers/topics/selected/focalSets/create/properties';

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
      <div>
        <CreateFocusControlBar topicId={topicId} currentStep={currentStep} />
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


const mapDispatchToProps = (dispatch, ownProps) => ({
  handleUnmount: () => {
    dispatch(goToCreateFocusStep(0));
    dispatch(setNewFocusProperties(INITIAL_STATE));
  },
});

export default
  connect(mapStateToProps, mapDispatchToProps)(
    CreateFocusContainer
  );
