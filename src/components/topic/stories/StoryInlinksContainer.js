import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryInlinks } from '../../../actions/topicActions';
import composeAsyncWidget from '../../util/composeAsyncWidget';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';
import DataCard from '../../common/DataCard';
import DownloadButton from '../../common/DownloadButton';

class StoryInlinksContainer extends React.Component {
  downloadCsv = () => {
    const { storiesId, topicId, timespanId } = this.props;
    const url = `/api/topics/${topicId}/stories/${storiesId}/inlinks.csv?timespanId=${timespanId}`;
    window.location = url;
  }
  render() {
    const { inlinkedStories, topicId} = this.props;
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
  timespanId: React.PropTypes.number.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  inlinkedStories: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.story.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.story.inlinks.list,
  timespanId: state.topics.selected.filters.timespanId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (timespanId) => {
    dispatch(fetchStoryInlinks(ownProps.topicId, timespanId, ownProps.storiesId)); // fetch the info we need
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps.timespanId);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncWidget(
        StoryInlinksContainer
      )
    )
  );
