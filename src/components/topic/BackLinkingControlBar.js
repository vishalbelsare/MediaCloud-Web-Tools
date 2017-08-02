import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';

const BackLinkingControlBar = props => (
  <div className="controlbar back-linking-controlbar">
    <div className="main">
      <Grid>
        <Row>
          <Col lg={2} md={2} xs={12} className="left">
            <Link to={props.linkTo}>
              &larr; <FormattedMessage {...props.message} />
            </Link>
          </Col>
          <Col lg={8} md={8} xs={12}>
            {props.children}
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
  children: React.PropTypes.node,
};

export default injectIntl(BackLinkingControlBar);
