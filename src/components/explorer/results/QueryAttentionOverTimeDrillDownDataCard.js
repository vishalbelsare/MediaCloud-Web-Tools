import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';


const localMessages = {
  attention: { id: 'explorer.results.attention.title', defaultMessage: 'Attention' },
  language: { id: 'explorer.results.language.title', defaultMessage: 'Language' },
  people: { id: 'explorer.results.people.title', defaultMessage: 'People & Places' },
};

class QueryAttentionOverTimeDrillDownDataCard extends React.Component {

  render() {

    return (
      <DataCard>
        <Row>
          <FormattedMessage {...localMessages.details} values={{ date: date }} />
          <Col lg={6}>
            <h3><FormattedMessage {...localMessages.sampleStories} values={{ date: date }} /></h3>
            {StoryTable}
          </Col>
          <Col lg={6}>
            <h3><FormattedMessage {...localMessages.topWords} values={{ date: date }} /></h3>
            <OrderedWordCloud />
          </Col>
        </Row>
      </DataCard>
    );
  }
}

QueryAttentionOverTimeDrillDownDataCard.propTypes = {
  // from parent
  options: PropTypes.array,
  onViewSelected: PropTypes.func,
  dateRange: PropTypes.object,
  queryInfo: PropTypes.object,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    QueryAttentionOverTimeDrillDownDataCard
  );
