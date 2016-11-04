import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SourceSearchContainer from './SourceSearchContainer';

const SourceControlBar = () => (
  <div className="controlbar controlbar-sources">
    <div className="main">
      <Grid>
        <Row>
          <Col sm={8} xs={0} />
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

