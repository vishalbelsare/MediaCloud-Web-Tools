import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../common/hocs/AsyncContainer';
import QueryWordDrillDownDataCard from './QueryAttentionOverTimeDrillDownDataCard';
import { fetchDrillDownInfo } from '../../../../actions/explorerActions';
// import { queryChangedEnoughToUpdate /* postToDownloadUrl */ } from '../../../lib/explorerUtil';

class QueryWordDrillDownContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { word } = this.props;
    return (nextProps.word !== word);
  }

  downloadCsv = () => {
    // postToDownloadUrl('/api/explorer/sentences/count.csv', dataPoint);
  }
  render() {
    const { word } = this.props;

    const wordSelected = true;
    let content = <span />;
    // don't bother if datapoint is empty
    if (word) {
      content = <QueryWordDrillDownDataCard words={word} />;
    }

    if (wordSelected) {
      return (
        <div className="query-attention-drill-down">
          {content}
        </div>
      );
    }
    return content;
  }
}

QueryWordDrillDownContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  dataPoint: PropTypes.object,
  queries: PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
  onQueryModificationRequested: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  word: PropTypes.array,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.storySplitCount.fetchStatus,
  dataPoint: state.explorer.storySplitCount.dataPoint,
  word: state.explorer.topWordsPerDateRange.list,
  results: state.explorer.storySplitCount.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (clickedQuery) => {
    // get word tree drill down info
    dispatch(fetchDrillDownInfo(clickedQuery, ownProps));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.word);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withAsyncFetch(
        QueryWordDrillDownContainer
      )
    )
  );
