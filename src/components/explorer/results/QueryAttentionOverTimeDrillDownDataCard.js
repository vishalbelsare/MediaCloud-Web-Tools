import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import StorySentencePreview from '../../common/StorySentencePreview';
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
  let titleStyle = '';
  if (info.color) {
    titleStyle = { color: '#ff00ff' };
  } else {
    titleStyle = { color: '#0000ff' };
  }
  return (
    <DataCard>
      <Row>
        <h2><FormattedMessage {...localMessages.details} values={{ date }} /></h2>
        <Col lg={6}>
          <h3 style={{ titleStyle }} ><FormattedMessage {...localMessages.sampleStories} values={{ date }} style={{ titleStyle }} /></h3>
          <StorySentencePreview stories={stories !== null && stories !== undefined ? Object.values(stories) : []} />
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
