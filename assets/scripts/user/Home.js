import React from 'react';
import {connect} from 'react-redux';

const HomeContainer = React.createClass({
  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>You are logged in as {this.props.email}</p>
      </div>
    );
  }
});


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