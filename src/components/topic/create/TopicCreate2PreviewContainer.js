import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { injectIntl } from 'react-intl';
import composeIntlForm from '../../common/IntlForm';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import TopicCreatePreview from './TopicCreatePreview';

const formSelector = formValueSelector('topicForm');

const TopicCreate2PreviewContainer = (props) => {
  const { handleNextStep, handlePreviousStep, formData } = props;

  const content = (<TopicCreatePreview
    formData={formData}
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
  formData: React.PropTypes.object,
};

const mapStateToProps = state => ({
  currentStep: state.topics.create.preview.workflow.currentStep,
  // TODO I should be able to get this from state.form.topicForm but am trying to deal with the destroyOnUnmount fail
  formData: formSelector(state, 'solr_seed_query', 'start_date', 'end_date', 'sourceUrls', 'collectionUrls'),
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
  destroyOnUnmount: false,
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
