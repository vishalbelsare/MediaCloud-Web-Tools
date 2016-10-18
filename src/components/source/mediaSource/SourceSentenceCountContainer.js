import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchSourceSentenceCount } from '../../../actions/sourceActions';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { getBrandDarkColor } from '../../../styles/colors';

import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  title: { id: 'sentenceCount.title', defaultMessage: 'Sentences Over Time' },
  helpTitle: { id: 'source.summary.sentenceCount.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'source.summary.sentenceCount.help.text',
    defaultMessage: '<p>This chart shows you the coverage of this Source across the world.</p>',
  },
};

class SourceSentenceCountContainer extends React.Component {
  downloadCsv = () => {
    const { sourceId } = this.props;
    const url = `/api/sources/${sourceId}/sentences/count.csv`;
    window.location = url;
  }
  render() {
    const { total, counts, health } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <AttentionOverTimeChart total={total} data={counts} health={health} height={250} lineColor={getBrandDarkColor()} />
      </DataCard>
    );
  }
}

SourceSentenceCountContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  // from parent
  sourceId: React.PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  health: React.PropTypes.array,
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.sourceDetailsReducer.sentenceCount.fetchStatus,
  total: state.sources.selected.details.sourceDetailsReducer.sentenceCount.total,
  counts: state.sources.selected.details.sourceDetailsReducer.sentenceCount.list,
  health: state.sources.selected.details.sourceDetailsReducer.sentenceCount.health,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSourceSentenceCount(ownProps.sourceId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText, messages.attentionChartHelpText])(
        composeAsyncContainer(
          SourceSentenceCountContainer
        )
      )
    )
  );
