import React from 'react';
import Paper from 'material-ui/Paper';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid/lib';

class TopicListItem extends React.Component {
  getStyles() {
    const styles = {
      paper: {
        padding: 8,
        minHeight: 200,
        marginTop: 20,
      },
      name: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
      },
      description: {
        fontSize: '0.8em',
      },
    };
    return styles;
  }
  render() {
    const { topic } = this.props;
    const styles = this.getStyles();
    return (
      <Col xs={12} sm={6} md={3} lg={3}>
        <Paper zDepth={1} rounded={false} style={styles.paper}>
          <Link to={`/topics/${topic.controversies_id}/summary`} style={styles.name}>{topic.name}</Link>
          <p style={styles.description}>{topic.description}</p>
        </Paper>
      </Col>
    );
  }
}

TopicListItem.propTypes = {
  topic: React.PropTypes.object.isRequired,
};

const TopicList = (props) => {
  const { topics } = props;
  return (
    <Row>
    {topics.map(topic =>
      <TopicListItem key={topic.controversies_id} topic={topic} />
    )}
    </Row>
  );
};

TopicList.propTypes = {
  topics: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(TopicList);
