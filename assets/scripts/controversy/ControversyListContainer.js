import React from 'react';
import Title from 'react-title-component';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';

import ErrorTryAgain from '../components/ErrorTryAgain';
import LoadingSpinner from '../components/LoadingSpinner';
import ControversyList from './ControversyList';
import { listControversies } from './controversyActions';
import { FETCH_SUCCEEDED, FETCH_FAILED } from './controversyReducers';

const messages = {
  controversiesListTitle: { id: 'controversies.list.title', defaultMessage: 'Controversies' },
  controversiesListSubTitle: { id: 'controversies.list.subtitle', defaultMessage: 'The first 20 public controversies' }
};

class ControversyListContainer extends React.Component {
  componentWillMount() {
    this.context.store.dispatch(listControversies());
  }
  getStyles() {
    const styles = {
      root: {
      }
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
    case FETCH_SUCCEEDED:
      content = <ControversyList controversies={controversies} />;
      break;
    case FETCH_FAILED:
      content = <ErrorTryAgain onTryAgain={onTryAgain} />;
      break;
    default:
      content = <LoadingSpinner />;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        <Card>
          <CardHeader title={title} subtitle={formatMessage(messages.controversiesListSubTitle)} />
            { content }
        </Card>
      </div>
    );
  }
}

ControversyListContainer.propTypes = {
  fetchState: React.PropTypes.string.isRequired,
  controversies: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
  onTryAgain: React.PropTypes.func.isRequired
};

ControversyListContainer.contextTypes = {
  store: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  fetchState: state.controversies.meta.fetchState,
  controversies: state.controversies.all
});

const mapDispatchToProps = function (dispatch) {
  return {
    onTryAgain: () => {
      dispatch(listControversies());
    }
  };
};

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControversyListContainer));
