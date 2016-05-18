import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import WordCloud from './WordCloud';
import { fetchControversyTopWords } from '../../../actions/controversyActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

const localMessages = {
  title: { id: 'controversy.summary.topWords.title', defaultMessage: 'Top Words' },
};

class ControversyTopStoriesContainer extends React.Component {
  componentDidMount() {
    const { controversyId, snapshotId, fetchData } = this.props;
    fetchData(controversyId, snapshotId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { controversyId, snapshotId, fetchData } = this.props;
      fetchData(controversyId, snapshotId);
    }
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { controversyId, fetchStatus, fetchData, words } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <WordCloud words={words} width={700} height={400} textColor={'#ff0000'} maxFontSize={32} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData(controversyId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        {content}
      </div>
    );
  }
}

ControversyTopStoriesContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  words: React.PropTypes.array,
  controversyId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.summary.topWords.fetchStatus,
  words: state.controversies.selected.summary.topWords.list,
  snapshotId: state.controversies.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (controversyId, snapshotId) => {
    dispatch(fetchControversyTopWords(controversyId, snapshotId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyTopStoriesContainer));
