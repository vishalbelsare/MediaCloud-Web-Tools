import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';
import TimespanSelectorContainer from './TimespanSelectorContainer';

class ControlBar extends React.Component {
  getStyles() {
    const styles = {
      root: {
        backgroundColor: '#f2f2f2',
        marginBottom: 15,
      },
      controlBar: {
      },
    };
    return styles;
  }
  render() {
    const { title, topicId } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Grid>
          <Row style={styles.controlBar}>
            <Col lg={3}>
              <b><Link to={`/topics/${topicId}`} style={styles.name}>{title}</Link></b>
            </Col>
            <Col lg={6}>
              <TimespanSelectorContainer />
            </Col>
            <Col lg={3}>
              <SnapshotSelectorContainer />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

ControlBar.propTypes = {
  intl: React.PropTypes.object.isRequired,
  title: React.PropTypes.string,
  topicId: React.PropTypes.number,
};

export default injectIntl(ControlBar);
