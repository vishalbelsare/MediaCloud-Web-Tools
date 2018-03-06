import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import StoryTable from '../../common/StoryTable';
import OrderedWordCloud from '../../vis/OrderedWordCloud';

const localMessages = {
  attention: { id: 'explorer.results.attention.title', defaultMessage: 'Attention' },
  language: { id: 'explorer.results.language.title', defaultMessage: 'Language' },
  people: { id: 'explorer.results.people.title', defaultMessage: 'People & Places' },
  details: { id: 'explorer.attention.drillDown.details', defaultMessage: 'Here are some details about what was reported on for {date}' },
  sampleStories: { id: 'explorer.attention.drillDown.sampleStories', defaultMessage: 'Sample Stories for {date}' },
  topWords: { id: 'explorer.attention.drillDown.topWords', defaultMessage: 'Top Words for {date}' },
};

const QueryAttentionOverTimeDrillDownDataCard = (props) => {
  const { stories, words, info } = props;
  const date = info.start_date;
  return (
    <DataCard>
      <Row>
        <h2><FormattedMessage {...localMessages.details} values={{ date }} /></h2>
        <Col lg={6}>
          <h3><FormattedMessage {...localMessages.sampleStories} values={{ date }} /></h3>
          <StoryTable stories={stories !== null && stories !== undefined ? Object.values(stories) : []} />
        </Col>
        <Col lg={6}>
          <h3><FormattedMessage {...localMessages.topWords} values={{ date }} /></h3>
          <OrderedWordCloud words={words} />
        </Col>
      </Row>
    </DataCard>
  );
};

QueryAttentionOverTimeDrillDownDataCard.propTypes = {
  // from parent
  stories: PropTypes.object,
  words: PropTypes.array,
  info: PropTypes.object,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QueryAttentionOverTimeDrillDownDataCard
  );
