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
export const SOURCES_URL = 'https://sources.mediacloud.org/';
const BLOG_URL = 'https://mediacloud.org/news/';
const SUPPORT_URL = 'https://mediacloud.org/tools/';

const localMessages = {
  goHome: { id: 'nav.home', defaultMessage: 'Home' },
  support: { id: 'nav.support', defaultMessage: 'Support' },
  about: { id: 'nav.about', defaultMessage: 'About' },
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
          <Col lg={6}>
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
            </ul>
          </Col>
          <Col lg={5}>
            <ul className="right">
              <li className="recent-changes">
                <RecentNewsMenuContainer />
              </li>
              <li className="support">
                <a
                  href={SUPPORT_URL}
                  title={formatMessage(messages.toolsAppDescription)}
                >
                  {formatMessage(localMessages.support).toUpperCase()}
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
              <li className="about">
                <a href={`#/${formatMessage(localMessages.about)}`}>
                  {formatMessage(messages.menuAbout).toUpperCase()}
                </a>
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
