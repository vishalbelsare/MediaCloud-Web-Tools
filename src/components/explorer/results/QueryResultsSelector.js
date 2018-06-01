import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TabSelector from '../../common/TabSelector';
import { queryChangedEnoughToUpdate } from '../../../lib/explorerUtil';

function composeQueryResultsSelector() {
  return (ChildComponent) => {
    class QueryResultsSelector extends React.Component {
      state = {
        fetchedData: undefined,
        selectedTabIndex: 0,
      };
      componentWillReceiveProps(nextProps) {
        const { lastSearchTime, fetchData } = this.props;
        if (nextProps.lastSearchTime !== lastSearchTime) {
          fetchData(nextProps.queries);
          this.setState({ fetchedData: true });
        }
      }
      shouldComponentUpdate(nextProps) {
        const { results, queries } = this.props;
        return queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
      }
      setView(nextView) {
        this.setState({ selectedTabIndex: nextView });
        this.forceUpdate();
      }
      render() {
        const { queries } = this.props;
        const tabSelector = <TabSelector onViewSelected={idx => this.setView(idx)} tabLabels={queries} />;
        return (
          <div className="query-results-selector">
            <ChildComponent {...this.props} selectedTabIndex={this.state.selectedTabIndex} tabSelector={tabSelector} />;
          </div>
        );
      }
    }

    QueryResultsSelector.propTypes = {
      intl: PropTypes.object.isRequired,
      location: PropTypes.object,
      // from store
      isLoggedIn: PropTypes.bool.isRequired,
      fetchStatus: PropTypes.string.isRequired,
      results: PropTypes.array,
      queries: PropTypes.array,
      lastSearchTime: PropTypes.number,
      // dispatch
      fetchData: PropTypes.func.isRequired,
    };

    return injectIntl(
      QueryResultsSelector
    );
  };
}
export default composeQueryResultsSelector;
