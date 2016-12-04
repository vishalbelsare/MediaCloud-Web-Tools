import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchCreateFocusKeywordStories, fetchCreateFocusKeywordAttention } from '../../../../../../actions/topicActions';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import DataCard from '../../../../../common/DataCard';
import StoryTable from '../../../../StoryTable';

const STORIES_TO_SHOW = 20;

const localMessages = {
  storiesTitle: { id: 'focus.create.keyword.results.title', defaultMessage: 'Matching Stories' },
  about: { id: 'focus.create.keyword.results.about',
    defaultMessage: 'Here is a preview of the top stores in the Timespan of the Topic you are investigating.  Look over these results to make sure they are the types of stories you are hoping this Focus will focus in on.' },
  noResults: { id: 'focus.create.keywords.results.none', defaultMessage: 'We didn\'t find any matches!  Please check your query and try it again.' },
};

class KeywordSearchResultsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData } = this.props;
    fetchData(nextProps.keywords);
  }
  render() {
    const { stories, topicId } = this.props;
    let content = null;
    if (stories.length === 0) {
      content = (
        <Row>
          <Col lg={12}>
            <span className="warning"><FormattedMessage {...localMessages.noResults} /></span>
          </Col>
        </Row>
      );
    } else {
      content = (
        <div className="focal-create-boolean-keyword-preview">
          <Row>
            <Col lg={10} md={10} sm={12}>
              <DataCard>
                <h2><FormattedMessage {...localMessages.storiesTitle} /></h2>
                <StoryTable stories={stories} topicId={topicId} />
              </DataCard>
            </Col>
            <Col lg={2} md={2} sm={12}>
              <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
            </Col>
          </Row>
          <Row>
            <Col lg={10} md={10} sm={12}>
              <DataCard>
                <h2><FormattedMessage {...localMessages.storiesTitle} /></h2>
                <StoryTable stories={stories} topicId={topicId} />
              </DataCard>
            </Col>
            <Col lg={2} md={2} sm={12}>
              <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
            </Col>
          </Row>
        </div>
      );
    }
    return content;
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
  stories: React.PropTypes.array,
  attentionTotal: React.PropTypes.number,
  attentionCounts: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingStories.fetchStatus,
  stories: state.topics.selected.focalSets.create.matchingStories.stories,
  attentionTotal: state.topics.selected.focalSets.create.matchingAttention.total,
  attentionCounts: state.topics.selected.focalSets.create.matchingAttention.counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (keywords) => {
    // topicId, limit, q
    const params = {
      limit: STORIES_TO_SHOW,
      q: keywords,
    };
    dispatch(fetchCreateFocusKeywordStories(ownProps.topicId, params));
    dispatch(fetchCreateFocusKeywordAttention(ownProps.topicId, params));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.keywords);
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
