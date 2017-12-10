import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import DataCard from '../../common/DataCard';
import composeAsyncContainer from '../../common/AsyncContainer';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import EntitiesTable from '../../common/EntitiesTable';
import { resetEntitiesOrgs, fetchTopEntitiesOrgs, fetchDemoTopEntitiesOrgs } from '../../../actions/explorerActions';
import { queryPropertyHasChanged } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import QueryResultsSelector from './QueryResultsSelector';

// const NUM_TO_SHOW = 20;

const localMessages = {
  title: { id: 'explorer.entities.title', defaultMessage: 'Top Organizations' },
  helpIntro: { id: 'explorer.entities.help.title', defaultMessage: '<p>Looking at which organizations and companies are being talked about can give you a sense of how the media is focusing on the issue you are investigating. This is a list of the organizations menntioned most often in a sampling of stories. Click on a name to add it to all your queries. Click the menu on the top right to download a CSV of all the organizations mentioned in a sample of stories.</p>' },
};

class QueryTopEntitiesOrgsResultsContainer extends React.Component {
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
      url = `/api/explorer/entities/organizations/entities.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/entities/organizations/entities.csv?[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }
  render() {
    const { results, queries, handleEntitySelection } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
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
        <h2>
          <FormattedMessage {...localMessages.title} />
        </h2>
        <QueryResultsSelector
          options={queries.map(q => ({ label: q.label, index: q.index, color: q.color }))}
          onQuerySelected={index => this.setState({ selectedQueryIndex: index })}
        />
        <EntitiesTable
          className="explorer-entity"
          entities={results[this.state.selectedQueryIndex].results}
          onClick={e => handleEntitySelection(e, queries[0].searchId)}
          maxTitleLength={50}
        />
      </DataCard>
    );
  }
}

QueryTopEntitiesOrgsResultsContainer.propTypes = {
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
  fetchStatus: state.explorer.topEntitiesOrgs.fetchStatus,
  results: state.explorer.topEntitiesOrgs.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    dispatch(resetEntitiesOrgs());
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
        return dispatch(fetchTopEntitiesOrgs(infoToQuery));
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
        return dispatch(fetchDemoTopEntitiesOrgs(demoInfo)); // id
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
      composeDescribedDataCard(localMessages.helpIntro, [messages.entityHelpDetails])(
        composeAsyncContainer(
          QueryTopEntitiesOrgsResultsContainer
        )
      )
    )
  );
