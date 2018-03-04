import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeSummarizedVisualization from './SummarizedVizualization';
import composeAsyncContainer from '../../common/AsyncContainer';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import { resetThemes, fetchTopThemes, fetchDemoTopThemes } from '../../../actions/explorerActions';
import { queryChangedEnoughToUpdate, postToDownloadUrl, downloadExplorerSvg } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import QueryResultsSelector from './QueryResultsSelector';
import { TAG_SET_NYT_THEMES } from '../../../lib/tagUtil';
import mapD3Top10Colors from '../../../lib/colorUtil';
import BubbleRowChart from '../../vis/BubbleRowChart';

const BUBBLE_CHART_DOM_ID = 'explorer-nyt-theme-chart';

const localMessages = {
  title: { id: 'explorer.themes.title', defaultMessage: 'Top Themes' },
  helpIntro: { id: 'explorer.themes.help.intro', defaultMessage: '<p>News coverage can be grouped into themes to identify the differing narratives.  This chart shows you the top themes we\'ve detected in stories matching your query. Use this to try and understand what and how this is being talked about.</p>' },
};

class QueryThemesResultsContainer extends React.Component {
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
    postToDownloadUrl(`/api/explorer/tags/${TAG_SET_NYT_THEMES}/top-tags.csv`, query);
  }
  render() {
    const { results, queries, handleThemeClicked } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const data = results[this.state.selectedQueryIndex].results.slice(0, 4).map((info, idx) => ({
      value: info.count,
      fill: mapD3Top10Colors(idx),
      aboveText: (idx % 2 === 0) ? info.label : null,
      belowText: (idx % 2 !== 0) ? info.label : null,
      rolloverText: `${info.label}: ${formatNumber(info.pct, { style: 'percent', maximumFractionDigits: 2 })}`,
    }));
    return (
      <div>
        <QueryResultsSelector
          options={queries.map(q => ({ label: q.label, index: q.index, color: q.color }))}
          onQuerySelected={index => this.setState({ selectedQueryIndex: index })}
        />
        <BubbleRowChart
          data={data}
          domId={BUBBLE_CHART_DOM_ID}
          width={650}
          padding={0}
          onClick={handleThemeClicked}
        />
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            {queries.map((q, idx) =>
              <span key={`q${idx}-items`}>
                <MenuItem
                  key={idx}
                  className="action-icon-menu-item"
                  primaryText={formatMessage(messages.downloadDataCsv, { name: q.label })}
                  rightIcon={<DownloadButton />}
                  onTouchTap={() => this.downloadCsv(q)}
                />
                <MenuItem
                  className="action-icon-menu-item"
                  primaryText={formatMessage(messages.downloadDataSvg, { name: q.label })}
                  rightIcon={<DownloadButton />}
                  onTouchTap={() => downloadExplorerSvg(q.label, 'sampled-nyt_labels', BUBBLE_CHART_DOM_ID)}
                />
              </span>
            )}
          </ActionMenu>
        </div>
      </div>
    );
  }
}

QueryThemesResultsContainer.propTypes = {
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
  handleThemeClicked: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.topThemes.fetchStatus,
  results: state.explorer.topThemes.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    dispatch(resetThemes());
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
        return dispatch(fetchTopThemes(infoToQuery));
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
        return dispatch(fetchDemoTopThemes(demoInfo)); // id
      });
    }
  },
  handleThemeClicked: (entity, isCannedSearch) => {
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
      composeSummarizedVisualization(localMessages.title, localMessages.helpIntro, [messages.nytThemeHelpDetails])(
        composeAsyncContainer(
          QueryThemesResultsContainer
        )
      )
    )
  );
