import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import TopicSummaryContainer from './TopicSummaryContainer';
import AppButton from '../../common/AppButton';

const localMessages = {
  login: { id: 'topic.login', defaultMessage: 'Log in or Register Now!' },
};

const PublicTopicSummaryContainer = (props) => {
  const { handleButtonClick } = props;
  const { formatMessage } = props.intl;
  return (
    <div className="publicTopicSummary">
      <div>
        <br />
        <AppButton
          flat
          label={formatMessage(localMessages.login)}
          onClick={() => { handleButtonClick('/home'); }}
          toolTip={formatMessage(localMessages.login)}
        />
      </div>
      <div>
        <TopicSummaryContainer />
      </div>
      <div style={{ textAlign: 'center' }}>
        <br />
        <AppButton
          flat
          label={formatMessage(localMessages.login)}
          onClick={() => { handleButtonClick('/home'); }}
          toolTip={formatMessage(localMessages.login)}
        />
      </div>
    </div>
  );
};

PublicTopicSummaryContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from state
  user: React.PropTypes.object.isRequired,
  handleButtonClick: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  handleButtonClick: (path) => {
    dispatch(push(path));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      PublicTopicSummaryContainer
    )
  );
