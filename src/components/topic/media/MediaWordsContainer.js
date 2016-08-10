import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import { fetchMediaWords } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import DownloadButton from '../../common/DownloadButton';
import { getBrandDarkColor } from '../../../styles/colors';

class MediaWordsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData } = this.props;
    if (nextProps.filters !== this.props.filters) {
      fetchData(nextProps);
    }
  }
  downloadCsv = (event) => {
    const { topicId, mediaId, filters } = this.props;
    event.preventDefault();
    const url = `/api/topics/${topicId}/media/${mediaId}/words.csv?snapshot=${filters.snapshotId}&timespan=${filters.timespanId}`;
    window.location = url;
  }
  render() {
    const { words } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...messages.topWords} /></h2>
        <OrderedWordCloud words={words} textColor={getBrandDarkColor()} />
      </DataCard>
    );
  }
}

MediaWordsContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  words: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.mediaSource.words.fetchStatus,
  words: state.topics.selected.mediaSource.words.list,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchMediaWords(ownProps.topicId, ownProps.mediaId, props.filters.snapshotId, props.filters.timespanId));
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
      composeAsyncContainer(
        MediaWordsContainer
      )
    )
  );
