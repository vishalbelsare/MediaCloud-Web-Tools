import React from 'react';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicForm from './TopicForm';
import { selectTopic, fetchTopicSummary, updateTopic } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';

const localMessages = {
  editTopicTitle: { id: 'topic.edit.title', defaultMessage: 'Edit Topic' },
  editTopicText: { id: 'topic.edit.text', defaultMessage: 'You can update this Topic.' },
  editTopic: { id: 'topic.edit', defaultMessage: 'Edit Topic' },
  editTopicCollectionsTitle: { id: 'topic.edit.editTopicCollectionsTitle', defaultMessage: 'Edit Sources and Collections' },
  editTopicCollectionsIntro: { id: 'topic.edit.editTopicCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic.' },
};

class EditTopicContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { topicId, fetchData } = this.props;
    if ((nextProps.topicId !== topicId)) {
      fetchData(nextProps.topicId);
    }
  }

  render() {
    const { handleSave, topicInfo } = this.props;
    const { formatMessage } = this.props.intl;
    let initialValues = {};

    if (topicInfo) {
      const sources = topicInfo.media.map(t => ({ ...t }));
      const collections = topicInfo.media_tags.map(t => ({ ...t, name: t.label }));
      const sourcesAndCollections = sources.concat(collections);
      initialValues = {
        buttonLabel: 'edit',
        ...topicInfo,
        sourcesAndCollections,
      };
    }
    return (
      <Grid>
        <Title render={formatMessage(localMessages.editTopicTitle)} />
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.editTopicTitle} /></h1>
            <p><FormattedMessage {...localMessages.editTopicText} /></p>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <TopicForm onSaveTopic={handleSave} initialValues={initialValues} title={formatMessage(localMessages.editTopicCollectionsTitle)} intro={formatMessage(localMessages.editTopicCollectionsIntro)} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

EditTopicContainer.propTypes = {
   // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object,
  // from state
  timespan: React.PropTypes.object,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number,
  topicInfo: React.PropTypes.object,
  handleSave: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: parseInt(ownProps.params.topicId, 10),
  topicInfo: state.topics.selected.info,
  timespan: state.topics.selected.timespans.selected,
  snapshots: state.topics.selected.snapshots.list,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId) => {
    dispatch(selectTopic(topicId));
    dispatch(fetchTopicSummary(topicId));
  },
  asyncFetch: () => {
    dispatch(selectTopic(ownProps.params.topicId));
    dispatch(fetchTopicSummary(ownProps.params.topicId));
  },
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
    dispatch(updateTopic(infoToSave)).then((results) => {
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
      EditTopicContainer
    )
  );
