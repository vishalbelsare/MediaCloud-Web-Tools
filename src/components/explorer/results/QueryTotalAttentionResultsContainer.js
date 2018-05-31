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
import { queryChangedEnoughToUpdate, postToCombinedDownloadUrl } from '../../../lib/explorerUtil';
import messages from '../../../resources/messages';
import { FETCH_INVALID } from '../../../lib/fetchConstants';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-story-total';

const localMessages = {
  title: { id: 'explorer.storyCount.title', defaultMessage: 'Total Attention' },
  helpIntro: { id: 'explorer.storyCount.help.into',
    defaultMessage: '<p>Compare the total number of stories where at least one sentence matched each of your queries.  Rollover the circles to see the exact numbers, or click the menu in the bottom right to download the data.</p>',
  },
  helpDetails: { id: 'explorer.storyCount.help.details',
    defaultMessage: '<p>It is harder to determine how much of the media\'s attention your search got. If you want to dig into that, a good place to start is comparing your query to a search for everything from the sources and collections you are searching.  You can do this by searching for * in the same date range and media; that matches every story.</p>',
  },
  downloadCsv: { id: 'explorer.attention.total.downloadCsv', defaultMessage: 'Download { name } total story count csv' },
  downloadSVG: { id: 'explorer.attention.total.downloadSVG', defaultMessage: 'Download total story count SVG' },
  viewNormalized: { id: 'explorer.attention.mode.viewNormalized', defaultMessage: 'View by Story Count (default)' },
  viewRegular: { id: 'explorer.attention.mode.viewRegular', defaultMessage: 'View by Story Percentage' },
};

const VIEW_NORMALIZED = 'VIEW_NORMALIZED';
const VIEW_REGULAR = 'VIEW_REGULAR';

class QueryTotalAttentionResultsContainer extends React.Component {
  state = {
    view: VIEW_REGULAR, // which view to show (see view constants above)
  }

  shouldComponentUpdate(nextProps) {
    const { results, queries } = this.props;
    return queryChangedEnoughToUpdate(queries, nextProps.queries, results, nextProps.results);
  }

  setView = (nextView) => {
    this.setState({ view: nextView });
  }

  // if demo, use only sample search queries to download
  downloadCsv = (query) => {
    postToCombinedDownloadUrl('/api/explorer/stories/count.csv', [query]);
  }

  render() {
    const { results, queries } = this.props;
    const { formatNumber, formatMessage } = this.props.intl;
    let content = null;

    const safeResults = results.map((r, idx) => Object.assign({}, r, queries[idx]));

    let bubbleData = [];
    if (safeResults !== undefined && safeResults !== null && safeResults.length > 0) {
      bubbleData = safeResults.map((query, idx) => {
        const value = (this.state.view === VIEW_REGULAR) ? query.total : query.ratio;
        let centerText;
        if (this.state.view === VIEW_REGULAR) {
          centerText = formatNumber(value);
        } else {
          centerText = formatNumber(value, { style: 'percent', maximumFractionDigits: 2 });
        }
        const rolloverText = `${query.label}: ${centerText}`;
        return {
          value,
          aboveText: (idx % 2 === 0) ? query.label : null,
          belowText: (idx % 2 !== 0) ? query.label : null,
          centerText,
          rolloverText,
          centerTextColor: '#FFFFFF',
          fill: query.color,
        };
      });
      content = (
        <div>
          <BubbleRowChart
            data={bubbleData}
            padding={0}
            domId={BUBBLE_CHART_DOM_ID}
            width={650}
          />
          <div className="actions">
            <ActionMenu actionTextMsg={messages.downloadOptions}>
              {safeResults.map((q, idx) =>
                <MenuItem
                  key={idx}
                  className="action-icon-menu-item"
                  primaryText={formatMessage(localMessages.downloadCsv, { name: q.label })}
                  rightIcon={<DownloadButton />}
                  onTouchTap={() => this.downloadCsv(q)}
                />
              )}
            </ActionMenu>
            <ActionMenu actionTextMsg={messages.viewOptions}>
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.viewNormalized)}
                disabled={this.state.view === VIEW_REGULAR}
                onClick={() => this.setView(VIEW_REGULAR)}
              />
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(localMessages.viewRegular)}
                disabled={this.state.view === VIEW_NORMALIZED}
                onClick={() => this.setView(VIEW_NORMALIZED)}
              />
            </ActionMenu>
          </div>
        </div>
      );
    }
    return (content);
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
      composeSummarizedVisualization(localMessages.title, localMessages.helpIntro, [localMessages.helpDetails, messages.countsVsPercentageHelp])(
        composeAsyncContainer(
          QueryTotalAttentionResultsContainer
        )
      )
    )
  );
