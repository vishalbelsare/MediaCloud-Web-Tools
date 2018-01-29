import PropTypes from 'prop-types';
import React from 'react';
import Title from 'react-title-component';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import TopicSearchContainer from './search/TopicSearchContainer';
import TopicListContainer from './list/TopicListContainer';
import LoginForm from '../user/LoginForm';
import TopicIcon from '../common/icons/TopicIcon';
import PublicTopicListContainer from './list/PublicTopicListContainer';
import DataCard from '../common/DataCard';
import { AddButton } from '../common/IconButton';
import messages from '../../resources/messages';

const localMessages = {
  homeTitle: { id: 'home.title', defaultMessage: 'Home' },
  publicHomeTitle: { id: 'home.title', defaultMessage: 'Explore Public Topics' },
  loginTitle: { id: 'sources.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const TopicsHomeContainer = (props) => {
  const { user } = props;
  const { formatMessage } = props.intl;
  const title = formatMessage(localMessages.homeTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  let content = null;
  if (user.isLoggedIn) {
    content = (
      <div>
        <Title render={titleHandler} />
        <div className="masthead">
          <h2><FormattedMessage {...messages.topicsToolName} /></h2>
          <p><FormattedMessage {...messages.topicsToolDescription} /></p>
          <h5><FormattedMessage {...messages.readGuide} /></h5>
        </div>
        <div className="controlbar">
          <div className="main">
            <Grid>
              <Row>
                <Col lg={8} className="left">
                  <Link to="topics/create">
                    <AddButton />
                    <FormattedMessage {...messages.createNewTopic} />
                  </Link>
                </Col>
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
  } else {
    content = (
      <div>
        <Title render={titleHandler} />
        <Grid>
          <Row>
            <Col lg={8} xs={12}>
              <h1><TopicIcon height={32} /><FormattedMessage {...localMessages.publicHomeTitle} /></h1>
            </Col>
          </Row>
          <Row>
            <Col lg={8} xs={12}>
              <PublicTopicListContainer />
            </Col>
            <Col lg={4} xs={12}>
              <DataCard>
                <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
                <LoginForm redirect="/home" />
              </DataCard>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  return content;
};

TopicsHomeContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from state
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  userTopicPermission: state.topics.selected.info.user_permission,
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      TopicsHomeContainer
    )
  );
