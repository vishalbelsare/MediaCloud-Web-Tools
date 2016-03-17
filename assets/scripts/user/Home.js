import React from 'react';
import {connect} from 'react-redux';

function HomeContainer(email) {
  return (
  	<div>
  	<h1>Home</h1>
  	<p>You are logged in as {email}</p>
  	</div>
  );
}

const mapStateToProps = (state) => {
  return {
    email: state.user.email
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

let Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeContainer);

export default Home;