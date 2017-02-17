import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PublicTopicListContainer from './list/PublicTopicListContainer';
import DataCard from '../common/DataCard';
import LoginForm from '../user/LoginForm';
import TopicIcon from '../common/icons/TopicIcon';

const localMessages = {
  homeTitle: { id: 'home.title', defaultMessage: 'Explore Public Topics' },
  loginTitle: { id: 'sources.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const PublicHomeContainer = (props) => {
  const { formatMessage } = props.intl;
  const title = formatMessage(localMessages.homeTitle);
  const titleHandler = parentTitle => `${title} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={8} xs={12}>
            <h1><TopicIcon height={32} /><FormattedMessage {...localMessages.homeTitle} /></h1>
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
};

PublicHomeContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
};


export default
  injectIntl(
    PublicHomeContainer
  );
