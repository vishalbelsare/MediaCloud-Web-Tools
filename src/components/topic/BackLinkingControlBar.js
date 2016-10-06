import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';

const BackLinkingControlBar = props => (
  <div className="controlbar back-linking-controlbar">
    <div className="main">
      <Grid>
        <Row>
          <Col lg={2} md={2} sm={12} className="left">
            <Link to={props.linkTo}>
              &larr; <FormattedMessage {...props.message} />
            </Link>
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

BackLinkingControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  linkTo: React.PropTypes.string.isRequired,
  message: React.PropTypes.object.isRequired,
};

export default injectIntl(BackLinkingControlBar);
