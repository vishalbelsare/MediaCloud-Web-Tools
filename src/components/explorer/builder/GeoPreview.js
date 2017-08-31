import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { GridList, GridTile } from 'material-ui/GridList';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import GeoChart from '../../vis/GeoChart';
import { fetchDemoQueryGeo, fetchQueryGeo, resetGeo } from '../../../actions/explorerActions';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import messages from '../../../resources/messages';
import { getBrandLightColor } from '../../../styles/colors';
import { hasPermissions, getUserRoles, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DEFAULT_SOURCES, DEFAULT_COLLECTION, queryPropertyHasChanged } from '../../../lib/explorerUtil';


const localMessages = {
  title: { id: 'explorer.geo.title', defaultMessage: 'Geographic Attention' },
  intro: { id: 'explorer.geo.info',
    defaultMessage: '<p>Here is a heatmap of countries mentioned in this collection (based on a sample of sentences). Darker countried are mentioned more. Click a country to load a Dashboard search showing you how the sources in this collection cover it.</p>' },
  descriptionIntro: { id: 'explorer.geo.help.title', defaultMessage: 'About Geographic Attention' },
  downloadCSV: { id: 'explorer.attention.downloadcsv', defaultMessage: 'Download {name}' },
};

class GeoPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { urlQueryString, lastSearchTime, fetchData } = this.props;

    if (nextProps.lastSearchTime !== lastSearchTime ||
      (nextProps.urlQueryString && urlQueryString && nextProps.urlQueryString.pathname !== urlQueryString.pathname)) {
      fetchData(nextProps.urlQueryString, nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    // only re-render if results, any labels, or any colors have changed
    if (results.length) { // may have reset results so avoid test if results is empty
      const labelsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'label');
      const colorsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'color');
      return (
        ((labelsHaveChanged || colorsHaveChanged))
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

  /* handleCountryClick = (event, geo) => {
    const { results } = this.props;

    // TODO are we supporting this?
    const countryName = geo.name;
    const countryTagId = geo.tags_id;
    // const url = `https://dashboard.mediacloud.org/#query/["(tags_id_story_sentences: ${countryTagId})"]/[{"sets":[${collectionId}]}]/[]/[]/[{"uid":1,"name":"${collectionName} - ${countryName}","color":"55868A"}]`;
    // window.open(url, '_blank');
  } */

  render() {
    const { results, intl, queries } = this.props;
    const { formatMessage } = intl;
    let geoChartSection = null;
    if (results && results.length > 0 && queries && queries.length > 0) {
      geoChartSection = (
        results.map((geoSet, idx) =>
            (<GridTile key={idx}>
              <h3>{queries && queries.length > idx ? queries[idx].label : ''}</h3>
              <GeoChart data={geoSet} countryMaxColorScale={getBrandLightColor()} />
            </GridTile>
            )
          )
      );
    }
    return (
      <DataCard>
        <div className="actions">
          <ActionMenu>
            {queries.map((q, idx) =>
              <MenuItem
                key={idx}
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.downloadCSV, { name: q.label })}
                rightIcon={<DownloadButton />}
                onTouchTap={() => this.downloadCsv(q)}
              />
            )}
          </ActionMenu>
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <GridList
          className="geo-mini-cards"
          cellHeight={400}
        >
          {geoChartSection}
        </GridList>
      </DataCard>
    );
  }

}

GeoPreview.propTypes = {
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  user: React.PropTypes.object.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  urlQueryString: React.PropTypes.object.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  urlQueryString: ownProps.params,
  fetchStatus: state.explorer.geo.fetchStatus,
  results: state.explorer.geo.results,
});

const mapDispatchToProps = (dispatch, state) => ({
  fetchData: (params, queries) => {
    /* this should trigger when the user clicks the Search button or changes the URL
     for n queries, run the dispatch with each parsed query
    */
    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    dispatch(resetGeo());
    if (isLoggedInUser) {
      const runTheseQueries = queries || state.queries;
      runTheseQueries.map((q) => {
        const infoToQuery = {
          start_date: q.startDate,
          end_date: q.endDate,
          q: q.q,
          index: q.index,
          sources: [DEFAULT_SOURCES],
          collections: [DEFAULT_COLLECTION],
        };
        return dispatch(fetchQueryGeo(infoToQuery));
      });
    } else if (queries || state.queries) { // else assume DEMO mode, but assume the queries have been loaded
      const runTheseQueries = queries || state.queries;
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
      dispatchProps.fetchData(ownProps);
    },
  });
}
export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
       composeDescribedDataCard(localMessages.descriptionIntro, [messages.storyCountHelpText])(
        composeAsyncContainer(
          GeoPreview
        )
      )
    )
  );
