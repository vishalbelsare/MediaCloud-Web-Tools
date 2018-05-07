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
  detailsSingular: { id: 'explorer.attention.drillDown.details', defaultMessage: 'Details about {date1}' },
  detailsRange: { id: 'explorer.attention.drillDown.details', defaultMessage: 'Details about {date1} to {date2}' },
  sampleStories: { id: 'explorer.attention.drillDown.sampleStories', defaultMessage: 'Sample Stories' },
  topWords: { id: 'explorer.attention.drillDown.topWords', defaultMessage: 'Top Words' },
};

const QueryAttentionOverTimeDrillDownDataCard = (props) => {
  const { stories, words, info } = props;
  const date1 = info ? info.start_date : '';
  const date2 = info ? info.end_date : '';
  const color = info ? info.color : '';
  const hexToRGBArray = clr => clr.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
  const rgbColor = color ? hexToRGBArray(color) : '#000000';
  const dateTitle = info.dayGap ? <h2><FormattedMessage {...localMessages.detailsSingular} values={{ date1 }} /></h2> : <h2><FormattedMessage {...localMessages.detailsRange} values={{ date1, date2 }} /></h2>;
  return (
    <DataCard>
      <Row>
        <Col lg={12}>
          {dateTitle}
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <h3 style={{ color }} ><FormattedMessage {...localMessages.sampleStories} /></h3>
          <StorySentencePreview stories={stories !== null && stories !== undefined ? Object.values(stories.slice(0, 8)) : []} />
        </Col>
        <Col lg={6}>
          <h3 style={{ color }} ><FormattedMessage {...localMessages.topWords} /></h3>
          <OrderedWordCloud words={words} textColor={`rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`} />
        </Col>
      </Row>
    </DataCard>
  );
};

QueryAttentionOverTimeDrillDownDataCard.propTypes = {
  // from parent
  stories: PropTypes.array,
  words: PropTypes.array,
  info: PropTypes.object,
  queries: PropTypes.array,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QueryAttentionOverTimeDrillDownDataCard
  );
