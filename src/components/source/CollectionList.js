import React from 'react';
import Paper from 'material-ui/Paper';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid/lib';

class CollectionListItem extends React.Component {
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
    const { source } = this.props;
    const styles = this.getStyles();
    return (
      <Col xs={12} sm={6} md={3} lg={3}>
        <Paper zDepth={1} rounded={false} style={styles.paper}>
          <Link to={`/collection/${source.tags_id}/details`} style={styles.name}>{source.label}</Link>
          <p style={styles.description}>Tag Id: {source.tags_id}</p>
          <p style={styles.description}>Tag Description{source.description}</p>
          <p style={styles.description}>Tag Sets Id: {source.tag_sets_id}</p>
          <p style={styles.description}>Tag Set Description{source.tag_set_description}</p>
        </Paper>
      </Col>
    );
  }
}

CollectionListItem.propTypes = {
  source: React.PropTypes.object.isRequired,
};

const CollectionList = (props) => {
  const { sources } = props;
  const sourceArray = Object.keys(sources).map((idx) => sources[idx]);
  return (
    <Row>
    {sourceArray.map(source =>
      <CollectionListItem key={source.tags_id} source={source} />
    )}
    </Row>
  );
};

CollectionList.propTypes = {
  sources: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(CollectionList);
