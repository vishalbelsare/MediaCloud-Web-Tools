import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppButton from '../../../common/AppButton';
import messages from '../../../../resources/messages';

const localMessages = {
  downloadTemplate: { id: 'collection.media.upload.downloadTemplate',
    defaultMessage: 'Download Template',
  },
  confirm: { id: 'collection.media.upload.confirm',
    defaultMessage: 'We emailed you a summary of all the media sources we created or updated. {count} sources were added and/or updated successfully! Do you want to add them to this collection?',
  },
  error: { id: 'collection.media.upload.tooMany',
    defaultMessage: 'Limit exceeded: too many {count} sources to upload. You can add up to 300 sources at a time.',
  },
};

const CollectionUploadConfirmer = (props) => {
  const { sources, onConfirm, onCancel, onClickButton } = props;
  const { formatMessage } = props.intl;
  let message = null;
  if (sources.length > 300) {
    message = localMessages.error;
  } else {
    message = localMessages.confirm;
  }
  return (
    <div className="collection-copy-confirm">
      <p>
        <FormattedMessage
          {...message}
          values={{ count: sources.length }}
        />
      </p>
      <AppButton
        label={formatMessage(messages.cancel)}
        onClick={() => { onCancel(); onClickButton(); }}
      />
      &nbsp; &nbsp;
      <AppButton
        label={formatMessage(messages.ok)}
        onClick={() => { onConfirm(sources); onClickButton(); }}
        primary
      />
    </div>
  );
};

CollectionUploadConfirmer.propTypes = {
  // from parent
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onClickButton: React.PropTypes.func.isRequired,
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
