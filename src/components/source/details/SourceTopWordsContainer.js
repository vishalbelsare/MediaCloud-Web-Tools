import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import WordCloud from '../../vis/WordCloud';
import { fetchSourceTopWords } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'topic.summary.topWords.title', defaultMessage: 'Top Words' },
};

class SourceTopStoriesContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, sourceId, filters, fetchData } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(sourceId, filters.snapshotId, filters.timespanId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      const { sourceId, fetchData } = this.props;
      fetchData(sourceId, nextProps.filters.snapshotId, nextProps.filters.timespanId);
    }
  }
  getStyles() {
    const styles = {
      contentWrapper: {
        padding: 10,
      },
    };
    return styles;
  }
  render() {
    const { sourceId, fetchStatus, fetchData, words } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <WordCloud words={words} width={600} height={300} textColor={'#ff0000'} maxFontSize={32} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData(sourceId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Paper>
          <div style={styles.contentWrapper}>
            <h2><FormattedMessage {...localMessages.title} /></h2>
            {content}
          </div>
        </Paper>
      </div>
    );
  }
}

SourceTopStoriesContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array,
  sourceId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.summary.topWords.fetchStatus,
  words: state.sources.selected.summary.topWords.list,
  filters: state.sources.selected.filters,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId, snapshotId, timespanId) => {
    if ((snapshotId !== null) && (timespanId !== null)) {
      dispatch(fetchSourceTopWords(sourceId, snapshotId, timespanId));
    }
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceTopStoriesContainer));
