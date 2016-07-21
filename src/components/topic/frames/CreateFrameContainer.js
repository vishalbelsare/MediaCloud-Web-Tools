import React from 'react';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';

const CreateFrameContainer = (props) => {
  const { topicId } = props;
  return (
    <div>
      <h2>Add a new Frame</h2>
      <p>
      Working on topic {topicId}
      </p>
    </div>
  );
};

CreateFrameContainer.propTypes = {
  // from parent
  children: React.PropTypes.node.isRequired,
  // from context:
  topicId: React.PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
});

export default connect(
  mapStateToProps,
  null
)(CreateFrameContainer);
