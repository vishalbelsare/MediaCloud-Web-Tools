import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import UserMenuContainer from './UserMenuContainer';

export const TOPICS_URL = 'https://topics.mediacloud.org/';
export const EXPLORER_URL = 'https://explorer.mediacloud.org/';
export const SOURCES_URL = 'https://sources.mediacloud.org/';
export const BLOG_URL = 'https://mediacloud.org/news/';
export const TOOLS_URL = 'https://mediacloud.org/tools/';

const NavToolbar = (props) => {
  const { backgroundColor, drawer } = props;
  const { formatMessage } = props.intl;
  const styles = { backgroundColor };
  return (
    <div id="nav-toolbar" style={styles} >
      <Grid>
        <Row>
          <Col lg={10}>
            <ul>
              <li className="explorer">
                <a
                  href={EXPLORER_URL}
                  title={formatMessage(messages.explorerToolDescription)}
                >
                  {formatMessage(messages.explorerToolName).toUpperCase()}
                </a>
              </li>
              <li className="topics">
                <a
                  href={TOPICS_URL}
                  title={formatMessage(messages.topicsToolDescription)}
                >
                  {formatMessage(messages.topicsToolName).toUpperCase()}
                </a>
              </li>
              <li className="sources">
                <a
                  href={SOURCES_URL}
                  title={formatMessage(messages.sourcesToolDescription)}
                >
                  {formatMessage(messages.sourcesToolName).toUpperCase()}
                </a>
              </li>
              <li className="tools">
                <a
                  href={TOOLS_URL}
                  title={formatMessage(messages.toolsAppDescription)}
                >
                  {formatMessage(messages.toolsAppName).toUpperCase()}
                </a>
              </li>
              <li className="blog">
                <a
                  href={BLOG_URL}
                  title={formatMessage(messages.blogToolDescription)}
                >
                  {formatMessage(messages.blogToolName).toUpperCase()}
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

NavToolbar.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  backgroundColor: PropTypes.string.isRequired,
  drawer: PropTypes.node,
};

export default
  injectIntl(
    NavToolbar
  );
