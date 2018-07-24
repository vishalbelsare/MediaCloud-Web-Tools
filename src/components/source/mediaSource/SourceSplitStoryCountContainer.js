import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import { getBrandDarkColor } from '../../../styles/colors';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchSourceSplitStoryCount } from '../../../actions/sourceActions';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import messages from '../../../resources/messages';
import withHelp from '../../common/hocs/HelpfulContainer';
import ActionMenu from '../../common/ActionMenu';
import { DownloadButton } from '../../common/IconButton';
import { urlToExplorerQuery } from '../../../lib/urlUtil';

const localMessages = {
  title: { id: 'source.summary.splitCount.title', defaultMessage: 'Stories from this Media Source (over the last year)' },
  helpTitle: { id: 'source.summary.splitCount.help.title', defaultMessage: 'About Stories Over Time' },
  helpText: { id: 'source.summary.splitCount.help.text',
    defaultMessage: '<p>This chart shows you the number of stories we have collected from this source over time. Click on the line to see a summary of the content in this source for that date. The grey vertical lines indicate weeks where we didn\'t get as many stories as we\'d expect to.</p>',
  },
  regularlyCollectedStories: { id: 'explorer.attention.series.regular', defaultMessage: 'Regularly Collected Stories (default)' },
  allStories: { id: 'explorer.attention.series.allstories', defaultMessage: 'All Stories' },

};

const VIEW_ALL_STORIES = 'VIEW_ALL_STORIES';
const VIEW_REGULARLY_COLLECTED = 'VIEW_REGULARLY_COLLECTED';


class SourceSplitStoryCountContainer extends React.Component {
  state = {
    storyCollection: VIEW_REGULARLY_COLLECTED,
  }
  componentWillUnmount() {
    this.setState({ storyCollection: 'weird' });
  }
  onIncludeSpidered = (d) => {
    this.setState({ storyCollection: d });  // reset this to trigger a re-render
  }
  handleDataPointClick = (startDate, endDate) => {
    const { sourceId, sourceName } = this.props;
    const startDateStr = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    const endDateStr = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
    const url = urlToExplorerQuery(sourceName, '*', [sourceId], [], startDateStr, endDateStr);
    window.open(url, '_blank');
  }
  downloadCsv = () => {
    const { sourceId } = this.props;
    const url = `/api/sources/${sourceId}/story-split/count.csv`;
    window.location = url;
  }
  render() {
    const { allStories, partialStories, health, filename, helpButton, sourceName } = this.props;
    const { formatMessage } = this.props.intl;
    let stories = allStories;
    if (this.state.storyCollection === VIEW_REGULARLY_COLLECTED) {
      stories = partialStories;
    }
    return (
      <DataCard>
        <div className="action-menu-set">
          <ActionMenu>
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(messages.downloadCSV)}
              rightIcon={<DownloadButton />}
              onTouchTap={this.downloadCsv}
            />
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(localMessages.regularlyCollectedStories)}
              disabled={this.state.storyCollection === VIEW_REGULARLY_COLLECTED}
              onClick={() => this.onIncludeSpidered(VIEW_REGULARLY_COLLECTED)}
            />
            <MenuItem
              className="action-icon-menu-item"
              primaryText={formatMessage(localMessages.allStories)}
              disabled={this.state.storyCollection === VIEW_ALL_STORIES}
              onClick={() => this.onIncludeSpidered(VIEW_ALL_STORIES)}
            />
          </ActionMenu>
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <AttentionOverTimeChart
          total={stories.total}
          series={[{
            id: 0,
            name: sourceName,
            color: getBrandDarkColor(),
            data: stories.list.map(c => [c.date, c.count]),
            showInLegend: false,
          }]}
          health={health}
          height={250}
          filename={filename}
          onDataPointClick={this.handleDataPointClick}
        />
      </DataCard>
    );
  }
}

SourceSplitStoryCountContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.string.isRequired,
  health: PropTypes.array,
  allStories: PropTypes.object,
  partialStories: PropTypes.object,
  splitStoryCount: PropTypes.object,
  // from parent
  sourceId: PropTypes.number.isRequired,
  sourceName: PropTypes.string.isRequired,
  filename: PropTypes.string,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.selected.splitStoryCount.fetchStatus,
  splitStoryCount: state.sources.sources.selected.splitStoryCount,
  allStories: state.sources.sources.selected.splitStoryCount.all_stories,
  partialStories: state.sources.sources.selected.splitStoryCount.partial_stories,
  // counts: state.sources.sources.selected.splitStoryCount,
  health: state.sources.sources.selected.splitStoryCount.health,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceSplitStoryCount(ownProps.sourceId, { separate_spidered: true }));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      withHelp(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
        withAsyncFetch(
          SourceSplitStoryCountContainer
        )
      )
    )
  );
