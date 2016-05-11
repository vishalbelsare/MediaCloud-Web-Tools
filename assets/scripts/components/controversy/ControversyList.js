import React from 'react';
import Paper from 'material-ui/Paper';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid/lib';

class ControversyListItem extends React.Component {
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
    const { controversy } = this.props;
    const styles = this.getStyles();
    return (
      <Col xs={12} sm={6} md={3} lg={3}>
        <Paper zDepth={1} rounded={false} style={styles.paper}>
          <Link to={`/controversy/${controversy.controversies_id}`} style={styles.name}>{controversy.name}</Link>
          <p style={styles.description}>{controversy.description}</p>
        </Paper>
      </Col>
    );
  }
}

ControversyListItem.propTypes = {
  controversy: React.PropTypes.object.isRequired,
};

const ControversyList = (props) => {
  const { controversies } = props;
  const controversiesArray = Object.keys(controversies).map((idx) => controversies[idx]);
  return (
    <Row>
    {controversiesArray.map(controversy =>
      <ControversyListItem key={controversy.controversies_id} controversy={controversy} />
    )}
    </Row>
  );
};

ControversyList.propTypes = {
  controversies: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(ControversyList);
