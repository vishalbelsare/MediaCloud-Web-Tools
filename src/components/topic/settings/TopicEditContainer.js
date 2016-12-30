import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
// import TopicDetailsForm from './TopicDetailsForm';
import { saveTopicDetails, fetchTopicSummary } from '../../../actions/topicActions';
import ComingSoon from '../../common/ComingSoon';

const localMessages = {
  title: { id: 'topic.edit.title', defaultMessage: 'Details' },
};

const TopicEditContainer = () => (
  <div className="topic-acl">
    <Row>
      <Col lg={12}>
        <h2><FormattedMessage {...localMessages.title} /></h2>
        <ComingSoon />
        {/* <TopicDetailsForm
          initialValues={{
            name: props.topic.name,
            description: props.topic.description,
            public: props.topic.public === 1,
          }}
          onSave={props.handleSave}
        />*/}
      </Col>
    </Row>
  </div>
);

TopicEditContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  // from state
  topic: React.PropTypes.object.isRequired,
  handleSave: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  topic: state.topics.selected.info,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSave: (values) => {
    dispatch(saveTopicDetails(ownProps.topicId,
      { name: values.name, description: values.description, public: values.public })
    ).then(() => {
      dispatch(fetchTopicSummary(ownProps.topicId));
    });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicEditContainer
    )
  );
