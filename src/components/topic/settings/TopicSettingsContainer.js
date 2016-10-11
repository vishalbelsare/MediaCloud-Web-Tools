import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicPermissionsContainer from './TopicPermissionsContainer';
import BackLinkingControlBar from '../BackLinkingControlBar';

const localMessages = {
  mainTitle: { id: 'settings.mainTitle', defaultMessage: 'Topic Settings' },
  backToTopicLink: { id: 'settings.backToTopic.link', defaultMessage: 'back to Topic' },
};

const TopicSettingsContainer = (props) => {
  const { topicId } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  return (
    <div className="topic-settings">
      <Title render={titleHandler} />
      <BackLinkingControlBar message={localMessages.backToTopicLink} linkTo={`/topics/${topicId}/summary`} />
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
          </Col>
        </Row>
        <TopicPermissionsContainer topicId={topicId} />
      </Grid>
    </div>
  );
};

TopicSettingsContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from state
  topicId: React.PropTypes.number,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  topic: React.PropTypes.object.isRequired,
  topicInfo: state.topics.selected.info,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      TopicSettingsContainer
    )
  );
