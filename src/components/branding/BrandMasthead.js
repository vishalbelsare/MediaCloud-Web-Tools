import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';

const BrandMasthead = (props) => {
  const { name, description, backgroundColor } = props;
  const styles = { backgroundColor };
  return (
    <div className="branding-masthead" style={styles} >
      <Grid>
        <Row>
          <Col lg={8}>
            <h1>
              <a href="https://topics.mediameter.org"><img src={'/static/mm-logo-blue-2x.png'} width={65} height={65} /></a>
              <strong><FormattedMessage {...messages.suiteName} /></strong>
              &nbsp; {name}
            </h1>
          </Col>
          <Col lg={4}>
            <small>{description}</small>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

BrandMasthead.propTypes = {
  name: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  backgroundColor: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(BrandMasthead);
