import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import composeHelpfulContainer from '../../../../../common/HelpfulContainer';
import { fetchCreateFocusKeywordStories } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import TopicStoryTable from '../../../../TopicStoryTable';
import messages from '../../../../../../resources/messages';

const localMessages = {
  title: { id: 'topic.summary.stories.title', defaultMessage: 'Top Stories' },
  helpTitle: { id: 'topic.summary.stories.help.title', defaultMessage: 'About Matching Top Stories' },
};

const NUM_TO_SHOW = 20;

class KeywordStoryPreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { keywords, fetchData } = this.props;
    if ((nextProps.keywords !== keywords)) {
      fetchData(nextProps.keywords);
    }
  }
  render() {
    const { stories, topicId, helpButton, showTweetCounts } = this.props;
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <TopicStoryTable stories={stories} showTweetCounts={showTweetCounts} topicId={topicId} />
      </DataCard>
    );
  }
}

KeywordStoryPreviewContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  keywords: PropTypes.string.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  stories: PropTypes.array,
  showTweetCounts: PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingStories.fetchStatus,
  stories: state.topics.selected.focalSets.create.matchingStories.stories,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (keywords) => {
    const params = {
      q: keywords,
      limit: NUM_TO_SHOW,
    };
    dispatch(fetchCreateFocusKeywordStories(ownProps.topicId, params));
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
      composeHelpfulContainer(localMessages.helpTitle, messages.storiesTableHelpText)(
        composeAsyncContainer(
          KeywordStoryPreviewContainer
        )
      )
    )
  );
