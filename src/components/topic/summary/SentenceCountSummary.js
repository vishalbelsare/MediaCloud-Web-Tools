import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { getBrandDarkColor } from '../../../styles/colors';

const localMessages = {
  chartTitle: { id: 'topic.summary.sentenceCount.chartTitle', defaultMessage: 'Attention Over Time' },
  chartYAxisLabel: { id: 'topic.summary.sentenceCount.chartYAxisLabel', defaultMessage: 'sentences / day' },
  totalCount: { id: 'topic.summary.sentenceCount.total',
    defaultMessage: '{total, plural, =0 {No sentences} one {One sentence} other {{formattedTotal} sentences} }.',
  },
};

const SentenceCountSummary = (props) => {
  const { total, counts } = props;
  const { formatMessage } = props.intl;
  return (
    <div>
      <p>
      <FormattedMessage {...localMessages.totalCount}
        values={{ total, formattedTotal: (<FormattedNumber value={total} />) }}
      />
      </p>
      <AttentionOverTimeChart data={counts} height={254}
        yAxisLabel={ formatMessage(localMessages.chartYAxisLabel) }
        lineColor={ getBrandDarkColor() }
      />
    </div>
  );
};

SentenceCountSummary.propTypes = {
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SentenceCountSummary);
