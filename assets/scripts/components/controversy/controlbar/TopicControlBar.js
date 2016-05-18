import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';

class TopicControlBar extends React.Component {
  getStyles() {
    const styles = {
      root: {
        height: 50,
        backgroundColor: '#dddddd',
      },
    };
    return styles;
  }
  render() {
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Row>
          <Col lg={12}>
            <SnapshotSelectorContainer />
          </Col>
        </Row>
      </div>
    );
  }
}

TopicControlBar.propTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicControlBar);
