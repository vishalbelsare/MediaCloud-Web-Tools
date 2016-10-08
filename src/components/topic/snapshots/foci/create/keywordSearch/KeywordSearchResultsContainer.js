import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchCreateFocusKeywordStories } from '../../../../../../actions/topicActions';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import StoryTable from '../../../../StoryTable';

const STORIES_TO_SHOW = 20;

const localMessages = {
  title: { id: 'focus.create.keyword.results.title', defaultMessage: 'Some Matching Stories' },
  about: { id: 'focus.create.keyword.results.about',
    defaultMessage: 'Here is a preview of the top stores in the Timespan of the Topic you are investigating.  Look over these results to make sure they are the types of stories you are hoping this Focus will focus in on.' },
};

class KeywordSearchResultsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    console.log(`search for ${nextProps.keywords}`);
    fetchData(filters, nextProps.keywords);
  }
  render() {
    const { stories, topicId } = this.props;
    return (
      <Row>
        <Col lg={10} md={10} sm={12}>
          <h3><FormattedMessage {...localMessages.title} /></h3>
          <StoryTable stories={stories} topicId={topicId} />
        </Col>
        <Col lg={2} md={2} sm={12}>
          <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
        </Col>
      </Row>
    );
  }
}

KeywordSearchResultsContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  keywords: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from fetchData
  fetchData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  stories: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingStories.fetchStatus,
  filters: state.topics.selected.filters,
  stories: state.topics.selected.focalSets.create.matchingStories.stories,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters, keywords) => {
    // topicId, snapshotId, timespanId, sort, limit, linkId, q
    const params = {
      ...filters,
      limit: STORIES_TO_SHOW,
      q: keywords,
    };
    dispatch(fetchCreateFocusKeywordStories(ownProps.topicId, params));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.filters, ownProps.keywords);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        KeywordSearchResultsContainer
      )
    )
  );
