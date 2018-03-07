import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchQueryPerDateTopWords, fetchDemoQueryPerDateTopWords, fetchQueryPerDateSampleStories, fetchDemoQueryPerDateSampleStories, resetQueriesPerDateTopWords, resetQueriesPerDateSampleStories, resetSentenceDataPoint } from '../../../actions/explorerActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import QueryAttentionOverTimeDrillDownDataCard from './QueryAttentionOverTimeDrillDownDataCard';
// import { queryChangedEnoughToUpdate /* postToDownloadUrl */ } from '../../../lib/explorerUtil';

class QueryAttentionOverTimeDrillDownContainer extends React.Component {
  state = {
    isDrillDownVisible: false,
    dateRange: null,
    clickedQuery: null,
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData, dataPoint } = this.props;
    if ((nextProps.lastSearchTime !== lastSearchTime ||
      nextProps.dataPoint !== dataPoint) && nextProps.dataPoint !== null) {
      fetchData(nextProps.dataPoint);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { dataPoint } = this.props;
    return (nextProps.dataPoint !== dataPoint);
  }

  downloadCsv = () => {
    // postToDownloadUrl('/api/explorer/sentences/count.csv', dataPoint);
  }
  render() {
    const { words, stories, dataPoint } = this.props;

    let drillDown = <br />;
    if (words && words.length > 0 && stories !== undefined) {
      drillDown = <QueryAttentionOverTimeDrillDownDataCard info={dataPoint} words={words} stories={stories} />;
    }

    return drillDown;
  }
}

QueryAttentionOverTimeDrillDownContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  dataPoint: PropTypes.object,
  queries: PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  words: PropTypes.array,
  stories: PropTypes.array,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.sentenceCount.fetchStatus,
  dataPoint: state.explorer.sentenceCount.dataPoint,
  words: state.explorer.topWordsPerDateRange.list,
  stories: state.explorer.storiesPerDateRange.results,
  results: state.explorer.sentenceCount.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (clickedQuery) => {
    // this should trigger when the user clicks a data point on the attention over time chart
    dispatch(resetQueriesPerDateSampleStories());
    dispatch(resetQueriesPerDateTopWords());
    dispatch(resetSentenceDataPoint())
      .then(() => {
        if (clickedQuery && clickedQuery !== undefined) {
          if (ownProps.isLoggedIn) {
            dispatch(fetchQueryPerDateSampleStories({ ...clickedQuery }));
            dispatch(fetchQueryPerDateTopWords({ ...clickedQuery }));
          } else {
            dispatch(fetchDemoQueryPerDateTopWords(clickedQuery));
            dispatch(fetchDemoQueryPerDateSampleStories(clickedQuery));
          }
        }
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.dataPoint);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        QueryAttentionOverTimeDrillDownContainer
      )
    )
  );
