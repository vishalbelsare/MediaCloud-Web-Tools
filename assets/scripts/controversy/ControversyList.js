import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Paper from 'material-ui/lib/paper';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import ErrorTryAgain from '../components/ErrorTryAgain';
import LoadingSpinner from '../components/LoadingSpinner';
import { listControversies } from './controversyActions';
import { FETCH_NONE, FETCH_ONGOING, FETCH_SUCCEEDED, FETCH_FAILED } from './controversyReducers';

const messages = {
  controversyListTitle: { id: 'controversy.list.title', defaultMessage: 'Controversies' }
};

class ControversyList extends React.Component {
  render() {
    return <ul>{props.controversiesList.map(renderItem)}</ul>;
  }
  renderItem(){
    return <li>item</li>;
  }
};

class ControversyContainer extends React.Component {
  componentWillMount() {
    this.context.store.dispatch(listControversies());
  }
  getStyles() {
    const styles = {
      root: {
        width: 600
      }
    };
    return styles;
  }
  render() {
    const { controversies, fetchState, onTryAgain } = this.props;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(messages.controversyListTitle);
    const titleHandler = parentTitle => `${title} | ${parentTitle}`;
    let content = fetchState;
    const styles = this.getStyles();
    switch(fetchState){
      case FETCH_NONE:
      case FETCH_ONGOING:
        content = <LoadingSpinner />
        break;
      case FETCH_SUCCEEDED:
        content = <ControversyList controversies={controversies}/>
        break;
      case FETCH_FAILED:
        content = <ErrorTryAgain onTryAgain={onTryAgain}/>
        break;
    }
    return (
      <div style={styles.root}>
        <Title render={titleHandler} />
        <Card>
          <CardHeader title={title}/>
            { content }  
        </Card>
      </div>
    );
  }
};

ControversyContainer.propTypes = {
  fetchState: React.PropTypes.string.isRequired,
  controversies: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired
};

ControversyContainer.contextTypes = {
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
)(ControversyContainer));
