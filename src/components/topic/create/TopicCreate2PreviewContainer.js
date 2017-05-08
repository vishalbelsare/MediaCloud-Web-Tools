import React from 'react';
import { connect } from 'react-redux';
// import { reduxForm, formValueSelector } from 'redux-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeIntlForm from '../../common/IntlForm';
import AppButton from '../../common/AppButton';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import TopicCreatePreview from './preview/TopicCreatePreview';
import messages from '../../../resources/messages';

// const formSelector = formValueSelector('topicForm');

const localMessages = {
  title: { id: 'topic.create.preview.title', defaultMessage: 'Step 2: Preview Your Topic' },
  about: { id: 'topic.create.preview.about',
    defaultMessage: '<b>Make sure your topic looks right before you create it</b>.  We start your topic by finding all the stories in our database that match your query. From there we follow all the links and download them. We check if they match your keywords, and if they do then we add them to your topic (this is called "spidering"). Check the result below and make sure your topic is finding you the stories you want before creating it.' },
};

const TopicCreate2PreviewContainer = (props) => {
  const { handleNextStep, handlePreviousStep, formData, goToStep } = props;
  const { formatMessage } = props.intl;

  const content = (<TopicCreatePreview
    formData={formData}
    onPreviousStep={handlePreviousStep}
    onNextStep={handleNextStep}
  />);

  return (
    <Grid>
      <p><FormattedMessage {...localMessages.about} /></p>
      { content }
      <Row>
        <Col lg={12} md={12} sm={12} >
          <AppButton flat label={formatMessage(messages.previous)} onClick={() => goToStep(0)} />
          &nbsp; &nbsp;
          <AppButton type="submit" label={formatMessage(messages.confirm)} primary />
        </Col>
      </Row>
    </Grid>
  );
};

TopicCreate2PreviewContainer.propTypes = {
  // from parent
  location: React.PropTypes.object.isRequired,
  // form composition
  intl: React.PropTypes.object.isRequired,
  // from state
  currentStep: React.PropTypes.number,
  handlePreviousStep: React.PropTypes.func.isRequired,
  handleNextStep: React.PropTypes.func.isRequired,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
  goToStep: React.PropTypes.func.isRequired,
  // from form
  formData: React.PropTypes.object,
};

const mapStateToProps = state => ({
  currentStep: state.topics.create.preview.workflow.currentStep,
  // TODO I should be able to get this from state.form.topicForm but am trying to deal with the destroyOnUnmount fail
  // formData: formSelector(state, 'solr_seed_query', 'start_date', 'end_date', 'sourceUrls', 'collectionUrls'),
  formData: state.form.topicForm.values,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(0));
  },
  handleNextStep: () => {
    dispatch(goToCreateTopicStep(2));
  },
  goToStep: (step) => {
    dispatch(goToCreateTopicStep(step));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleNextStep();
    },
  });
}

export default
  injectIntl(
    composeIntlForm(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        TopicCreate2PreviewContainer
      )
    )
  );
