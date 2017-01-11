import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppButton from '../../../common/AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  downloadTemplate: { id: 'collection.media.upload.downloadTemplate',
    defaultMessage: 'Download Template',
  },
  confirm: { id: 'collection.media.upload.downloadTemplate',
    defaultMessage: '{count} sources were added and/or updated successfully! Do you want to add them to this collection?',
  },
};

const CollectionUploadConfirmer = (props) => {
  const { sources, onConfirm, onCancel } = props;
  const { formatMessage } = props.intl;
  return (
    <div className="collection-copy-confirm">
      <p>
        <FormattedMessage
          {...localMessages.confirm}
          values={{ count: sources.length }}
        />
      </p>
      <AppButton
        label={formatMessage(messages.cancel)}
        onClick={onCancel}
      />
      &nbsp; &nbsp;
      <AppButton
        label={formatMessage(messages.ok)}
        onClick={() => onConfirm(sources)}
        primary
      />
    </div>
  );
};

CollectionUploadConfirmer.propTypes = {
  // from parent
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  // from state
  fetchStatus: React.PropTypes.string,
  sources: React.PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.form.toUpload.fetchStatus,
  sources: state.sources.collections.form.toUpload.list,
});

const mapDispatchToProps = () => ({
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      CollectionUploadConfirmer
    )
  );
