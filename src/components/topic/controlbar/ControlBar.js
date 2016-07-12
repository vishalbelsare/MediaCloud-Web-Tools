import React from 'react';
import { injectIntl } from 'react-intl';
import LinkWithFilters from '../LinkWithFilters';
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
      leftArea: {
        paddingTop: 18,
      },
      controlBar: {
      },
    };
    return styles;
  }
  render() {
    const { title, topicId, location } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Grid>
          <Row style={styles.controlBar}>
            <Col lg={3} md={3} sm={3} style={styles.leftArea}>
              <b><LinkWithFilters to={`/topics/${topicId}`} style={styles.name}>{title}</LinkWithFilters></b>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <TimespanSelectorContainer topicId={topicId} location={location} />
            </Col>
            <Col lg={3} md={3} sm={3}>
              <SnapshotSelectorContainer topicId={topicId} location={location} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

ControlBar.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  title: React.PropTypes.string,
  topicId: React.PropTypes.number,
  location: React.PropTypes.object.isRequired,
};

export default injectIntl(ControlBar);
