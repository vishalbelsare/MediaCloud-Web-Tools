import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../../../common/AsyncContainer';
import composeHelpfulContainer from '../../../../../common/HelpfulContainer';
import { fetchCreateFocusKeywordStories } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import StoryTable from '../../../../StoryTable';
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
    const { stories, topicId, helpButton } = this.props;
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <StoryTable stories={stories} topicId={topicId} />
      </DataCard>
    );
  }
}

KeywordStoryPreviewContainer.propTypes = {
  // from the composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  keywords: React.PropTypes.string.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingStories.fetchStatus,
  stories: state.topics.selected.focalSets.create.matchingStories.stories,
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
