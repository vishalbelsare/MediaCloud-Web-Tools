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
            <Col xs={12} sm={6} md={3} lg={3}>
              <Link to={`source/${source.id}/details`} style={styles.name}>{source.name}</Link>
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
  const { source } = props;
  const { media } = source;
  const sourceArray = Object.keys(media).map((idx) => media[idx]);
  return (
    <Grid>
      <h3>Sources within Collection: </h3>
      <Row>
      {sourceArray.map(src =>
        <CollectionInfoItem key={src.id} source={src} />
      )}
      </Row>
    </Grid>

  );
};


CollectionInfo.propTypes = {
  source: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(CollectionInfo);
