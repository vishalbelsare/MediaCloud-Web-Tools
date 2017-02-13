import React from 'react';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicForm from './TopicForm';
import { updateFeedback } from '../../../actions/appActions';
import { updateTopic } from '../../../actions/topicActions';

const localMessages = {
  editTopicTitle: { id: 'topic.edit.title', defaultMessage: 'Edit Topic' },
  editTopicText: { id: 'topic.edit.text', defaultMessage: 'You can update this Topic.' },
  editTopic: { id: 'topic.edit', defaultMessage: 'Edit Topic' },
};

const EditTopicContainer = (props) => {
  const { handleSave, topicInfo } = props;
  const { formatMessage } = props.intl;
  const initialValues = {
    ...topicInfo,
    sources: topicInfo.media
      .map(t => ({ ...t, name: t.label })),
      // .filter(t => (isCollectionTagSet(t.tag_sets_id) && (t.show_on_media === 1))),
  };
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
          <TopicForm onSaveTopic={handleSave} initialValues={initialValues} />
        </Col>
      </Row>
    </Grid>
  );
};

EditTopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  params: React.PropTypes.object,
  // from state
  timespan: React.PropTypes.object,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number,
  topicInfo: React.PropTypes.object,
  handleSave: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  timespan: state.topics.selected.timespans.selected,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  handleSave: (values) => {
    dispatch(updateTopic(values)).then(() => {
      dispatch(push('/home'));
      dispatch(updateFeedback({ open: true, message: ' We\'ll fire fire off an email asking our back-end team to review your suggestion.' }));
    });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      EditTopicContainer
    )
  );
