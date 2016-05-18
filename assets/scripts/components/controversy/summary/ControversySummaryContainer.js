import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import ControversySummary from './ControversySummary';
import { fetchControversySummary, selectControversy } from '../../../actions/controversyActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import ControversyTopStoriesContainer from './ControversyTopStoriesContainer';
import ControversyTopMediaContainer from './ControversyTopMediaContainer';
import ControversyTopWordsContainer from './ControversyTopWordsContainer';
import TopicControlBar from '../controlbar/TopicControlBar';
import messages from '../../../resources/messages';

class ControversySummaryContainer extends React.Component {
  componentWillMount() {
    const { params, onTryAgain, onWillMount } = this.props;
    onWillMount(params.controversyId);
    onTryAgain(params.controversyId);
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
    const title = formatMessage(messages.topicName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = (
          <div>
            <TopicControlBar />
            <ControversyTopMediaContainer controversyId={info.controversies_id} />
            <ControversyTopStoriesContainer controversyId={info.controversies_id} />
            <ControversyTopWordsContainer controversyId={info.controversies_id} />
            <ControversySummary key="summary" controversy={info} />
          </div>
        );
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={onTryAgain(info.controversies_id)} />;
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
  onWillMount: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.selected.summary.info.fetchStatus,
  info: state.controversies.selected.summary.info,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAgain: (controversyId) => {
    dispatch(fetchControversySummary(controversyId));
  },
  onWillMount: (controversyId) => {
    dispatch(selectControversy(controversyId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversySummaryContainer));
