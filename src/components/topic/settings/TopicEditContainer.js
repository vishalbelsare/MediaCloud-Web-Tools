import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import ComingSoon from '../../common/ComingSoon';

const localMessages = {
  title: { id: 'topic.edit.title', defaultMessage: 'Details' },
  intro: { id: 'topic.edit.intro', defaultMessage: 'You can change some of the attributes of this Topic.' },
};

const TopicEditContainer = () => (
  <div className="topic-acl">
    <Row>
      <Col lg={12}>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <p><FormattedMessage {...localMessages.intro} /></p>
        <ComingSoon />
      </Col>
    </Row>
  </div>
);

TopicEditContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicEditContainer
    )
  );
