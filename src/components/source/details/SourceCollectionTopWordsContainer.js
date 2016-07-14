import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../common/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import WordCloud from '../../vis/WordCloud';
import { fetchSourceCollectionTopWords } from '../../../actions/sourceActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import Paper from 'material-ui/Paper';

const localMessages = {
  title: { id: 'source.summary.topWords.title', defaultMessage: 'Top Words' },
};

class SourceCollectionTopWordsContainer extends React.Component {
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
    const { sourceId, sectionDescription, fetchStatus, fetchData, words } = this.props;
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
            { sectionDescription }
            {content}
          </div>
        </Paper>
      </div>
    );
  }
}

SourceCollectionTopWordsContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array,
  sourceId: React.PropTypes.string.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  sectionDescription: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionTopWords.fetchStatus,
  words: state.sources.selected.details.collectionDetailsReducer.collectionTopWords.list.wordcounts,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (sourceId) => {
    dispatch(fetchSourceCollectionTopWords(sourceId));
    // }
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceCollectionTopWordsContainer));
