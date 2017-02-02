import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import TopicSummaryContainer from './TopicSummaryContainer';

const PublicTopicSummaryContainer = () => (
// const { user } = props;
  <div>
    <div>loginbutton</div>
    <TopicSummaryContainer />
    <div>loginbutton</div>
  </div>
);

PublicTopicSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from state
  user: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      PublicTopicSummaryContainer
    )
  );
