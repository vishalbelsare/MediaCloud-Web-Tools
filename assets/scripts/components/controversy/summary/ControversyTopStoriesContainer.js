import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import ControversyTopStories from './ControversyTopStories';
import { fetchControversyTopStories } from '../../../actions/controversyActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

const messages = {
  title: { id: 'controversy.summary.topStories.title', defaultMessage: 'Top Stories' },
};

class ControversyTopStoriesContainer extends React.Component {
  componentWillMount() {
    this.fetchData();
  }
  onChangeSort = (newSort) => {
    const { controversyId, onTryAgain } = this.props;
    onTryAgain(controversyId, newSort);
  };
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  fetchData() {
    const { controversyId, onTryAgain, sort } = this.props;
    onTryAgain(controversyId, sort);
  }
  render() {
    const { controversyId, fetchStatus, onTryAgain, stories, sort } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <ControversyTopStories stories={stories} onChangeSort={this.onChangeSort} sortedBy={sort} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={onTryAgain(controversyId)} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <h2><FormattedMessage {...messages.title} /></h2>
        {content}
      </div>
    );
  }
}

ControversyTopStoriesContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array,
  controversyId: React.PropTypes.number.isRequired,
  onTryAgain: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

ControversyTopStoriesContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.topStories.fetchStatus,
  sort: state.controversies.selected.topStories.sort,
  stories: state.controversies.selected.topStories.stories,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAgain: (controversyId, sort) => {
    dispatch(fetchControversyTopStories(controversyId, sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyTopStoriesContainer));
