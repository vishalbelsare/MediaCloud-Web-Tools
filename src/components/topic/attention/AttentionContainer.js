import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

const localMessages = {
  mainTitle: { id: 'attention.mainTitle', defaultMessage: 'Attention' },
};

const AttentionContainer = (props) => {
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2><FormattedMessage {...localMessages.mainTitle} /></h2>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

AttentionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from state
  timespan: React.PropTypes.object,
  filters: React.PropTypes.object.isRequired,
  topicId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      AttentionContainer
    )
  );
