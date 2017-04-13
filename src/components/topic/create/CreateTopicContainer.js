import React from 'react';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { updateFeedback } from '../../../actions/appActions';
import { createTopic } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import TopicForm, { TOPIC_FORM_MODE_CREATE } from './TopicForm';

const localMessages = {
  createTopicTitle: { id: 'topic.create.title', defaultMessage: 'Create a New Topic' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'You can create a new Topic to add to the MediaCloud system.' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create Topic' },
  addCollectionsTitle: { id: 'topic.create.addCollectionsTitle', defaultMessage: 'Select Sources And Collections' },
  addCollectionsIntro: { id: 'topic.create.addCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic:' },
  feedback: { id: 'topic.create.feedback', defaultMessage: 'We saved your new Topic' },
  failed: { id: 'topic.create.feedback.failed', defaultMessage: 'Something went wrong :(' },
};

const CreateTopicContainer = (props) => {
  const { handleSave } = props;
  const { formatMessage } = props.intl;
  const initialValues = { start_date: '2017-01-02', end_date: '2017-12-31', max_iterations: 15, buttonLabel: formatMessage(messages.save) };

  return (
    <Grid>
      <Title render={formatMessage(localMessages.createTopicTitle)} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.createTopicTitle} /></h1>
          <p><FormattedMessage {...localMessages.createTopicText} /></p>
        </Col>
      </Row>
      <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
        <TopicForm
          onSaveTopic={handleSave}
          initialValues={initialValues}
          title={formatMessage(localMessages.addCollectionsTitle)}
          intro={formatMessage(localMessages.addCollectionsIntro)}
          mode={TOPIC_FORM_MODE_CREATE}
        />
      </Permissioned>
    </Grid>
  );
};

CreateTopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSave: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    const infoToSave = {
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
    infoToSave.is_public = infoToSave.is_public ? 1 : 0;
    if ('sourcesAndCollections' in values) {
      infoToSave['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
      infoToSave['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
    } else {
      infoToSave['sources[]'] = '';
      infoToSave['collections[]'] = '';
    }
    dispatch(createTopic(infoToSave)).then((results) => {
      if (results.topics_id) {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        dispatch(push(`/topics/${results.topics_id}/summary`));
      } else {
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
      }
    });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateTopicContainer
    )
  );
