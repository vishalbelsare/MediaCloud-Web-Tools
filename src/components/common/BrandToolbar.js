import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';

const BrandToolbar = (props) => {
  const { backgroundColor } = props;
  const { formatMessage } = props.intl;
  const styles = { backgroundColor };
  return (
    <div id="branding-toolbar" style={styles} >
      <Grid>
        <Row>
          <Col lg={12}>
            <ul>
              <li className="dashboard">
                <a href="https://dashboard.mediameter.org/"
                  title={formatMessage(messages.dashboardToolDescription)}
                >
                  <FormattedMessage {...messages.dashboardToolShortName} />
                </a>
              </li>
              <li className="sources">
                <a href="https://sources.mediameter.org/"
                  title={formatMessage(messages.sourcesToolDescription)}
                >
                  <FormattedMessage {...messages.sourcesToolShortName} />
                </a>
              </li>
              <li className="topics">
                <a href="/"
                  title={formatMessage(messages.topicsToolDescription)}
                >
                  <FormattedMessage {...messages.topicsToolShortName} />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

BrandToolbar.propTypes = {
  backgroundColor: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(BrandToolbar);
