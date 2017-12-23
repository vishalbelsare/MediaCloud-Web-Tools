import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeSummarizedVisualization from './SummarizedVizualization';
import GeoChart from '../../vis/GeoChart';
import { fetchDemoQueryGeo, fetchQueryGeo, resetGeo } from '../../../actions/explorerActions';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import messages from '../../../resources/messages';
import { queryPropertyHasChanged } from '../../../lib/explorerUtil';
import QueryResultsSelector from './QueryResultsSelector';

const localMessages = {
  title: { id: 'explorer.geo.title', defaultMessage: 'Geographic Coverage' },
  help: { id: 'explorer.geo.help',
    defaultMessage: '<p>Here is a heatmap of countries mentioned in this collection (based on a sample of sentences). Darker countried are mentioned more. Click a country to load an Explorer search showing you how the sources in this collection cover it.</p>' },
  descriptionIntro: { id: 'explorer.geo.help.title', defaultMessage: 'About Geographic Attention' },
};

class QueryGeoResultsContainer extends React.Component {
  state = {
    selectedQueryIndex: 0,
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData } = this.props;

    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData(nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { results, queries } = this.props;
    // only re-render if results, any labels, or any colors have changed
    if (results.length) { // may have reset results so avoid test if results is empty
      const labelsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'label');
      const colorsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'color');
      const selectedQueryChanged = this.state.selectedQueryIndex !== nextState.selectedQueryIndex;
      return (
        (labelsHaveChanged || colorsHaveChanged || selectedQueryChanged)
         || (results !== nextProps.results)
      );
    }
    return false; // if both results and queries are empty, don't update
  }
  downloadCsv = (query) => {
    let url = null;
    if (parseInt(query.searchId, 10) >= 0) {
      url = `/api/explorer/geography/geography.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/geography/geography.csv/[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }

  render() {
    const { results, intl, queries, handleCountryClick } = this.props;
    const { formatMessage } = intl;
    return (
      <div>
        <div className="actions">
          <ActionMenu>
            {queries.map((q, idx) =>
              <MenuItem
                key={idx}
                className="action-icon-menu-item"
                primaryText={formatMessage(messages.downloadDataCsv, { name: q.label })}
                rightIcon={<DownloadButton />}
                onTouchTap={() => this.downloadCsv(q)}
              />
            )}
          </ActionMenu>
        </div>
        <QueryResultsSelector
          options={queries.map(q => ({ label: q.label, index: q.index, color: q.color }))}
          onQuerySelected={index => this.setState({ selectedQueryIndex: index })}
        />
        <GeoChart
          data={results[this.state.selectedQueryIndex]}
          countryMaxColorScale={queries[this.state.selectedQueryIndex].color}
          hideLegend
          onCountryClick={handleCountryClick}
          backgroundColor="#f5f5f5"
        />
      </div>
    );
  }

}

QueryGeoResultsContainer.propTypes = {
  // from parent
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onQueryModificationRequested: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  handleCountryClick: PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.geo.fetchStatus,
  results: state.explorer.geo.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleCountryClick: (evt, data) => {
    const countryQueryClause = `tags_id_stories:${data.tags_id}`;
    ownProps.onQueryModificationRequested(countryQueryClause);
  },
  fetchData: (queries) => {
    /* this should trigger when the user clicks the Search button or changes the URL
     for n queries, run the dispatch with each parsed query
    */
    dispatch(resetGeo());
    if (ownProps.isLoggedIn) {
      const runTheseQueries = queries || ownProps.queries;
      runTheseQueries.map((q) => {
        const infoToQuery = {
          start_date: q.startDate,
          end_date: q.endDate,
          q: q.q,
          index: q.index,
          sources: q.sources.map(s => s.id),
          collections: q.collections.map(c => c.id),
        };
        return dispatch(fetchQueryGeo(infoToQuery));
      });
    } else if (queries || ownProps.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || ownProps.queries;
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: q.searchId, // may or may not have these
          query_id: q.id,
          q: q.q, // only if no query id, means demo user added a keyword
        };
        return dispatch(fetchDemoQueryGeo(demoInfo)); // id
      });
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.queries);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeSummarizedVisualization(localMessages.title, localMessages.help, [messages.heatMapHelpText])(
        composeAsyncContainer(
          QueryGeoResultsContainer
        )
      )
    )
  );
