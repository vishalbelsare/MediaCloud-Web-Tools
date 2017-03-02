import React from 'react';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicForm from './TopicForm';
import { updateFeedback } from '../../../actions/appActions';
import { createTopic } from '../../../actions/topicActions';
import messages from '../../../resources/messages';

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
  const initialValues = { start_date: '2017-01-02', end_date: '2017-12-31', spidered: false, max_iterations: 15, buttonLabel: formatMessage(messages.save) };

  return (
    <Grid>
      <Title render={formatMessage(localMessages.createTopicTitle)} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.createTopicTitle} /></h1>
          <p><FormattedMessage {...localMessages.createTopicText} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <TopicForm onSaveTopic={handleSave} initialValues={initialValues} title={formatMessage(localMessages.addCollectionsTitle)} intro={formatMessage(localMessages.addCollectionsIntro)} />
        </Col>
      </Row>

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
    let startDate = new Date(values.start_date);
    startDate = moment(startDate).format('YYYY-MM-DD');
    let endDate = new Date(values.end_date);
    endDate = moment(endDate).format('YYYY-MM-DD');
    const infoToSave = {
      name: values.name,
      description: values.description,
      start_date: startDate,
      end_date: endDate,
      solr_seed_query: values.solr_seed_query,
      max_iterations: values.max_iterations,
      ch_monitor_id: values.ch_monitor_id,
      is_public: values.is_public,
      twitter_topics_id: values.twitter_topics_id,
    };
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
