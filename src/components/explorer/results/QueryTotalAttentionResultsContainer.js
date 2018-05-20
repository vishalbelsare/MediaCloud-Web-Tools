import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeSummarizedVisualization from './SummarizedVizualization';
import { DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import BubbleRowChart from '../../vis/BubbleRowChart';
import { queryChangedEnoughToUpdate, postToCombinedDownloadUrl, downloadExplorerSvg } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import { FETCH_INVALID } from '../../../lib/fetchConstants';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-story-total';

const localMessages = {
  title: { id: 'explorer.storyCount.title', defaultMessage: 'Total Attention' },
  helpIntro: { id: 'explorer.storyCount.help.into',
    defaultMessage: '<p>Compare the total number of stories where at least one sentence matched each of your queries.  Rollover the circles to see the exact numbers, or click the menu in the top right to download the data.</p>',
  },
  helpDetails: { id: 'explorer.storyCount.help.details',
    defaultMessage: '<p>It is harder to determine how much of the media\'s attention your search got. If you want to dig into that, a good place to start is comparing your query to a search for everything from the sources and collections you are searching.  You can do this by searching for * in the same date range and media; that matches every story.</p>',
  },
  downloadCSV: { id: 'explorer.attention.downloadCSV', defaultMessage: 'Download total attention CSV' },
  downloadSVG: { id: 'explorer.attention.downloadSVG', defaultMessage: 'Download total attention SVG' },
};

class QueryTotalAttentionResultsContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    return queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
  }
  // if demo, use only sample search queries to download
  downloadCsv = (queries) => {
    postToCombinedDownloadUrl('/api/explorer/stories/count.csv', queries);
  }
  render() {
    const { results, queries } = this.props;
    const { formatNumber, formatMessage } = this.props.intl;
    let content = null;

    const safeResults = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    let bubbleData = [];
    if (safeResults !== undefined && safeResults !== null && safeResults.length > 0) {
      bubbleData = [
        ...safeResults.sort((a, b) => b.count - a.count).map((query, idx) => ({
          value: query.total,
          aboveText: (idx % 2 === 0) ? query.label : null,
          belowText: (idx % 2 !== 0) ? query.label : null,
          rolloverText: `${query.label}: ${formatNumber(query.total)}`,
          fill: query.color,
        })),
      ];
      content = (<BubbleRowChart
        data={bubbleData}
        padding={0}
        domId={BUBBLE_CHART_DOM_ID}
        width={650}
      />);
    }
    return (
      <div>
        {content}
        <div className="actions">
          <ActionMenu actionTextMsg={messages.downloadOptions}>
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(localMessages.downloadCSV)}
              rightIcon={<DownloadButton />}
              onTouchTap={() => this.downloadCsv(safeResults)}
            />
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(localMessages.downloadSVG)}
              rightIcon={<DownloadButton />}
              onTouchTap={() => downloadExplorerSvg('total', 'story-count', BUBBLE_CHART_DOM_ID)}
            />
          </ActionMenu>
        </div>
      </div>
    );
  }
}

QueryTotalAttentionResultsContainer.propTypes = {
  lastSearchTime: PropTypes.number.isRequired,
  queries: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  results: PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  fetchStatus: state.explorer.storySplitCount.fetchStatus || FETCH_INVALID,
  results: state.explorer.storySplitCount.results,
});

const mapDispatchToProps = () => ({
  asyncFetch: () => null, // don't do anything, becuase the attention-over-time widget is fetching the data for us
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
       composeSummarizedVisualization(localMessages.title, localMessages.helpIntro, localMessages.helpDetails)(
        composeAsyncContainer(
          QueryTotalAttentionResultsContainer
        )
      )
    )
  );
