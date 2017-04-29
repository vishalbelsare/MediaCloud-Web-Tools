import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import AppButton from '../common/AppButton';

const localMessages = {
  workedTitle: { id: 'user.activated.worked.title', defaultMessage: 'Your Account is Activated' },
  workedInto: { id: 'user.activated.worked.intro', defaultMessage: 'Your Media Cloud account is now active!' },
  failedTitle: { id: 'user.activated.failed.title', defaultMessage: 'Invalid Activation' },
  loginNow: { id: 'user.activated.login', defaultMessage: 'Login to Media Cloud' },
};

const Activated = (props) => {
  const { formatMessage } = props.intl;
  const success = props.location.query.success === '1';
  const titleMsg = (success) ? localMessages.workedTitle : localMessages.failedTitle;
  const introText = (success) ? <FormattedMessage {...localMessages.workedInto} /> : props.location.query.msg;
  let callToAction = null;
  if (success) {
    callToAction = (
      <Link to="/login">
        <AppButton
          primary
          label={formatMessage(localMessages.loginNow)}
        />
      </Link>
    );
  }
  return (
    <div className="activation-feedback">
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...titleMsg} /></h1>
            <p>{introText}</p>
            {callToAction}
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

Activated.propTypes = {
  location: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(Activated);
