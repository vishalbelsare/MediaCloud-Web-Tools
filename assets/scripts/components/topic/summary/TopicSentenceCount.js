import React from 'react';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';

const localMessages = {
  totalCount: { id: 'topic.summary.sentenceCount.total',
    defaultMessage: '{total, plural, =0 {No sentences} one {One sentence} other {{formattedTotal} sentences} }.',
  },
};

class TopicSentenceCount extends React.Component {

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
    const { total, counts } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.scrollWrapper}>
        <p>
        <FormattedMessage {...localMessages.totalCount}
          values={{ total, formattedTotal: (<FormattedNumber value={total} />) }}
        />
        </p>
      </div>
    );
  }

}

TopicSentenceCount.propTypes = {
  total: React.PropTypes.number,
  counts: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicSentenceCount);
