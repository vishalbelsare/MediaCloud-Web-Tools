import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ErrorTryAgain from '../../util/ErrorTryAgain';
import LoadingSpinner from '../../util/LoadingSpinner';
import TopicSummary from './TopicSummary';
import { fetchTopicSummary, selectTopic } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants.js';
import TopicTopStoriesContainer from './TopicTopStoriesContainer';
import TopicTopMediaContainer from './TopicTopMediaContainer';
import TopicTopWordsContainer from './TopicTopWordsContainer';
import TopicControlBar from '../controlbar/TopicControlBar';
import messages from '../../../resources/messages';
import { Grid } from 'react-flexbox-grid/lib';

class TopicSummaryContainer extends React.Component {
  componentDidMount() {
    const { params, fetchData, onWillMount } = this.props;
    onWillMount(params.topicId);
    fetchData(params.topicId);
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { info, fetchStatus, fetchData } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.topicName);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = (
          <div>
            <TopicControlBar title={info.name} />
            <Grid>
              <TopicTopMediaContainer topicId={info.controversies_id} />
              <TopicTopStoriesContainer topicId={info.controversies_id} />
              <TopicTopWordsContainer topicId={info.controversies_id} />
              <TopicSummary key="summary" topic={info} />
            </Grid>
          </div>
        );
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData(info.controversies_id)} />;
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

TopicSummaryContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  info: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  onWillMount: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
};

const mapStateToProps = (state) => ({
  fetchStatus: state.topics.selected.summary.info.fetchStatus,
  info: state.topics.selected.summary.info,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (topicId) => {
    dispatch(fetchTopicSummary(topicId));
  },
  onWillMount: (topicId) => {
    dispatch(selectTopic(topicId));
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSummaryContainer));
