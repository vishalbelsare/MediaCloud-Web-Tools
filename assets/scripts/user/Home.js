import React from 'react';
import Title from 'react-title-component';

import { connect } from 'react-redux';

const HomeContainer = (props) => {
  const titleHandler = parentTitle => `Home | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <h1>Home</h1>
      <p>You are logged in as {props.email}</p>
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
