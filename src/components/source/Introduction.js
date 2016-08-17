import React from 'react';
import { Link } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../common/DataCard';

const localMessages = {
  title: { id: 'sources.intro.title', defaultMessage: 'Home' },
};

const Introduction = () => (
  <Grid>
    <Row>
      <Col lg={6} md={6} sm={12}>
        <DataCard>
          <h2>
            <FormattedMessage {...localMessages.title} />
          </h2>
          <p>Use the search bar above to search for things like:</p>
          <ul>
            <li>our coverage of the <Link to="/source/1/details">New York Times</Link></li>
            <li>the list of sources in our <Link to="/collection/8875027/details">US Mainstream Media Set</Link></li>
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
