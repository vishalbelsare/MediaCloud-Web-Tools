import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'topic.summary.info.title',
    defaultMessage: 'About this Topic',
  },
  notSpidered: { id: 'topic.summary.info.notSpidered', defaultMessage: 'This Topic was not spidered. ' },
  spiderIterations: { id: 'topic.summary.info.spiderIterations',
    defaultMessage: 'It was spidered to collect stories over {iterations, plural, 0ne {iteration} other {{formattedTotal} iterations} } (out of {maxIterations, plural, 0ne {iteration} other {{formattedTotal} iterations} }). ',
  },
  processedWithBitly: { id: 'topic.processedWithBitly', defaultMessage: 'It does not include social click counts from Bit.ly' },
  notProcessedWithBitly: { id: 'topic.notProcessedWithBitly', defaultMessage: 'It includes social click counts from Bit.ly.' },
  seedQuery: { id: 'topic.seedQuery.description', defaultMessage: 'The seed query used to start this Topic was:<br/><code>{query}</code>.' },
  state: { id: 'topic.state.description', defaultMessage: 'This topic is <b>{state}</b>. ' },
};

const TopicInfo = (props) => {
  const { topic } = props;
  const { formatMessage } = props.intl;
  let spiderText = '';
  if (topic.has_been_spidered === 0) {
    spiderText = formatMessage(localMessages.notSpidered);
  } else {
    spiderText = formatMessage(localMessages.spiderIterations, {
      iterations: topic.num_iterations,
      maxIterations: topic.max_iterations,
      formattedTotal: topic.num_iterations,
    });
  }
  const bitlyMessage = (topic.process_with_bitly === '1') ? localMessages.processedWithBitly : localMessages.notProcessedWithBitly;
  return (
    <DataCard className="topic-info">
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <p>{topic.description}</p>
      <p>
        <FormattedHTMLMessage {...localMessages.state} values={{ state: topic.state }} />
        {spiderText}
        <FormattedMessage {...bitlyMessage} />
      </p>
      <p className="light seed-query">
        <FormattedHTMLMessage {...localMessages.seedQuery} values={{ query: topic.solr_seed_query }} />
      </p>
    </DataCard>
  );
};

TopicInfo.propTypes = {
  topic: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicInfo);
