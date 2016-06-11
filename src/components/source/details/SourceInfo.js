import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

class SourceInfoItem extends React.Component {
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
              <h3> {source.tags_id}</h3>
              <Link to={`collection/${source.tags_id}/details`} style={styles.name}>{source.label}</Link>
            </Col>
          </Row>
      </Grid>
    );
  }
}

SourceInfoItem.propTypes = {
  source: React.PropTypes.object.isRequired,
};


const SourceInfo = (props) => {
  const { media_source_tags } = props.sources;
  const sourceArray = Object.keys(media_source_tags).map((idx) => media_source_tags[idx]);
  return (
    <Grid>
      <h4>Related Tags: </h4>
      <Row>
      {sourceArray.map(src =>
        <SourceInfoItem key={src.tags_id} source={src} />
      )}
      </Row>
    </Grid>
  );
};


SourceInfo.propTypes = {
  sources: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SourceInfo);
