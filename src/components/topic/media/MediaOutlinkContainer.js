import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchMediaOutlinks, sortMediaOutlinks } from '../../../actions/topicActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import messages from '../../../resources/messages';
import TopicStoryTable from '../TopicStoryTable';
import DataCard from '../../common/DataCard';
import { DownloadButton } from '../../common/IconButton';

const STORIES_TO_SHOW = 10;

const localMessages = {
  helpTitle: { id: 'media.outlinks.help.title', defaultMessage: 'About Media Outlinks' },
  helpIntro: { id: 'media.outlinks.help.intro', defaultMessage: '<p>This is a table of stories linked to in stories published by this Media Source within the Topic.</p>' },
};

class MediaOutlinksContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  downloadCsv = () => {
    const { mediaId, topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/media/${mediaId}/outlinks.csv?timespanId=${filters.timespanId}&q=${filters.q}`;
    window.location = url;
  }
  render() {
    const { outlinkedStories, topicId, helpButton } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...messages.outlinks} />
          {helpButton}
        </h2>
        <TopicStoryTable stories={outlinkedStories} topicId={topicId} onChangeSort={this.onChangeSort} />
      </DataCard>
    );
  }
}

MediaOutlinksContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  outlinkedStories: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.outlinks.fetchStatus,
  outlinkedStories: state.topics.selected.mediaSource.outlinks.stories,
  sort: state.topics.selected.mediaSource.outlinks.sort,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
      limit: STORIES_TO_SHOW,
    };
    dispatch(fetchMediaOutlinks(ownProps.topicId, ownProps.mediaId, params)); // fetch the info we need
  },
  sortData: (sort) => {
    dispatch(sortMediaOutlinks(sort));
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
          MediaOutlinksContainer
        )
      )
    )
  );
