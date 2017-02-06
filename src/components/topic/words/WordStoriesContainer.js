import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchWordStories, sortWordStories } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';

const STORIES_TO_SHOW = 10;

const localMessages = {
  helpTitle: { id: 'word.stories.help.title', defaultMessage: 'About Word Stories' },
  helpIntro: { id: 'word.stories.help.intro', defaultMessage: '<p>This is a table of stories pertaining this word within the Topic.</p>' },
};

class WordStoriesContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort } = this.props;
    if ((nextProps.filters.timespanId !== filters.timespanId) || (nextProps.sort !== sort) ||
      (nextProps.stem !== this.props.stem)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  downloadCsv = () => {
    const { term, topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/words/${term}/word.csv?timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { inlinkedStories, topicId, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.storyPlural} />
          {helpButton}
        </h2>
        <StoryTable stories={inlinkedStories} topicId={topicId} />
      </DataCard>
    );
  }
}

WordStoriesContainer.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  stem: React.PropTypes.string.isRequired,
  term: React.PropTypes.string.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from fetchData
  fetchData: React.PropTypes.func.isRequired,
  sortData: React.PropTypes.func.isRequired,
  // from state
  sort: React.PropTypes.string.isRequired,
  filters: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  inlinkedStories: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.word.stories.fetchStatus,
  inlinkedStories: state.topics.selected.word.stories.stories,
  sort: state.topics.selected.word.stories.sort,
  filters: state.topics.selected.filters,
  stem: state.topics.selected.word.info.stem,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
      limit: STORIES_TO_SHOW,
    };
    dispatch(fetchWordStories(ownProps.topicId, stateProps.stem, params));
  },
  sortData: (sort) => {
    dispatch(sortWordStories(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpIntro, messages.storiesTableHelpText])(
        composeAsyncContainer(
          WordStoriesContainer
        )
      )
    )
  );

// lightweight wrapper around a StoryTable
