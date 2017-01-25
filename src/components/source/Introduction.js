import React from 'react';
import { Link } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SystemStatsContainer from './SystemStatsContainer';
import DataCard from '../common/DataCard';
import AppButton from '../common/AppButton';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Media Cloud Sources and Collections' },
  about: { id: 'sources.intro.about', defaultMessage: 'Use this website to explore the sources and collections that make up Media Cloud.  Every day we pull stories from more than 50,000 online news sources into our database. Explore this site to see what sources and collections you can do research on. Explore the featured collections below, or use the search bar on the top right to look for a specific source.' },
  browse: { id: 'sources.intro.browse', defaultMessage: 'Browse our Collections' },
  systemStatsTitle: { id: 'system.stats.title', defaultMessage: 'System Stats' },
};

const Introduction = props => (
  <Grid>

    <Row>
      <Col lg={8} xs={12}>
        <h1>
          <FormattedMessage {...localMessages.title} />
        </h1>
        <p><FormattedMessage {...localMessages.about} /></p>
      </Col>
    </Row>

    <Row>
      <Col lg={12}>
        <Link to="/collections/media-cloud">
          <AppButton label={props.intl.formatMessage(localMessages.browse)} primary />
        </Link>
      </Col>
    </Row>

    <Row>
      <Col lg={4} xs={12}>
        <DataCard>
          <h2>U.S. Media</h2>
          <p>Explore variety of curated collections full of U.S. media sources.</p>
          <ul>
            <li><Link to="/collections/8875027">Mainstream Media</Link></li>
            <li><Link to="/collections/2453107">Regional Media</Link></li>
            <li><Link to="/collections/9139487">Top Online</Link></li>
            <li><Link to="/collections/9139458">Top Digital Native</Link></li>
            <li><Link to="/collections/8875108">Political Blogs</Link></li>
            <li><Link to="/collections/8878293">Liberal Blogs</Link></li>
            <li><Link to="/collections/8878292">Conservative Blogs</Link></li>
            <li><Link to="/collections/8878294">Liberatarian Blogs</Link></li>
          </ul>
        </DataCard>
      </Col>
      <Col lg={4} xs={12}>
        <DataCard>
          <h2>Global Media</h2>
          <p>We have well-maintained collections for a variety of country-specific or global media.</p>
          <ul>
            <li><Link to="/collections/9201395">India (English media sources)</Link></li>
            <li><Link to="/collections/8877968">Brazil</Link></li>
            <li><Link to="/collections/9094533">Mexico</Link></li>
            <li><Link to="/collections/9173065">Nigeria</Link></li>
            <li><Link to="/collections/8876474">European Media Monitor</Link></li>
            <li><Link to="/collections/8876987">cited by Global Voices</Link></li>
          </ul>
        </DataCard>
      </Col>
      <Col lg={4} xs={12}>
        <DataCard>
          <h2>Topic Specific</h2>
          <p>For some topics we have created collections for sources that focus on them.</p>
          <ul>
            <li><Link to="/collections/8878332">Sexual Health and Reproductive Rights</Link></li>
          </ul>
        </DataCard>
      </Col>
    </Row>

    <Row>
      <Col lg={12}>
        <br />
        <br />
      </Col>
    </Row>

    <Row>
      <Col lg={12}>
        <h2><FormattedMessage {...localMessages.systemStatsTitle} /></h2>
      </Col>
    </Row>
    <SystemStatsContainer />

  </Grid>
);

Introduction.propTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(Introduction);
