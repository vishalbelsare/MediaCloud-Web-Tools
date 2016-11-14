import React from 'react';
import { Link } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../common/DataCard';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Media Cloud Sources and Collections' },
  about: { id: 'sources.intro.about', defaultMessage: 'Use this website to explore the sources and collections that make up Media Cloud.  Every day we pull stories from than 50,000 online news sources into our database. Explore this site to see what sources and collections you can do research on. Explore the featured collections below, or use the search bar on the top right to look for a specific source.' },
};

const Introduction = () => (
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
      <Col lg={4} xs={12}>
        <DataCard>
          <h2>U.S. Media</h2>
          <p>Explore variety of curated collections full of U.S. media sources.</p>
          <ul>
            <li><Link to="/collections/8875027/details">Mainstream Media</Link></li>
            <li><Link to="/collections/2453107/details">Regional Media</Link></li>
            <li><Link to="/collections/9139487/details">Top Online</Link></li>
            <li><Link to="/collections/9139458/details">Top Digital Native</Link></li>
            <li><Link to="/collections/8875108/details">Political Blogs</Link></li>
            <li><Link to="/collections/8878293/details">Liberal Blogs</Link></li>
            <li><Link to="/collections/8878292/details">Conservative Blogs</Link></li>
            <li><Link to="/collections/8878294/details">Liberatarian Blogs</Link></li>
          </ul>
        </DataCard>
      </Col>
      <Col lg={4} xs={12}>
        <DataCard>
          <h2>Global Media</h2>
          <p>We have well-maintained collections for a variety of country-specific or global media.</p>
          <ul>
            <li><Link to="/collections/9201395/details">India (English media sources)</Link></li>
            <li><Link to="/collections/8877968/details">Brazil</Link></li>
            <li><Link to="/collections/9094533/details">Mexico</Link></li>
            <li><Link to="/collections/9173065/details">Nigeria</Link></li>
            <li><Link to="/collections/8876474/details">European Media Monitor</Link></li>
            <li><Link to="/collections/8876987/details">cited by Global Voices</Link></li>
          </ul>
        </DataCard>
      </Col>
      <Col lg={4} xs={12}>
        <DataCard>
          <h2>Topic Specific</h2>
          <p>For some topics we have created collections for sources that focus on them.</p>
          <ul>
            <li><Link to="/collections/8878332/details">Sexual Health and Reproductive Rights</Link></li>
          </ul>
        </DataCard>
      </Col>
    </Row>
  </Grid>
);

Introduction.propTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(Introduction);
