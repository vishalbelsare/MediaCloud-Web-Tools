import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import FontIcon from 'material-ui/FontIcon';

const TopicWarning = props => (
  <div className="topic-warning">
    <Grid>
      <Row>
        <Col lg={12}>
          <FontIcon className="material-icons" color={'#000000'}>warning</FontIcon>
          {props.children}
        </Col>
      </Row>
    </Grid>
  </div>
);

TopicWarning.propTypes = {
  children: React.PropTypes.node.isRequired,
};

export default TopicWarning;
