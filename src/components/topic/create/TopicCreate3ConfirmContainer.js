import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { filteredLinkTo } from '../../util/location';
import composeIntlForm from '../../common/IntlForm';
import LoadingSpinner from '../../common/LoadingSpinner';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';
import messages from '../../../resources/messages';
import { createTopic, goToCreateTopicStep, updateTopic, setTopicNeedsNewSnapshot, resetTopic } from '../../../actions/topicActions';
import { updateFeedback, addNotice } from '../../../actions/appActions';
import AppButton from '../../common/AppButton';
import { getUserRoles, hasPermissions, PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import { LEVEL_ERROR, LEVEL_WARNING, WarningNotice } from '../../common/Notice';
import { MAX_RECOMMENDED_STORIES, MIN_RECOMMENDED_STORIES, WARNING_LIMIT_RECOMMENDED_STORIES } from '../../../lib/formValidators';

const localMessages = {
  title: { id: 'topic.create.confirm.title', defaultMessage: 'Step 3: Confirm Your Topic' },
  name: { id: 'topic.create.confirm.name', defaultMessage: 'Name' },
  description: { id: 'topic.create.confirm.description', defaultMessage: 'Description' },
  state: { id: 'topic.create.state', defaultMessage: 'Not yet saved.' },
  storyCount: { id: 'topic.create.story.count', defaultMessage: 'Seed Stories' },
  topicSaved: { id: 'topic.create.saved', defaultMessage: 'We saved your Topic.' },
  topicNotSaved: { id: 'topic.create.notSaved', defaultMessage: 'That didn\'t work!' },
  feedback: { id: 'topic.create.feedback', defaultMessage: 'Successfully created your topic!' },
  updateFeedback: { id: 'topic.update.feedback', defaultMessage: 'Successfully updated your topic!' },
  failed: { id: 'topic.create.failed', defaultMessage: 'Sorry, something went wrong.' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create Topic' },
  updateTopic: { id: 'topic.update', defaultMessage: 'Update Topic' },
  notEnoughStories: { id: 'topic.create.notenough', defaultMessage: "Sorry, we can't save this topic because you need a minimum of 500 seed stories." },
  tooManyStories: { id: 'topic.create.toomany', defaultMessage: "Sorry, we can't save this topic because you need to select less than 100K seed stories." },
  warningLimitStories: { id: 'topic.create.warningLimit', defaultMessage: 'Approaching story limit. Proceed with caution.' },
  creatingTitle: { id: 'topic.creating.title', defaultMessage: 'Please wait - we\'re creating your Topic now' },
  creatingDetail: { id: 'topic.creating.detail', defaultMessage: 'We are creating your topic now.  This can take a minute or so, just to make sure everyting is in order.  Once it is created, you\'ll be shown a page telling you we are gathering the stories.' },
  updatingTitle: { id: 'topic.updating.title', defaultMessage: 'Please wait - we\'re updating your Topic now' },
  updatingDetail: { id: 'topic.updating.detail', defaultMessage: 'We are updating your topic now.  This can take a minute or so, just to make sure everyting is in order.  Once it is updating, you\'ll be shown a page telling you we are gathering the stories.' },
  resetting: { id: 'topic.create', defaultMessage: 'Attempting to reset topic, forwarding to status page.' },
};


const TopicCreate3ConfirmContainer = (props) => {
  const { formValues, finishStep, handlePreviousStep, storyCount, handleSubmit, pristine, submitting } = props;
  const { formatMessage } = props.intl;
  let sourcesAndCollections = [];
  sourcesAndCollections = formValues.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
  sourcesAndCollections.concat(formValues.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id));
  const topicDetailsContent = (
    <div>
      <p>
        <b><FormattedMessage {...localMessages.name} /></b>: {formValues.name}
        <br />
        <b><FormattedMessage {...localMessages.description} /></b>: {formValues.description}
      </p>
      <p>
        <b><FormattedMessage {...messages.topicPublicProp} /></b>: { formValues.is_public ? formatMessage(messages.yes) : formatMessage(messages.no) }
        <br />
        <b><FormattedMessage {...messages.topicStartDateProp} /></b>: {formValues.start_date}
        <br />
        <b><FormattedMessage {...messages.topicEndDateProp} /></b>: {formValues.end_date}
        <br />
        <b><FormattedMessage {...localMessages.storyCount} /></b>: {storyCount}
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>: <code>{formValues.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>:
      </p>
      {formValues.sourcesAndCollections.map(object =>
        <SourceOrCollectionChip key={object.tags_id || object.media_id} object={object} />
      )}
    </div>
  );
  let content = (
    <Col lg={10}>
      <h2><FormattedMessage {...localMessages.creatingTitle} /></h2>
      <p><FormattedMessage {...localMessages.creatingDetail} /></p>
      <LoadingSpinner />
      {topicDetailsContent}
    </Col>
  );
  if (formValues.isUpdating) {
    content = (
      <Col lg={10}>
        <h2><FormattedMessage {...localMessages.updatingTitle} /></h2>
        <p><FormattedMessage {...localMessages.updatingDetail} /></p>
        <LoadingSpinner />
        {topicDetailsContent}
      </Col>
    );
  }
  if (submitting) {
    return (
      <Grid className="topic-container">
        <Row>
          {content}
        </Row>
      </Grid>
    );
  }
  // havne't submitted yet
  return (
    <form className="create-topic" name="topicForm" onSubmit={handleSubmit(finishStep.bind(this))}>
      <Grid className="topic-container">
        <Row>
          <Col lg={10}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            <WarningNotice ><FormattedMessage {...localMessages.state} /></WarningNotice>
            {topicDetailsContent}
            <br />
            <AppButton flat label={formatMessage(messages.previous)} onClick={() => handlePreviousStep()} />
            &nbsp; &nbsp;
            <AppButton
              style={{ marginTop: 30 }}
              type="submit"
              disabled={pristine || submitting}
              label={formatMessage(formValues.isUpdating ? localMessages.updateTopic : localMessages.createTopic)}
              primary
            />
          </Col>
        </Row>
      </Grid>
    </form>
  );
};

TopicCreate3ConfirmContainer.propTypes = {
  // from parent
  initialValues: PropTypes.object,
  // form context
  intl: PropTypes.object.isRequired,
  handleCreateTopic: PropTypes.func.isRequired,
  handleUpdateTopic: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  // from state
  formValues: PropTypes.object.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  storyCount: PropTypes.number,
};

const mapStateToProps = state => ({
  formValues: state.form.topicForm.values,
  storyCount: state.topics.create.preview.matchingStoryCounts.count,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(1));
  },
  handleCreateTopic: (storyCount, user, values) => {
    if (storyCount > MIN_RECOMMENDED_STORIES &&
      (storyCount < MAX_RECOMMENDED_STORIES || hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN))) {
      // all good, so submit!
      const queryInfo = {
        name: values.name,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        solr_seed_query: values.solr_seed_query,
        max_iterations: values.max_iterations,
        ch_monitor_id: values.ch_monitor_id === undefined ? '' : values.ch_monitor_id,
        is_public: values.is_public ? 1 : 0,
        is_logogram: values.is_logogram ? 1 : 0,
        max_stories: values.max_stories,
      };
      queryInfo.is_public = queryInfo.is_public ? 1 : 0;
      if ('sourcesAndCollections' in values) {
        queryInfo['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
        queryInfo['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
      } else {
        queryInfo['sources[]'] = '';
        queryInfo['collections[]'] = '';
      }
      return dispatch(createTopic(queryInfo)).then((results) => {
        if (results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          return dispatch(push(`/topics/${results.topics_id}/summary`));
        }
        return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
      });
    } else if (storyCount < MIN_RECOMMENDED_STORIES) {
      // not enough seed stories - show error
      dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.notEnoughStories) }));
      return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.notEnoughStories) }));
    } else if (!hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN)) {
      // can't make topics this big - show error
      if (storyCount > WARNING_LIMIT_RECOMMENDED_STORIES && storyCount < MAX_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.warningLimitStories) }));
        return dispatch(addNotice({ level: LEVEL_WARNING, message: ownProps.intl.formatMessage(localMessages.warningLimitStories) }));
      } else if (storyCount > MAX_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.tooManyStories) }));
        return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.tooManyStories) }));
      }
    }
    return null;
  },
  handleUpdateTopic: (storyCount, user, values) => {
    if (storyCount > MIN_RECOMMENDED_STORIES &&
      (storyCount < MAX_RECOMMENDED_STORIES || hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN))) {
      const infoToSave = { ...values };   // clone it so we can edit as needed
      infoToSave.is_public = infoToSave.is_public ? 1 : 0;
      infoToSave.is_logogram = infoToSave.is_logogram ? 1 : 0;
      infoToSave.ch_monitor_id = values.ch_monitor_id === undefined ? '' : values.ch_monitor_id;
      if ('sourcesAndCollections' in values) {
        infoToSave['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
        infoToSave['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
      } else {
        infoToSave['sources[]'] = '';
        infoToSave['collections[]'] = '';
      }
      return dispatch(updateTopic(infoToSave.topics_id, infoToSave))
        .then((results) => {
          if (results.topics_id) {
            // let them know it worked
            dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.updateFeedback) }));

          // reset if we are saving a previously errored topic
            if (infoToSave.state === 'error') { // } && results.message.indexOf('cannot reduce') > -1) {
              dispatch(resetTopic(results.topics_id));
              dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.resetting) }));
              const topicSummaryUrl = filteredLinkTo(`/topics/${results.topics_id}/summary`);
              dispatch(push(topicSummaryUrl));
            } else {
              // if the dates changed tell them it needs a new snapshot
              if ((infoToSave.start_date !== results.start_date) || (results.end_date !== results.end_date)) {
                dispatch(setTopicNeedsNewSnapshot(true));
              }
              const topicSummaryUrl = filteredLinkTo(`/topics/${results.topics_id}/summary`);
              return dispatch(push(topicSummaryUrl));
              // update topic info and redirect back to topic summary
            }
          }
          return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
        });
    }
    return null; // won't save
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      if (stateProps.formValues.isUpdating) {
        dispatchProps.handleUpdateTopic(stateProps.storyCount, stateProps.user, stateProps.formValues);
      } else {
        dispatchProps.handleCreateTopic(stateProps.storyCount, stateProps.user, stateProps.formValues);
      }
    },
  });
}

const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
};

export default
  composeIntlForm(
    reduxForm(reduxFormConfig)(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        TopicCreate3ConfirmContainer
      )
    )
  );
