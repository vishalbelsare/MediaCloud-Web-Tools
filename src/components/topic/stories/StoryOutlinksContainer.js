import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchStoryOutlinks } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import messages from '../../../resources/messages';
import StoryTable from '../StoryTable';
import DataCard from '../../common/DataCard';
import DownloadButton from '../../common/DownloadButton';

class StoryOutlinksContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.filters);
    }
  }
  downloadCsv = (event) => {
    const { storiesId, topicId, filters } = this.props;
    event.preventDefault();
    const url = `/api/topics/${topicId}/stories/${storiesId}/outlinks.csv?timespanId=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { outlinkedStories, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...messages.outlinks} /></h2>
        <StoryTable stories={outlinkedStories} topicId={topicId} />
      </DataCard>
    );
  }
}

StoryOutlinksContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  storiesId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  outlinkedStories: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.story.outlinks.fetchStatus,
  outlinkedStories: state.topics.selected.story.outlinks.stories,
  timespanId: state.topics.selected.filters.timespanId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters) => {
    dispatch(fetchStoryOutlinks(ownProps.topicId, ownProps.storiesId, filters));
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
        StoryOutlinksContainer
      )
    )
  );
