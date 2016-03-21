import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';

import { connect } from 'react-redux';

const messages = {
  homeTitle: { id:"home.title", defaultMessage:"Home" },
  homeDetails: { id:"home.details", defaultMessage:"You are logged in as {email}" }
};

const HomeContainer = (props) => {
  const {formatMessage} = props.intl;
  const titleHandler = parentTitle => `${formatMessage(messages.homeTitle)} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <h1><FormattedMessage {...messages.homeTitle}/></h1>
      <p><FormattedMessage {...messages.homeDetails} values={{email: props.email}}/>
      </p>
    </div>
  );
};

HomeContainer.propTypes = {
  email: React.PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  email: state.user.email
});

export default injectIntl( connect(
  mapStateToProps,
  null
)(HomeContainer) );
