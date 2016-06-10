import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

class CollectionInfoItem extends React.Component {
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
      <Grid>
          <Row>
            <h3>Related Tags: </h3>
            <Col xs={12} sm={6} md={3} lg={3}>
              <h3> {source.tags_id}</h3>
              <Link to={`sourcesummary/${source.tag_sets_id}/details`} style={styles.name}>{source.label}</Link>
            </Col>
          </Row>
        </Grid>
    );
  }
}

CollectionInfoItem.propTypes = {
  source: React.PropTypes.object.isRequired,
};


const CollectionInfo = (props) => {
  const { sources } = props;
  const sourceArray = Object.keys(sources).map((idx) => sources[idx]);
  return (
    <Row>
    {sourceArray.map(src =>
      <CollectionInfoItem key={src.tags_id} source={src} />
    )}
    </Row>
  );
};


CollectionInfo.propTypes = {
  sources: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(CollectionInfo);
