import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import UserMenuContainer from './UserMenuContainer';
import SourcesAppMenu from './SourcesAppMenu';
import TopicsAppMenu from './TopicsAppMenu';
import ExplorerAppMenu from './ExplorerAppMenu';
import { assetUrl } from '../../../lib/assetUtil';
import RecentNewsMenuContainer from '../news/RecentNewsMenuContainer';

export const TOPICS_URL = 'https://topics.mediacloud.org/';
export const EXPLORER_URL = 'https://explorer.mediacloud.org/';
export const BLOG_URL = 'https://mediacloud.org/news/';
export const TOOLS_URL = 'https://mediacloud.org/tools/';

const localMessages = {
  goHome: { id: 'sources.menu.title', defaultMessage: 'Home' },
};

const goToHome = () => {
  window.location.href = '/#/home';
};

const NavToolbar = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div id="nav-toolbar">
      <Grid>
        <Row>
          <Col lg={11}>
            <a href={`#${formatMessage(localMessages.goHome)}`} onClick={goToHome}>
              <img
                className="app-logo"
                alt={formatMessage(messages.suiteName)}
                src={assetUrl('/static/img/mediacloud-logo-white-2x.png')}
                width={40}
                height={40}
              />
            </a>
            <ul>
              <li className="explorer">
                <ExplorerAppMenu />
              </li>
              <li className="topics">
                <TopicsAppMenu />
              </li>
              <li className="sources">
                <SourcesAppMenu />
              </li>
              <li className="blog">
                <a
                  href={BLOG_URL}
                  title={formatMessage(messages.blogToolDescription)}
                >
                  {formatMessage(messages.blogToolName).toUpperCase()}
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
              <li className="recent-changes">
                <RecentNewsMenuContainer />
              </li>
            </ul>
          </Col>
          <Col lg={1}>
            <UserMenuContainer />
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

NavToolbar.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    NavToolbar
  );
