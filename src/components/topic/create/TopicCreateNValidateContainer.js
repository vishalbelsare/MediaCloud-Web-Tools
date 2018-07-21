import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import AppButton from '../../common/AppButton';
import StoryRow from './StoryRow';
import { goToCreateTopicStep } from '../../../actions/topicActions';
// fetchStorySampleByQuery
import messages from '../../../resources/messages';

const NUM_TO_SHOW = 30;

const localMessages = {
  title: { id: 'topic.create.validate.title', defaultMessage: 'Step 3: Validate Your Topic' },
  about: { id: 'topic.create.validate.about',
    defaultMessage: '<b>We strongly encourage you to validate your seed query. Below are 30 randomly selected headlines from your seed query. Review the stories and select the ones that match what you are looking for.' },
};

const TopicCreateNValidateContainer = (props) => {
  const { handleNextStep, handlePreviousStep } = props;
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
              <Col lg={1} />
              <Col lg={3} className="topic-create-match-col">
                <b>Is this story a match?</b>
              </Col>
            </Row>
            <div>
              <StoryRow />
            </div>
            {
              // <div className="topic-create-sample-story-container">
              //   {sampleStories.map((story, idx) =>
              //     <MatchingStory
              //       key={story.stories_id}
              //       topicId={topicId}
              //       story={story}
              //       prob={sampleProbs[idx]}
              //       label={sampleLabels[idx]}
              //     />
              //   )}
              // </div>
            }
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
  query: PropTypes.object.isRequired,
  // form composition
  intl: PropTypes.object.isRequired,
  // from state
  currentStep: PropTypes.number,
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from form
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  currentStep: state.topics.create.preview.workflow.currentStep,
  formData: state.form.topicForm.values, // dependent on step 1 (configure)
  fetchStatus: state.topics.create.preview.matchingStories.fetchStatus,
  sort: state.topics.create.preview.matchingStories.total,
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
    // test that we got the query before trying to dispatch...
    console.log(infoForQuery);
    // dispatch(fetchStorySampleByQuery(infoForQuery));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: () => {
      dispatchProps.handleNextStep();
    },
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.query);
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
