import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchCollectionSplitStoryCount } from '../../../actions/sourceActions';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';

import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Last Year of Coverage' },
  helpTitle: { id: 'collection.summary.sentenceCount.help.title', defaultMessage: 'About Stories Over Time' },
  helpText: { id: 'collection.summary.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the number of stories we have collected from the sources in this collection over the last year.</p>',
  },
};

class CollectionSplitStoryCountContainer extends React.Component {
  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/stories/split-count.csv`;
    window.location = url;
  }
  handleDataPointClick = (startDate, endDate) => {
    const { collectionId } = this.props;
    const startDateStr = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    const endDateStr = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
    const url = `https://dashboard.mediacloud.org/#query/["*"]/[{"sets":[${collectionId}]}]/["${startDateStr}"]/["${endDateStr}"]/[{"uid":1,"name":"time","color":"55868A"}]`;
    window.open(url, '_blank');
  }
  render() {
    const { total, counts, health, intl, filename, helpButton } = this.props;
    const { formatMessage } = intl;
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
          total={total}
          data={counts}
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
  total: PropTypes.number,
  counts: PropTypes.array,
  // from parent
  collectionId: PropTypes.number.isRequired,
  filename: PropTypes.string,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSplitStoryCount.fetchStatus,
  total: state.sources.collections.selected.collectionSplitStoryCount.total,
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
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
        composeAsyncContainer(
          CollectionSplitStoryCountContainer
        )
      )
    )
  );
