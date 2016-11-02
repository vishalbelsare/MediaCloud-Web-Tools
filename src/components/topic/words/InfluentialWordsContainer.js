import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import WordsSummaryContainer from '../summary/WordsSummaryContainer';

const localMessages = {
  title: { id: 'topic.influentialWords.title', defaultMessage: 'Influential Words' },
};

const InfluentialWordsContainer = (props) => {
  const { topicId, filters } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
  return (
    <Grid>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Title render={titleHandler} />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <WordsSummaryContainer
            filters={filters}
            topicId={topicId}
            width={1100}
            height={400}
            maxFontSize={36}
            minFontSize={16}
          />
        </Col>
      </Row>
    </Grid>
  );
};

InfluentialWordsContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from state
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      InfluentialWordsContainer
    )
  );
