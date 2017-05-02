import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import composeIntlForm from '../../common/IntlForm';
import TopicForm, { TOPIC_FORM_MODE_CREATE } from './TopicForm';
import { goToCreateTopicStep } from '../../../actions/topicActions';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';

const localMessages = {
  title: { id: 'topic.create.setup.title', defaultMessage: 'Step 1: Create A Topic' },
  about: { id: 'topic.create.setup.about',
    defaultMessage: 'Create A Topic then click Preview' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'You can create a new Topic to add to the MediaCloud system.' },
  addCollectionsTitle: { id: 'topic.create.addCollectionsTitle', defaultMessage: 'Select Sources And Collections' },
  addCollectionsIntro: { id: 'topic.create.addCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic:' },
};

const formSelector = formValueSelector('topicForm');

const TopicCreate1ConfigureContainer = (props) => {
  const { finishStep, initialValues } = props;
  const { formatMessage } = props.intl;
  // TODO where to put: const initialValues = { start_date: '2017-01-02', end_date: '2017-12-31', max_iterations: 15, buttonLabel: formatMessage(messages.preview) };

  return (
    <Grid>
      <Title render={formatMessage(localMessages.title)} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.title} /></h1>
          <p><FormattedMessage {...localMessages.createTopicText} /></p>
        </Col>
      </Row>
      <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
        <TopicForm
          onSaveTopic={finishStep}
          initialValues={initialValues}
          title={formatMessage(localMessages.addCollectionsTitle)}
          intro={formatMessage(localMessages.addCollectionsIntro)}
          mode={TOPIC_FORM_MODE_CREATE}
        />
      </Permissioned>
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
  formData: formSelector(state, 'focalTechnique', 'solr_seed_query', 'start_date', 'end_date', 'sourceUrls', 'collectionUrls'),
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreateTopicStep(step));
  },
  handlePreview: (values) => {
    const infoToQuery = {
      name: values.name,
      description: values.description,
      start_date: values.start_date,
      end_date: values.end_date,
      solr_seed_query: values.solr_seed_query,
      max_iterations: values.max_iterations,
      ch_monitor_id: values.ch_monitor_id === undefined ? '' : values.ch_monitor_id,
      is_public: values.is_public === undefined ? false : values.is_public,
      twitter_topics_id: values.twitter_topics_id,
    };
    infoToQuery.is_public = infoToQuery.is_public ? 1 : 0;
    if ('sourcesAndCollections' in values) {
      infoToQuery['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
      infoToQuery['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
    } else {
      infoToQuery['sources[]'] = '';
      infoToQuery['collections[]'] = '';
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.goToStep(1);
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
