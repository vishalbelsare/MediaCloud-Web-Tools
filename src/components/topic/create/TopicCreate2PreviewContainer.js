import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import composeIntlForm from '../../common/IntlForm';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import TopicCreatePreview from './TopicCreatePreview';

// const formSelector = formValueSelector('topicForm');

const TopicCreate2PreviewContainer = (props) => {
  const { handleNextStep, handlePreviousStep, formValues } = props;

  const content = (<TopicCreatePreview
    formData={formValues}
    onPreviousStep={handlePreviousStep}
    onNextStep={handleNextStep}
  />);

  return (
    <div>
      { content }
    </div>
  );
};

TopicCreate2PreviewContainer.propTypes = {
  // from parent
  location: React.PropTypes.object.isRequired,
  // form composition
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  // from state
  currentStep: React.PropTypes.number,
  handlePreviousStep: React.PropTypes.func.isRequired,
  handleNextStep: React.PropTypes.func.isRequired,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
  // from form
  formValues: React.PropTypes.object,
};

const mapStateToProps = state => ({
  // grab the results of the query here I think to give to each component?
  // no I think just access the form data
  formValues: state.form.topicForm.values,
  currentStep: state.topics.create.preview.workflow.currentStep,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(0));
  },
  handleNextStep: () => {
    dispatch(goToCreateTopicStep(2));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleNextStep();
    },
  });
}

const reduxFormConfig = {
  form: 'topicForm',
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          TopicCreate2PreviewContainer
        )
      )
    )
  );
