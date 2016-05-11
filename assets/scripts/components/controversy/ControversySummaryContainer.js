import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import ErrorTryAgain from '../util/ErrorTryAgain';
import LoadingSpinner from '../util/LoadingSpinner';
import ControversySummary from './controversySummary';
import { fetchControversySummary } from '../../actions/controversyActions';
import * as fetchConstants from '../../lib/fetchConstants.js';

const messages = {
  defaultTitle: { id: 'controversy.title.default', defaultMessage: 'Controversy' },
};

class ControversySummaryContainer extends React.Component {
  componentWillMount() {
    const controversyId = this.props.params.controversyId;
    this.context.store.dispatch(fetchControversySummary(controversyId));
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { info, fetchStatus, onTryAgain } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.defaultTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <ControversySummary controversy={info} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={onTryAgain} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        {content}
      </div>
    );
  }
}

ControversySummaryContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  info: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  onTryAgain: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
};

ControversySummaryContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.summary.fetchStatus,
  info: state.controversies.selected.summary,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAgain: () => {
    dispatch(fetchControversySummary());  // TODO: how to get the id in here?
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversySummaryContainer));
