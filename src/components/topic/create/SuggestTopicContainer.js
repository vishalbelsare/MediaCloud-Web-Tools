import React from 'react';
import { push } from 'react-router-redux';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SuggestTopicForm from './SuggestTopicForm';
import { updateFeedback } from '../../../actions/appActions';
import { suggestTopic } from '../../../actions/topicActions';

const localMessages = {
  suggestTopicTitle: { id: 'topic.suggest.title', defaultMessage: 'Suggest a New Topic' },
  suggestTopicText: { id: 'topic.suggest.text', defaultMessage: 'You can auggest a new Topic to add to the MediaCloud system.' },
  suggest: { id: 'topic.suggest', defaultMessage: 'Suggest Topic' },
};

const SuggestTopicContainer = (props) => {
  const { handleSuggestion } = props;
  const { formatMessage } = props.intl;
  return (
    <Grid>
      <Title render={formatMessage(localMessages.suggestTopicTitle)} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.suggestTopicTitle} /></h1>
          <p><FormattedMessage {...localMessages.suggestTopicText} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <SuggestTopicForm onSaveSuggestion={handleSuggestion} initialValues={{ spidered: true }} />
        </Col>
      </Row>
    </Grid>
  );
};

SuggestTopicContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  handleSuggestion: React.PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleSuggestion: (values) => {
    dispatch(suggestTopic(values)).then(() => {
      dispatch(push('/home'));
      dispatch(updateFeedback({ open: true, message: ' We\'ll fire fire off an email asking our back-end team to review your suggestion.' }));
    });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SuggestTopicContainer
    )
  );
