import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import SourceSearchContainer from './SourceSearchContainer';

const localMessages = {
  addCollection: { id: 'source.controlbar.addCollection', defaultMessage: 'Create New Collection' },
  addSource: { id: 'source.controlbar.addSource', defaultMessage: 'Add New Source' },
};

const SourceControlBar = () => (
  <div className="controlbar controlbar-sources">
    <div className="main">
      <Grid>
        <Row>
          <Col lg={4} xs={4} className="left">
            <Link to="collections/createCollection">
              <FormattedMessage {...localMessages.addCollection} />
            </Link>
          </Col>
          <Col lg={4} xs={4} className="left">
            <Link to="sources/createSource">
              <FormattedMessage {...localMessages.addSource} />
            </Link>
          </Col>
          <Col lg={4} xs={12} className="right">
            <SourceSearchContainer />
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

SourceControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    SourceControlBar
  );

