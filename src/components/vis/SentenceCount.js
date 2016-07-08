import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import AttentionOverTimeChart from './AttentionOverTimeChart';

const localMessages = {
  chartTitle: { id: 'sentenceCount.chartTitle', defaultMessage: 'Attention Over Time' },
  chartYAxisLabel: { id: 'sentenceCount.chartYAxisLabel', defaultMessage: 'sentences / day' },
  totalCount: { id: 'sentenceCount.total',
    defaultMessage: '{total, plural, =0 {No sentences} one {One sentence} other {{formattedTotal} sentences} }.',
  },
};

class SentenceCount extends React.Component {

  getStyles() {
    const styles = {
      scrollWrapper: {
        overflow: 'scroll',
        height: 300,
        display: 'block',
      },
    };
    return styles;
  }

  render() {
    const { total, counts, health } = this.props;
    const { formatMessage } = this.props.intl;
    const styles = this.getStyles();
    return (
      <div style={styles.scrollWrapper}>
        <p>
        <FormattedMessage {...localMessages.totalCount}
          values={{ total, formattedTotal: (<FormattedNumber value={total} />) }}
        />
        </p>
        <AttentionOverTimeChart data={counts} height={250}
          title={ formatMessage(localMessages.chartTitle) }
          yAxisLabel={ formatMessage(localMessages.chartYAxisLabel) }
          health={ health }
        />
      </div>
    );
  }

}

SentenceCount.propTypes = {
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  health: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SentenceCount);
