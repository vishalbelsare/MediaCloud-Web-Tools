import React from 'react';
import Title from 'react-title-component';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicSearchContainer from './search/TopicSearchContainer';
import TopicListContainer from './list/TopicListContainer';

const localMessages = {
  homeTitle: { id: 'home.title', defaultMessage: 'Home' },
};

class HomeContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    // make sure logout on home goes to public home
    const { redirectToPublicHome } = this.props;
    if (nextProps.isLoggedIn === false) {
      redirectToPublicHome();
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const title = formatMessage(localMessages.homeTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <div className="controlbar">
          <div className="main">
            <Grid>
              <Row>
                <Col lg={8} />
                <Col lg={4}>
                  <TopicSearchContainer />
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
        <Grid>
          <TopicListContainer />
        </Grid>
      </div>
    );
  }

}

HomeContainer.propTypes = {
  // from state
  isLoggedIn: React.PropTypes.bool.isRequired,
  // from dispatch
  redirectToPublicHome: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userTopicPermission: state.topics.selected.info.user_permission,
  isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  redirectToPublicHome: () => {
    dispatch(push('/topics/public/home'));
  },
});

HomeContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      HomeContainer
    )
  );
