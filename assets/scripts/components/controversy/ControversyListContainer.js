import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';

import ErrorTryAgain from '../util/ErrorTryAgain';
import LoadingSpinner from '../util/LoadingSpinner';
import ControversyList from './ControversyList';
import { fetchControversiesList } from '../../actions/controversyActions';
import * as fetchConstants from '../../lib/fetchConstants.js';

const localMessages = {
  controversiesListTitle: { id: 'controversies.list.title', defaultMessage: 'Recent Topics' },
};

class ControversyListContainer extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { controversies, fetchStatus, fetchData } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(localMessages.controversiesListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <ControversyList controversies={controversies} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={fetchData} />;
        break;
      default:
        content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        <Row>
          <Col lg={12}>
            <h2>{title}</h2>
            {content}
          </Col>
        </Row>
      </div>
    );
  }
}

ControversyListContainer.propTypes = {
  fetchStatus: React.PropTypes.string.isRequired,
  controversies: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

ControversyListContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.all.fetchStatus,
  controversies: state.controversies.all.list,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: () => {
    dispatch(fetchControversiesList());
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyListContainer));
