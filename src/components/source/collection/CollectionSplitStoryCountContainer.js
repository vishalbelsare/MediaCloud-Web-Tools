import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchCollectionSplitStoryCount } from '../../../actions/sourceActions';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { getBrandDarkColor } from '../../../styles/colors';
import messages from '../../../resources/messages';
import withHelpfulContainer from '../../common/hocs/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import { urlToExplorerQuery } from '../../../lib/urlUtil';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Last Year of Coverage' },
  helpTitle: { id: 'collection.summary.splitCount.help.title', defaultMessage: 'About Stories Over Time' },
  helpText: { id: 'collection.summary.splitCount.help.text',
    defaultMessage: '<p>This chart shows you the number of stories we have collected from the sources in this collection over the last year.</p>',
  },
  introText: { id: 'chart.storiesOverTime.totalCount',
    defaultMessage: 'We have collected {total, plural, =0 {No stories} one {One story} other {{formattedTotal} stories}} from sources in the "{collectionName}" collection in the last year.',
  },
};

class CollectionSplitStoryCountContainer extends React.Component {
  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/story-split/count.csv`;
    window.location = url;
  }
  handleDataPointClick = (startDate, endDate) => {
    const { collectionName, collectionId } = this.props;
    const startDateStr = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    const endDateStr = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
    const url = urlToExplorerQuery(`${collectionName} on ${startDateStr}`, '*', [], [collectionId],
      startDateStr, endDateStr);
    window.open(url, '_blank');
  }
  render() {
    const { totalStories, counts, health, intl, filename, helpButton, collectionName } = this.props;
    const { formatMessage, formatNumber } = intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <AttentionOverTimeChart
          total={totalStories}
          series={[{
            id: 0,
            name: collectionName,
            color: getBrandDarkColor(),
            data: counts.map(c => [c.date, c.count]),
            showInLegend: false,
          }]}
          introText={formatMessage(localMessages.introText, {
            total: totalStories,
            formattedTotal: formatNumber(totalStories),
            collectionName,
          })}
          health={health}
          height={250}
          filename={filename}
          onDataPointClick={this.handleDataPointClick}
        />
      </DataCard>
    );
  }
}

CollectionSplitStoryCountContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.string.isRequired,
  health: PropTypes.array,
  totalStories: PropTypes.number,
  counts: PropTypes.array,
  // from parent
  collectionId: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
  filename: PropTypes.string,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSplitStoryCount.fetchStatus,
  totalStories: state.sources.collections.selected.collectionSplitStoryCount.total,
  counts: state.sources.collections.selected.collectionSplitStoryCount.list,
  health: state.sources.collections.selected.collectionSplitStoryCount.health,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCollectionSplitStoryCount(ownProps.collectionId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      withHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
        composeAsyncContainer(
          CollectionSplitStoryCountContainer
        )
      )
    )
  );
