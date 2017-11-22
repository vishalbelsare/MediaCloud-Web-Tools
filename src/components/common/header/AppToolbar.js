import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import UserMenuContainer from './UserMenuContainer';

export const TOPICS_URL = 'https://topics.mediacloud.org/';
export const EXPLORER_URL = 'https://explorer.mediacloud.org/';
export const DASHBOARD_URL = 'https://dashboard.mediacloud.org/';
export const SOURCES_URL = 'https://sources.mediacloud.org/';
export const BLOG_URL = 'http://mediacloud.org/';
export const TOOLS_URL = 'https://tools.mediacloud.org/';

const AppToolbar = (props) => {
  const { backgroundColor, drawer } = props;
  const { formatMessage } = props.intl;
  const styles = { backgroundColor };
  return (
    <div id="branding-toolbar" style={styles} >
      <Grid>
        <Row>
          <Col lg={10}>
            <ul>
              <li className="tools">
                <a
                  href={TOOLS_URL}
                  title={formatMessage(messages.toolsAppDescription)}
                >
                  <FormattedMessage {...messages.toolsAppName} />
                </a>
              </li>
              {
              /*
              <li className="explorer">
                <a
                  href={EXPLORER_URL}
                  title={formatMessage(messages.explorerToolDescription)}
                >
                  <FormattedMessage {...messages.explorerToolName} />
                </a>
              </li>
              */
              }
              <li className="dashboard">
                <a
                  href={DASHBOARD_URL}
                  title={formatMessage(messages.dashboardToolDescription)}
                >
                  <FormattedMessage {...messages.dashboardToolName} />
                </a>
              </li>
              <li className="topics">
                <a
                  href={TOPICS_URL}
                  title={formatMessage(messages.topicsToolDescription)}
                >
                  <FormattedMessage {...messages.topicsToolName} />
                </a>
              </li>
              <li className="sources">
                <a
                  href={SOURCES_URL}
                  title={formatMessage(messages.sourcesToolDescription)}
                >
                  <FormattedMessage {...messages.sourcesToolName} />
                </a>
              </li>
              <li className="blog">
                <a
                  href={BLOG_URL}
                  title={formatMessage(messages.blogToolDescription)}
                >
                  <FormattedMessage {...messages.blogToolName} />
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

AppToolbar.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  backgroundColor: PropTypes.string.isRequired,
  drawer: PropTypes.node,
};

export default
  injectIntl(
    AppToolbar
  );
