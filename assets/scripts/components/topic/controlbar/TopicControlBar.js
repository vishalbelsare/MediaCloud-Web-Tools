import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import SnapshotSelectorContainer from './SnapshotSelectorContainer';

class TopicControlBar extends React.Component {
  getStyles() {
    const styles = {
      root: {
        padding: 5,
        backgroundColor: '#dddddd',
      },
    };
    return styles;
  }
  render() {
    const { title } = this.props;
    const styles = this.getStyles();
    return (
      <div style={styles.root}>
        <Row>
          <Col lg={12}>
            {title}
            <SnapshotSelectorContainer />
          </Col>
        </Row>
      </div>
    );
  }
}

TopicControlBar.propTypes = {
  intl: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default injectIntl(TopicControlBar);
