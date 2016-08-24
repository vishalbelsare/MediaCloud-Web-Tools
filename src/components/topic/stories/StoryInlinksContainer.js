import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryInlinks } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';

class StoryInlinksContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.filters);
    }
  }
  downloadCsv = () => {
    const { storiesId, topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/stories/${storiesId}/inlinks.csv?timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { inlinkedStories, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...messages.inlinks} /></h2>
        <StoryTable stories={inlinkedStories} topicId={topicId} />
      </DataCard>
    );
  }
}

StoryInlinksContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  storiesId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from fetchData
  fetchData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  inlinkedStories: React.PropTypes.array.isRequired,
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.story.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.story.inlinks.stories,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters) => {
    dispatch(fetchStoryInlinks(ownProps.topicId, ownProps.storiesId, filters));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.filters);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        StoryInlinksContainer
      )
    )
  );
