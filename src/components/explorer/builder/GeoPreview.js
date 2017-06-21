import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { GridList, GridTile } from 'material-ui/GridList';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import GeoChart from '../../vis/GeoChart';
import { fetchDemoQueryGeo, fetchQueryGeo } from '../../../actions/explorerActions';

import messages from '../../../resources/messages';
import { DownloadButton } from '../../common/IconButton';
import { getBrandLightColor } from '../../../styles/colors';
import { hasPermissions, getUserRoles, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const localMessages = {
  title: { id: 'explorer.geo.title', defaultMessage: 'Geographic Attention' },
  intro: { id: 'explorer.geo.info',
    defaultMessage: '<p>Here is a heatmap of countries mentioned in this collection (based on a sample of sentences). Darker countried are mentioned more. Click a country to load a Dashboard search showing you how the sources in this collection cover it.</p>' },
  descriptionIntro: { id: 'explorer.geo.help.title', defaultMessage: 'About Geographic Attention' },
};

class GeoPreview extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { urlQueryString, lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime ||
      nextProps.urlQueryString.searchId !== urlQueryString.searchId) {
    // TODO also check for name and color changes
      fetchData(nextProps.urlQueryString.searchId);
    }
  }

  downloadCsv = () => {
    // const { collectionId } = this.props;
    // const url = `/api/collections/${collectionId}/geography/geography.csv`;
    // window.location = url;
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
    return (
      <DataCard>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <GridList
          style={{ width: 1000, height: 1000, overflowY: 'auto' }}
          className="geo-mini-cards"
          cellHeight={400}
        >
          {results.map((geoSet, idx) =>
            (<GridTile>
              <div className="actions">
                <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
              </div>
              <h3>{queries[idx].label}</h3>
              <GeoChart data={geoSet} countryMaxColorScale={getBrandLightColor()} />
            </GridTile>
            )
          )}
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
  sampleSearches: React.PropTypes.array, // TODO, could we get here without any sample searches? yes if logged in...
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
  fetchData: (query, idx) => {
    /* this should trigger when the user clicks the Search button or changes the URL
     for n queries, run the dispatch with each parsed query
    */

    const isLoggedInUser = hasPermissions(getUserRoles(state.user), PERMISSION_LOGGED_IN);
    if (isLoggedInUser) {
      if (idx) { // specific change/update here
        dispatch(fetchQueryGeo(query, idx));
      } else { // get all results
        state.queries.map((q, index) => dispatch(fetchQueryGeo(q, index)));
      }
    } else if (state.params && state.params.searchId) { // else assume DEMO mode
      let runTheseQueries = state.sampleSearches[state.params.searchId].data;
      // merge sample search queries with custom

      // find queries on stack without id but with index and with q, and add?
      const newQueries = state.queries.filter(q => q.id === undefined && q.index);
      runTheseQueries = runTheseQueries.concat(newQueries);
      runTheseQueries.map((q, index) => {
        const demoInfo = {
          index, // should be same as q.index btw
          search_id: state.params.searchId, // may or may not have these
          query_id: q.id, // TODO if undefined, what to do?
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
      dispatchProps.fetchData();
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
