import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';

class TopicControlBar extends React.Component {
  getStyles() {
    const styles = {
      root: {
        backgroundColor: '#dddddd',
        marginBottom: 15,
      },
      controlBar: {
        paddingTop: 10,
        paddingBottom: 10,
      },
    };
    return styles;
  }
  render() {
    const { title } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Grid>
          <Row style={styles.controlBar}>
            <Col lg={3}>
              {title}
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

TopicControlBar.propTypes = {
  intl: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default injectIntl(TopicControlBar);
