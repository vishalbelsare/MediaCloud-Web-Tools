import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import ControversyTopMedia from './ControversyTopMedia';
import { fetchControversyTopMedia } from '../../../actions/controversyActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';

const localMessages = {
  title: { id: 'controversy.summary.topMedia.title', defaultMessage: 'Top Media' },
};

class ControversyTopMediaContainer extends React.Component {
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
    const { controversyId, snapshotId, fetchData } = this.props;
    fetchData(controversyId, snapshotId, newSort);
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { controversyId, fetchStatus, fetchData, media, sort, snapshotId } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <ControversyTopMedia media={media} onChangeSort={this.onChangeSort} sortedBy={sort} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain fetchData={fetchData(controversyId)} />;
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

ControversyTopMediaContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  media: React.PropTypes.array,
  controversyId: React.PropTypes.number.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
  snapshotId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.summary.topMedia.fetchStatus,
  sort: state.controversies.selected.summary.topMedia.sort,
  media: state.controversies.selected.summary.topMedia.list,
  snapshotId: state.controversies.selected.filters.snapshotId,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (controversyId, snapshotId, sort) => {
    dispatch(fetchControversyTopMedia(controversyId, snapshotId, sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyTopMediaContainer));
