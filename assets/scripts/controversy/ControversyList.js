import React from 'react';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { listControversies } from './controversyActions'

const messages = {
  controversyListTitle: { id: 'controversy.list.title', defaultMessage: 'Controversies' }
};

class ControversyList extends React.Component {
  componentWillMount() {
    this.context.store.dispatch(listControversies());
  }
  render() {
    const { controversiesList, isFetching } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(messages.controversyListTitle)} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <h1><FormattedMessage {...messages.controversyListTitle} /></h1>
        <p>{isFetching}</p>
      </div>
    );
  }
}

ControversyList.propTypes = {
  isFetching: React.PropTypes.bool.isRequired,
  controversiesList: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired
};

ControversyList.contextTypes = {
  store: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  isFetching: state.controversies.meta.isFetching,
  controversiesList: state.controversies.all
});

export default injectIntl(connect(
  mapStateToProps,
  null
)(ControversyList));
