import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeSummarizedVisualization from './SummarizedVizualization';
import composeAsyncContainer from '../../common/AsyncContainer';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import EntitiesTable from '../../common/EntitiesTable';
import { resetEntitiesPeople, fetchTopEntitiesPeople, fetchDemoTopEntitiesPeople } from '../../../actions/explorerActions';
import { queryChangedEnoughToUpdate, postToDownloadUrl } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import QueryResultsSelector from './QueryResultsSelector';
import { TAG_SET_CLIFF_PEOPLE } from '../../../lib/tagUtil';

const localMessages = {
  title: { id: 'explorer.entities.title', defaultMessage: 'Top People' },
  person: { id: 'explorer.entities.person', defaultMessage: 'Person' },
  helpIntro: { id: 'explorer.entities.help.title', defaultMessage: '<p>Looking at <i>who</i> is being talked about can give you a sense of how the media is focusing on the issue you are investigating. This is a list of the people menntioned most often in a sampling of stories. Click on a name to add it to all your queries. Click the menu on the bottom right to download a CSV of all the people mentioned in a sample of stories.</p>' },
  downloadCsv: { id: 'explorer.entities.downloadCsv', defaultMessage: 'Download { name } CLIFF-sampled people csv' },
};

class QueryTopEntitiesPeopleResultsContainer extends React.Component {
  state = {
    selectedQueryIndex: 0,
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData(nextProps.queries);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    return queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
  }
  downloadCsv = (query) => {
    postToDownloadUrl(`/api/explorer/tags/${TAG_SET_CLIFF_PEOPLE}/top-tags.csv`, query);
  }
  render() {
    const { results, queries, handleEntitySelection } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <QueryResultsSelector
          options={queries.map(q => ({ label: q.label, index: q.index, color: q.color }))}
          onQuerySelected={index => this.setState({ selectedQueryIndex: index })}
        />
        {results[this.state.selectedQueryIndex] &&
          <EntitiesTable
            className="explorer-entity"
            entityColNameMsg={localMessages.person}
            entities={results[this.state.selectedQueryIndex].results}
            onClick={e => handleEntitySelection(e, queries[0].searchId)}
            maxTitleLength={50}
          />
        }
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            {queries.map((q, idx) =>
              <MenuItem
                key={idx}
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.downloadCsv, { name: q.label })}
                rightIcon={<DownloadButton />}
                onTouchTap={() => this.downloadCsv(q)}
              />
            )}
          </ActionMenu>
        </div>
      </div>
    );
  }
}

QueryTopEntitiesPeopleResultsContainer.propTypes = {
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  handleEntitySelection: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.topEntitiesPeople.fetchStatus,
  results: state.explorer.topEntitiesPeople.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    dispatch(resetEntitiesPeople());
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
        return dispatch(fetchTopEntitiesPeople(infoToQuery));
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
        return dispatch(fetchDemoTopEntitiesPeople(demoInfo)); // id
      });
    }
  },
  handleEntitySelection: (entity, isCannedSearch) => {
    const queryClauseToAdd = ` tags_id_stories:${entity}`;
    if (isCannedSearch === undefined) {
      ownProps.onQueryModificationRequested(queryClauseToAdd);
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
      composeSummarizedVisualization(localMessages.title, localMessages.helpIntro, [messages.entityHelpDetails])(
        composeAsyncContainer(
          QueryTopEntitiesPeopleResultsContainer
        )
      )
    )
  );
