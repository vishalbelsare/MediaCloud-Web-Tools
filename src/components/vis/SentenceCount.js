import React from 'react';
import { injectIntl } from 'react-intl';
import AttentionOverTimeChart from './AttentionOverTimeChart';

const localMessages = {
  chartTitle: { id: 'sentenceCount.chartTitle', defaultMessage: 'Attention Over Time' },
  chartYAxisLabel: { id: 'sentenceCount.chartYAxisLabel', defaultMessage: 'sentences / day' },
  totalCount: { id: 'sentenceCount.total',
    defaultMessage: '{total, plural, =0 {No sentences} one {One sentence} other {{formattedTotal} sentences} }.',
  },
};

const SentenceCount = (props) => {
  const { counts, health } = props;
  const { formatMessage } = props.intl;
  return (
    <div>
      <AttentionOverTimeChart
        data={counts}
        height={250}
        title={formatMessage(localMessages.chartTitle)}
        yAxisLabel={formatMessage(localMessages.chartYAxisLabel)}
        health={health}
      />
    </div>
  );
};

SentenceCount.propTypes = {
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  health: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SentenceCount);
