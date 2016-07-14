import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../common/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import SentenceCount from '../../vis/SentenceCount';
import { fetchSourceCollectionSentenceCount } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Sentences Over Time' },
};

class SourceCollectionSentenceCountContainer extends React.Component {
  componentDidMount() {
    const { fetchStatus, sourceId, fetchData } = this.props;
    if (fetchStatus !== fetchConstants.FETCH_FAILED) {
      fetchData(sourceId);
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
    const { fetchStatus, counts, health } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <SentenceCount total={counts.length} counts={counts} health={health} />;
        break;
      case fetchConstants.FETCH_FAILED:
        // content = <ErrorTryAgain onTryAgain={fetchData(sourceId)} />;
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

SourceCollectionSentenceCountContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  sourceId: React.PropTypes.string.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  health: React.PropTypes.array,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.fetchStatus,
  total: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.total,
  counts: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.list,
  health: state.sources.selected.details.collectionDetailsReducer.collectionSentenceCount.health,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
   // if ((snapshotId !== null) && (timespanId !== null)) {
    dispatch(fetchSourceCollectionSentenceCount(sourceId));
   // }
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceCollectionSentenceCountContainer));
