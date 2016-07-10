import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';

class SourceSearchResultItem extends React.Component {
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
    let content = <div />;
    content = (
      <Grid><Row><Col xs={12} sm={6} md={3} lg={3}>
        <h3>{ source.name }</h3>
        <Link to = {`source/${source.media_id}/details`} style={styles.name} > {source.label} </Link>
        </Col></Row>
      </Grid>
    );
    return (
      content
    );
  }
}

SourceSearchResultItem.propTypes = {
  source: React.PropTypes.object.isRequired,
};

const SourceSearchResult = (props) => {
  const { sources } = props;
  const sourceArray = Object.keys(sources.media_id).map((idx) => sources[idx]);
  return (
    <Grid>
      <h4>Matched Sources: </h4>
      <Row>
      {sourceArray.map(src =>
        <SourceSearchResultItem key={src.media_id} source={src} />
      )}
      </Row>
    </Grid>
  );
};


SourceSearchResult.propTypes = {
  sources: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(SourceSearchResult);
