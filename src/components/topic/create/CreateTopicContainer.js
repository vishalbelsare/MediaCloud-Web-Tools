import React from 'react';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ComingSoon from '../../common/ComingSoon';

const localMessages = {
  createTopicTitle: { id: 'topic.create.title', defaultMessage: 'Create a New Topic' },
  createTopicText: { id: 'topic.create.text', defaultMessage: 'You can suggest a new Topic to add to the MediaCloud system.' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create Topic' },
};

const CreateTopicContainer = (props) => {
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Title render={formatMessage(localMessages.createTopicTitle)} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.createTopicTitle} /></h1>
          <p><FormattedMessage {...localMessages.createTopicText} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <ComingSoon />
        </Col>
      </Row>
    </Grid>
  );
};

CreateTopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
  onSubmitCreateTopicForm: () => {
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CreateTopicContainer
    )
  );
