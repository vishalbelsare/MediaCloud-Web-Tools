import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import LoginForm from '../../user/LoginForm';
import SampleSearchContainer from './SampleSearchContainer';

const localMessages = {
  title: { id: 'explorer.intro.title', defaultMessage: 'Explorer' },
  about: { id: 'explorer.intro.about', defaultMessage: 'Explorer Text' },
  loginTitle: { id: 'explorer.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const Homepage = (props) => {
  const { user } = props;
  let sideBarContent;

  if (!user.isLoggedIn) {
    sideBarContent = (
      <DataCard>
        <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
        <LoginForm />
      </DataCard>
    );
  }
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <h1>
            <FormattedMessage {...localMessages.title} />
          </h1>
          <p>
            <FormattedHTMLMessage {...localMessages.about} />
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg={7} xs={12}>
          <SampleSearchContainer />
        </Col>
      </Row>
      {sideBarContent}
    </Grid>
  );
};

Homepage.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  // from state
  user: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      Homepage
    )
  );
