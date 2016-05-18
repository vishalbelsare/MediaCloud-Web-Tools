import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import ControversyTopStories from './ControversyTopStories';
import { fetchControversyTopStories } from '../../../actions/controversyActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

const localMessages = {
  title: { id: 'controversy.summary.topStories.title', defaultMessage: 'Top Stories' },
};

class ControversyTopStoriesContainer extends React.Component {
  componentDidMount() {
    const { controversyId, snapshotId, fetchData, sort } = this.props;
    fetchData(controversyId, snapshotId, sort);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshotId !== this.props.snapshotId) {
      const { controversyId, snapshotId, fetchData, sort } = this.props;
      fetchData(controversyId, snapshotId, sort);
    }
  }
  onChangeSort = (newSort) => {
    const { controversyId, fetchData } = this.props;
    fetchData(controversyId, newSort);
  };
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { controversyId, fetchStatus, fetchData, stories, sort } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <ControversyTopStories stories={stories} onChangeSort={this.onChangeSort} sortedBy={sort} />;
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
  sort: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array,
  controversyId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.summary.topStories.fetchStatus,
  sort: state.controversies.selected.summary.topStories.sort,
  stories: state.controversies.selected.summary.topStories.list,
  snapshotId: state.controversies.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (controversyId, snapshotId, sort) => {
    dispatch(fetchControversyTopStories(controversyId, snapshotId, sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyTopStoriesContainer));
