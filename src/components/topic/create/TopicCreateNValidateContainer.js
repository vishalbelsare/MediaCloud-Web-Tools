import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import AppButton from '../../common/AppButton';
import StoryRow from './StoryRow';
import { WarningNotice } from '../../common/Notice';
// import { updateFeedback } from '../../../actions/appActions';
import { goToCreateTopicStep, fetchStorySampleByQuery } from '../../../actions/topicActions';
import messages from '../../../resources/messages';

const NUM_TO_SHOW = 30;
const VALIDATION_CUTOFF = 0.9;

const localMessages = {
  title: { id: 'topic.create.validate.title', defaultMessage: 'Change Topic Seed Query: Validate 30 Sample Stories' },
  about: { id: 'topic.create.validate.about',
    defaultMessage: 'Please review this random sample to make sure these stories are relevant.' },
  warning: { id: 'topic.create.validate.warning', defaultMessage: 'Sorry, but you need to have at least 90% of the random stories we\'ve shown you be relevant for the topic to work well. Please go back and modify your seed query to try and eliminate the irrelevant stories.' },
};

// const TopicCreateNValidateContainer = (props) => {
class TopicCreateNValidateContainer extends React.Component {

  state = {
    matchCount: 0,
  };

  updateMatchCount = (addend) => {
    this.setState({ matchCount: this.state.matchCount + addend });
  }

  render = () => {
    const { finishStep, handlePreviousStep, stories, total } = this.props;
    const { formatMessage } = this.props.intl;

    let warningContent;
    if (this.state.matchCount >= (VALIDATION_CUTOFF * total)) {
      warningContent = (<div />);
    } else {
      warningContent = (
        <WarningNotice>
          <p><FormattedHTMLMessage {...localMessages.warning} /></p>
        </WarningNotice>
      );
    }

    return (
      <Grid>
        <h1>
          <FormattedHTMLMessage {...localMessages.title} />
        </h1>
        <p>
          <FormattedHTMLMessage {...localMessages.about} />
        </p>
        <h1>
          Validated Stories: { this.state.matchCount } / { total }
        </h1>
        <br />
        <Row start="lg" className="topic-create-sample-story-table">
          <Col lg={12}>
            <Row start="lg" className="topic-create-sample-story-table-header">
              <Col lg={8} className="topic-create-story-title-col">
                <b>Sample story</b>
              </Col>
              <Col lg={4} className="topic-create-match-col">
                <b>Is this a useful story?</b>
              </Col>
            </Row>
          </Col>
          <Col lg={12}>
            <Row start="lg" className="topic-create-sample-story-container">
              <Col lg={12}>
                {stories.map(story =>
                  <StoryRow key={story.stories_id} story={story} updateStoryCount={this.updateMatchCount} />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            { warningContent }
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} >
            <AppButton flat label={formatMessage(messages.previous)} onClick={() => handlePreviousStep()} />
            &nbsp; &nbsp;
            <AppButton type="submit" label={formatMessage(messages.confirm)} primary onClick={() => finishStep(this.state.matchCount)} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

TopicCreateNValidateContainer.propTypes = {
  // from parent
  location: PropTypes.object.isRequired,
  // form composition
  intl: PropTypes.object.isRequired,
  // from state
  currentStep: PropTypes.number,
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  stories: PropTypes.array.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from form
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form.topicForm.values,
  currentStep: state.topics.create.preview.workflow.currentStep,
  fetchStatus: state.topics.create.preview.matchingStories.fetchStatus,
  total: state.topics.create.preview.matchingStories.total,
  stories: state.topics.create.preview.matchingStories.list,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToCreateTopicStep(0));
  },
  handleNextStep: (goToNextStep, failedMessage) => {
    if (goToNextStep) {
      // dispatch(goToCreateTopicStep(2));
      console.log('Next!');
    } else {
      console.log(failedMessage);
      // dispatch(updateFeedback({ open: true, message: failedMessage }));
    }
  },
  fetchData: (query) => {
    const infoForQuery = {
      q: query.solr_seed_query,
      start_date: query.start_date,
      end_date: query.end_date,
      rows: NUM_TO_SHOW,
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
    finishStep: (matchCount) => {
      const sufficientStories = matchCount >= (VALIDATION_CUTOFF * stateProps.total);
      const failedMessage = ownProps.intl.formatMessage(localMessages.warning);
      dispatchProps.handleNextStep(sufficientStories, failedMessage);
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
