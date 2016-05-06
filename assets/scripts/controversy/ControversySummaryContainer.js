import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import ErrorTryAgain from '../components/ErrorTryAgain';
import LoadingSpinner from '../components/LoadingSpinner';
import ControversySummary from './controversySummary';
import { fetchControversySummary } from './controversyActions';
import { FETCH_CONTROVERSY_SUMMARY_SUCCEEDED, FETCH_CONTROVERSY_SUMMARY_FAILED } from './controversyReducers';

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
    const { controversies, fetchState, onTryAgain } = this.props;
    const controversyId = this.props.params.controversyId;
    const controversy = controversies[controversyId];
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.defaultTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchState;
    const styles = this.getStyles();
    switch (fetchState) {
      case FETCH_CONTROVERSY_SUMMARY_SUCCEEDED:
        content = <ControversySummary controversy={controversy} />;
        break;
      case FETCH_CONTROVERSY_SUMMARY_FAILED:
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
  fetchState: React.PropTypes.string.isRequired,
  controversies: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  onTryAgain: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
};

ControversySummaryContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchState: state.controversies.meta.fetchSummaryState,
  controversies: state.controversies.all,
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
