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
import messages from '../../../resources/messages';
import BackLinkingControlBar from '../BackLinkingControlBar';
import { filteredLinkTo } from '../../util/location';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';

const localMessages = {
  editTopicTitle: { id: 'topic.edit.title', defaultMessage: 'Edit Topic Settings' },
  editTopicText: { id: 'topic.edit.text', defaultMessage: 'You can update this Topic. If you make changes to the query, media sourcs, or dates, those will be reflected in the next snapshot you run.' },
  editTopic: { id: 'topic.edit', defaultMessage: 'Edit Topic' },
  editTopicCollectionsTitle: { id: 'topic.edit.editTopicCollectionsTitle', defaultMessage: 'Edit Sources and Collections' },
  editTopicCollectionsIntro: { id: 'topic.edit.editTopicCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic.' },
  feedback: { id: 'topic.edit.save.feedback', defaultMessage: 'We saved your changes' },
  failed: { id: 'topic.edit.save.failed', defaultMessage: 'Sorry, that didn\'t work!' },
};

class EditTopicContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { topicId, fetchData } = this.props;
    if ((nextProps.topicId !== topicId)) {
      fetchData(nextProps.topicId);
    }
  }

  render() {
    const { handleSave, topicInfo, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    let initialValues = {};

    if (topicInfo) {
      // load sources and collections in a backwards compatible way
      const sources = topicInfo.media ? topicInfo.media.map(t => ({ ...t })) : [];
      const collections = topicInfo.media_tags ? topicInfo.media_tags.map(t => ({ ...t, name: t.label })) : [];
      const sourcesAndCollections = sources.concat(collections);
      initialValues = {
        buttonLabel: formatMessage(messages.save),
        ...topicInfo,
        sourcesAndCollections,
      };
    }
    return (
      <div className="topic-edit-form">
        <BackLinkingControlBar message={messages.backToTopic} linkTo={`/topics/${topicId}/summary`} />
        <Grid>
          <Title render={formatMessage(localMessages.editTopicTitle)} />
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.editTopicTitle} /></h1>
              <p><FormattedMessage {...localMessages.editTopicText} /></p>
            </Col>
          </Row>
          <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
            <TopicForm
              onSaveTopic={handleSave}
              initialValues={initialValues}
              title={formatMessage(localMessages.editTopicCollectionsTitle)}
              intro={formatMessage(localMessages.editTopicCollectionsIntro)}
            />
          </Permissioned>
        </Grid>
      </div>
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
    infoToSave.is_public = infoToSave.is_public ? 1 : 0;
    if ('sourcesAndCollections' in values) {
      infoToSave['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
      infoToSave['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
    } else {
      infoToSave['sources[]'] = '';
      infoToSave['collections[]'] = '';
    }
    dispatch(updateTopic(ownProps.params.topicId, infoToSave))
      .then((results) => {
        if (results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // update topic info and redirect back to topic summary
          dispatch(fetchTopicSummary(results.topics_id))
            .then(() => dispatch(push(filteredLinkTo(`/topics/${results.topics_id}/summary`))));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
        }
      }
    );
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      EditTopicContainer
    )
  );
