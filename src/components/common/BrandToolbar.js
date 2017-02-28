import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import UserMenuContainer from './UserMenuContainer';

const BrandToolbar = (props) => {
  const { backgroundColor, drawer } = props;
  const { formatMessage } = props.intl;
  const styles = { backgroundColor };
  return (
    <div id="branding-toolbar" style={styles} >
      <Grid>
        <Row>
          <Col lg={10}>
            <ul>
              <li className="dashboard">
                <a
                  href="https://dashboard.mediacloud.org/"
                  title={formatMessage(messages.dashboardToolDescription)}
                >
                  <FormattedMessage {...messages.dashboardToolShortName} />
                </a>
              </li>
              <li className="topics">
                <a
                  href="https://topics.mediacloud.org/"
                  title={formatMessage(messages.topicsToolDescription)}
                >
                  <FormattedMessage {...messages.topicsToolShortName} />
                </a>
              </li>
              <li className="sources">
                <a
                  href="https://sources.mediacloud.org/"
                  title={formatMessage(messages.sourcesToolDescription)}
                >
                  <FormattedMessage {...messages.sourcesToolShortName} />
                </a>
              </li>
              <li className="blog">
                <a
                  href="http://mediacloud.org/"
                  title={formatMessage(messages.blogToolDescription)}
                >
                  <FormattedMessage {...messages.blogToolShortName} />
                </a>
              </li>
            </ul>
          </Col>
          <Col lg={2}>
            <div className="actions">
              <UserMenuContainer />
              {drawer}
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

BrandToolbar.propTypes = {
  // from composition chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  backgroundColor: React.PropTypes.string.isRequired,
  drawer: React.PropTypes.node,
};

export default
  injectIntl(
    BrandToolbar
  );
