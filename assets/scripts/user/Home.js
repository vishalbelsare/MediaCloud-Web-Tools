import React from 'react';
import Title from 'react-title-component';
import {FormattedMessage} from 'react-intl';

import { connect } from 'react-redux';

const HomeContainer = (props) => {
  const titleHandler = parentTitle => `Home | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <h1><FormattedMessage id="home.title" defaultMessage="Home"/></h1>
      <p><FormattedMessage id="login.success" 
          defaultMessage={`You are logged in as {email}`} 
          values={{email: props.email}}/>
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

const Home = connect(
  mapStateToProps,
  null
)(HomeContainer);

export default Home;
