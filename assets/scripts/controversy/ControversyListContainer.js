import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';

import ErrorTryAgain from '../components/ErrorTryAgain';
import LoadingSpinner from '../components/LoadingSpinner';
import ControversyList from './ControversyList';
import { fetchControversyList } from './controversyActions';
import { FETCH_CONTROVERSY_LIST_SUCCEEDED, FETCH_CONTROVERSY_LIST_FAILED } from './controversyReducers';

const messages = {
  controversiesListTitle: { id: 'controversies.list.title', defaultMessage: 'Recent Topics' },
};

class ControversyListContainer extends React.Component {
  componentWillMount() {
    this.context.store.dispatch(fetchControversyList());
  }
  getStyles() {
    const styles = {
      root: {
      },
    };
    return styles;
  }
  render() {
    const { controversies, fetchState, onTryAgain } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.controversiesListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchState;
    const styles = this.getStyles();
    switch (fetchState) {
      case FETCH_CONTROVERSY_LIST_SUCCEEDED:
        content = <ControversyList controversies={controversies} />;
        break;
      case FETCH_CONTROVERSY_LIST_FAILED:
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
  fetchState: React.PropTypes.string.isRequired,
  controversies: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
  onTryAgain: React.PropTypes.func.isRequired,
};

ControversyListContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fetchState: state.controversies.meta.fetchListState,
  controversies: state.controversies.all,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAgain: () => {
    dispatch(fetchControversyList());
  },
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyListContainer));
