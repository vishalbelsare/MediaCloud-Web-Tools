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

const messages = {
  controversiesListTitle: { id: 'controversies.list.title', defaultMessage: 'Recent Topics' },
};

class ControversyListContainer extends React.Component {
  componentWillMount() {
    this.context.store.dispatch(fetchControversiesList());
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { controversies, fetchStatus, onTryAgain } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.controversiesListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchStatus;
    const styles = this.getStyles();
    switch (fetchStatus) {
      case fetchConstants.FETCH_SUCCEEDED:
        content = <ControversyList controversies={controversies} />;
        break;
      case fetchConstants.FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={onTryAgain} />;
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
  onTryAgain: React.PropTypes.func.isRequired,
};

ControversyListContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchStatus: state.controversies.all.fetchStatus,
  controversies: state.controversies.all.list,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAgain: () => {
    dispatch(fetchControversiesList());
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyListContainer));
