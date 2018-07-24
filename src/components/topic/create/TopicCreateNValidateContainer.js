import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import AppButton from '../../common/AppButton';
import StoryRow from './StoryRow';
import { goToCreateTopicStep, fetchStorySampleByQuery } from '../../../actions/topicActions';
import messages from '../../../resources/messages';

const NUM_TO_SHOW = 30;

const localMessages = {
  title: { id: 'topic.create.validate.title', defaultMessage: 'Change Topic Seed Query: Validate 30 Sample Stories' },
  about: { id: 'topic.create.validate.about',
    defaultMessage: 'Please review this random sample to make sure these stories are relevant.' },
};

const TopicCreateNValidateContainer = (props) => {
  const { handleNextStep, handlePreviousStep, stories } = props;
  const { formatMessage } = props.intl;

  return (
    <Grid>
      <h1>
        <FormattedHTMLMessage {...localMessages.title} />
      </h1>
      <p>
        <FormattedHTMLMessage {...localMessages.about} />
      </p>
      <br />
      <Row start="lg">
        <Col lg={12}>
          <div className="topic-create-sample-story-table">
            <Row start="lg" className="topic-create-sample-story-table-header">
              <Col lg={8} className="topic-create-story-title-col">
                <b>Sample story</b>
              </Col>
              <Col lg={4} className="topic-create-match-col">
                <b>Is this a useful story?</b>
              </Col>
            </Row>
            <div className="topic-create-sample-story-container">
              {stories.map(story =>
                <StoryRow key={story.stories_id} story={story} />
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12} >
          <AppButton flat label={formatMessage(messages.previous)} onClick={() => handlePreviousStep()} />
          &nbsp; &nbsp;
          <AppButton type="submit" label={formatMessage(messages.confirm)} primary onClick={() => handleNextStep()} />
        </Col>
      </Row>
    </Grid>
  );
};

TopicCreateNValidateContainer.propTypes = {
  // from parent
  location: PropTypes.object.isRequired,
  // form composition
  intl: PropTypes.object.isRequired,
  // from state
  currentStep: PropTypes.number,
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  stories: PropTypes.array.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from form
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  currentStep: state.topics.create.preview.workflow.currentStep,
  formData: state.form.topicForm.values,
  fetchStatus: state.topics.create.preview.matchingStories.fetchStatus,
  total: state.topics.create.preview.matchingStories.total,
  stories: state.topics.create.preview.matchingStories.list,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(0));
  },
  handleNextStep: () => {
    // dispatch(goToCreateTopicStep(2));
    console.log('Next!');
  },
  fetchData: (query) => {
    const infoForQuery = {
      q: query.solr_seed_query,
      start_date: query.start_date,
      end_date: query.end_date,
      limit: NUM_TO_SHOW,
    };
    infoForQuery['collections[]'] = [];
    infoForQuery['sources[]'] = [];

    if ('sourcesAndCollections' in query) {  // in FieldArrays on the form
      infoForQuery['collections[]'] = query.sourcesAndCollections.map(s => s.tags_id);
      infoForQuery['sources[]'] = query.sourcesAndCollections.map(s => s.media_id);
    }
    dispatch(fetchStorySampleByQuery(infoForQuery));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleNextStep();
    },
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.formData);
    },
  });
}

export default
  injectIntl(
    withIntlForm(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        withAsyncFetch(
          TopicCreateNValidateContainer
        )
      )
    )
  );
