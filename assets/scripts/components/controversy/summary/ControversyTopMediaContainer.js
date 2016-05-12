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
    const { controversyId, fetchStatus, onTryAgain, media, sort } = this.props;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <ControversyTopMedia media={media} onChangeSort={this.onChangeSort} sortedBy={sort} />;
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

ControversyTopMediaContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  sort: React.PropTypes.string.isRequired,
  media: React.PropTypes.array,
  controversyId: React.PropTypes.number.isRequired,
  onTryAgain: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired,
};

ControversyTopMediaContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.topMedia.fetchStatus,
  sort: state.controversies.selected.topMedia.sort,
  media: state.controversies.selected.topMedia.media,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAgain: (controversyId, sort) => {
    dispatch(fetchControversyTopMedia(controversyId, sort));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyTopMediaContainer));
