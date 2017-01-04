import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppButton from '../../../common/AppButton';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchCollectionToCopy } from '../../../../actions/sourceActions';
import messages from '../../../../resources/messages';

const localMessages = {
  confirm: { id: 'collection.media.add.confirm',
    defaultMessage: 'The "{name}" collection has {count} collections.  Do you want to add all {count} of them?',
  },
};

class CollectionCopyConfirmer extends Component {

  componentWillReceiveProps(nextProps) {
    const { collectionId, fetchData } = this.props;
    if ((nextProps.collectionId !== collectionId)) {
      fetchData(nextProps.collectionId);
    }
  }

  render() {
    const { collection, onConfirm, onCancel } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="collection-copy-confirm">
        <p>
          <FormattedMessage
            {...localMessages.confirm}
            values={{ name: collection.label, count: collection.media.length }}
          />
        </p>
        <AppButton
          label={formatMessage(messages.cancel)}
          onClick={onCancel}
        />
        &nbsp; &nbsp;
        <AppButton
          label={formatMessage(messages.ok)}
          onClick={() => onConfirm(collection)}
          primary
        />
      </div>
    );
  }

}

CollectionCopyConfirmer.propTypes = {
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string,
  collection: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.form.toCopy.fetchStatus,
  collection: state.sources.collections.form.toCopy.results,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (collectionId) => {
    dispatch(fetchCollectionToCopy(collectionId));
  },
  asyncFetch: () => {
    if (ownProps.collectionId) {
      dispatch(fetchCollectionToCopy(ownProps.collectionId));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        CollectionCopyConfirmer
      )
    )
  );
