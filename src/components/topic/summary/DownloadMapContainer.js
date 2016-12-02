import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import DataCard from '../../common/DataCard';
import { fetchTopicMapFiles } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topic.summary.mapDownload.title', defaultMessage: 'Download Link and Word Maps' },
  helpTitle: { id: 'topic.summary.mapDownload.help.title', defaultMessage: 'Link and Network Maps' },
  helpText: { id: 'topic.summary.mapDownload.help.title', defaultMessage: 'You can download maps once they are generated.' },
};

class DownloadMapContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters.timespanId !== filters.timespanId) {
      fetchData(nextProps);
    }
  }
  render() {
    const { helpButton, linkMapStatus, wordMapStatus } = this.props;
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {linkMapStatus}
        {wordMapStatus}
      </DataCard>
    );
  }
}

DownloadMapContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  linkMapStatus: React.PropTypes.string,
  wordMapStatus: React.PropTypes.string,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.mapFiles.fetchStatus,
  linkMapStatus: state.topics.selected.summary.mapFiles.linkMap,
  wordMapStatus: state.topics.selected.summary.mapFiles.wordMap,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: () => {

  },
  asyncFetch: () => {
    dispatch(fetchTopicMapFiles(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, localMessages.helpText)(
        composeAsyncContainer(
          DownloadMapContainer
        )
      )
    )
  );
