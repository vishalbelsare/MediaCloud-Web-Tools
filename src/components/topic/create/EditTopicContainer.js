import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicSummary, updateTopic, setTopicNeedsNewSnapshot } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import messages from '../../../resources/messages';
import BackLinkingControlBar from '../BackLinkingControlBar';
import Permissioned from '../../common/Permissioned';
import composeIntlForm from '../../common/IntlForm';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import TopicForm, { TOPIC_FORM_MODE_EDIT } from './TopicForm';

const localMessages = {
  editTopicTitle: { id: 'topic.edit.title', defaultMessage: 'Edit Topic Settings' },
  editTopicText: { id: 'topic.edit.text', defaultMessage: 'You can update this Topic. If you make changes to the query, media sourcs, or dates, those will be reflected in the next snapshot you run.' },
  editTopic: { id: 'topic.edit', defaultMessage: 'Edit Topic' },
  editTopicCollectionsTitle: { id: 'topic.edit.editTopicCollectionsTitle', defaultMessage: 'Edit Sources and Collections' },
  editTopicCollectionsIntro: { id: 'topic.edit.editTopicCollectionsIntro', defaultMessage: 'The following are the Sources and Collections associated with this topic.' },
  feedback: { id: 'topic.edit.save.feedback', defaultMessage: 'We saved your changes' },
  failed: { id: 'topic.edit.save.failed', defaultMessage: 'Sorry, that didn\'t work!' },
};

const formSelector = formValueSelector('topicForm');

const EditTopicContainer = (props) => {
  const { handleSave, handleMediaChange, handleMediaDelete, topicInfo, topicId } = props;
  const { formatMessage } = props.intl;
  let initialValues = null;

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

  if (initialValues && initialValues.sourcesAndCollections !== undefined) {
    // load sources and collections in a backwards compatible way
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
              topicId={topicId}
              initialValues={initialValues}
              onSubmit={handleSave}
              title={formatMessage(localMessages.editTopicCollectionsTitle)}
              intro={formatMessage(localMessages.editTopicCollectionsIntro)}
              mode={TOPIC_FORM_MODE_EDIT}
              enabledReinitialize
              keepDirtyOnReinitialize
              onMediaChange={handleMediaChange}
              onMediaDelete={handleMediaDelete}
            />
          </Permissioned>
        </Grid>
      </div>
    );
  }
  return '<div></div>';
};

EditTopicContainer.propTypes = {
  // from context
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  params: PropTypes.object,
  // from state
  timespan: PropTypes.object,
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number,
  topicInfo: PropTypes.object,
  // from dispatch/merge
  handleSave: PropTypes.func.isRequired,
  handleMediaChange: PropTypes.func.isRequired,
  handleMediaDelete: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: parseInt(ownProps.params.topicId, 10),
  topicInfo: state.topics.selected.info,
  timespan: state.topics.selected.timespans.selected,
  snapshots: state.topics.selected.snapshots.list,
  user: state.user,
  formData: formSelector(state, 'sourcesAndCollections'),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  reallyHandleSave: (values, topicInfo) => {
    const infoToSave = { ...values };   // clone it so we can edit as needed
    infoToSave.is_public = infoToSave.is_public ? 1 : 0;
    infoToSave.is_logogram = infoToSave.is_logogram ? 1 : 0;
    if ('sourcesAndCollections' in values) {
      infoToSave['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
      infoToSave['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
    } else {
      infoToSave['sources[]'] = '';
      infoToSave['collections[]'] = '';
    }
    return dispatch(updateTopic(ownProps.params.topicId, infoToSave))
      .then((results) => {
        if (results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // if the dates changed tell them it needs a new snapshot
          if ((infoToSave.start_date !== topicInfo.start_date) || (infoToSave.end_date !== topicInfo.end_date)) {
            dispatch(setTopicNeedsNewSnapshot());
          }
          // update topic info and redirect back to topic summary
          dispatch(fetchTopicSummary(results.topics_id))
            .then(() => dispatch(push(`/topics/${results.topics_id}/summary`)));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
        }
      }
    );
  },
  handleMediaDelete: (toBeDeletedObj) => {
    // the user has removed media from the form
    const updatedSources = toBeDeletedObj.filter(m => m.type === 'source' || m.media_id);
    const updatedCollections = toBeDeletedObj.filter(m => m.type === 'collection' || m.tags_id);
    const selectedMedia = updatedCollections.concat(updatedSources);

    ownProps.change('sourcesAndCollections', selectedMedia); // redux-form change action
  },
  handleMediaChange: (sourceAndCollections) => {
    // take selections from mediaPicker and push them back into topicForm
    const updatedSources = sourceAndCollections.filter(m => m.type === 'source' || m.media_id);
    const updatedCollections = sourceAndCollections.filter(m => m.type === 'collection' || m.tags_id);
    const selectedMedia = updatedCollections.concat(updatedSources);

    ownProps.change('sourcesAndCollections', selectedMedia); // redux-form change action
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
     // need topicInfo to do comparison to fire notices
    handleSave: values => dispatchProps.reallyHandleSave(values, stateProps.topicInfo, stateProps.filters),
  });
}

const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
};

export default
  injectIntl(
    composeIntlForm(
      reduxForm(reduxFormConfig)(
        connect(mapStateToProps, mapDispatchToProps, mergeProps)(
          EditTopicContainer
        )
      )
    )
  );
