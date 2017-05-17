import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import composeIntlForm from '../../common/IntlForm';
import TopicForm, { TOPIC_FORM_MODE_CREATE } from './TopicForm';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import { getCurrentDate, getMomentDateSubtraction } from '../../../lib/dateUtil';

const localMessages = {
  title: { id: 'topic.create.setup.title', defaultMessage: 'Step 1: Create A Topic' },
  about: { id: 'topic.create.setup.about',
    defaultMessage: 'Create A Topic then click Preview' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'You can create a new Topic to add to the MediaCloud system.' },
  addCollectionsTitle: { id: 'topic.create.addCollectionsTitle', defaultMessage: 'Select Sources And Collections' },
  addCollectionsIntro: { id: 'topic.create.addCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic:' },
  sourceCollectionsError: { id: 'topic.form.detail.sourcesCollections.error', defaultMessage: 'You must select at least one Source or one Collection to seed this topic.' },
};

const formSelector = formValueSelector('topicForm');

const TopicCreate1ConfigureContainer = (props) => {
  const { finishStep } = props;
  const { formatMessage } = props.intl;
  const endDate = getCurrentDate();
  const startDate = getMomentDateSubtraction(endDate, 3, 'months');
  const initialValues = { start_date: startDate, end_date: endDate, max_iterations: 15, buttonLabel: formatMessage(messages.preview) };
  return (
    <Grid>
      <Title render={formatMessage(localMessages.title)} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
          <p><FormattedMessage {...localMessages.createTopicText} /></p>
        </Col>
      </Row>
      <TopicForm
        initialValues={initialValues}
        onSaveTopic={finishStep}
        title={formatMessage(localMessages.addCollectionsTitle)}
        intro={formatMessage(localMessages.addCollectionsIntro)}
        mode={TOPIC_FORM_MODE_CREATE}
      />
    </Grid>
  );
};

TopicCreate1ConfigureContainer.propTypes = {
  // from parent
  location: React.PropTypes.object.isRequired,
  initialValues: React.PropTypes.object,
  // form composition
  intl: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
  // from state
  currentStep: React.PropTypes.number,
  formData: React.PropTypes.object,
  // from dispatch
  finishStep: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: formSelector(state, 'solr_seed_query', 'start_date', 'end_date', 'sourceUrls', 'collectionUrls'),
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreateTopicStep(step));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (values) => {
      dispatchProps.goToStep(1, values);
    },
  });
}

const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          TopicCreate1ConfigureContainer
        )
      )
    )
  );