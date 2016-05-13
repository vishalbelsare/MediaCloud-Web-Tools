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
  componentWillMount() {
    this.fetchData();
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  fetchData() {
    const { controversyId, onTryAgain } = this.props;
    onTryAgain(controversyId);
  }
  render() {
    const { controversyId, fetchStatus, onTryAgain, words } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <WordCloud words={words} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={onTryAgain(controversyId)} />;
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
  onTryAgain: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

ControversyTopStoriesContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.topWords.fetchStatus,
  words: state.controversies.selected.topWords.words,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAgain: (controversyId) => {
    dispatch(fetchControversyTopWords(controversyId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyTopStoriesContainer));
