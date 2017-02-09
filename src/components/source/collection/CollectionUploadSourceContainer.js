import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { uploadSourceListFromTemplate } from '../../../actions/sourceActions';
import { updateFeedback } from '../../../actions/appActions';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import LoadingSpinner from '../../common/LoadingSpinner';
import CollectionUploadConfirmer from './form/CollectionUploadConfirmer';
import { DownloadButton } from '../../common/IconButton';

const localMessages = {
  uploadSourcesFromTemplateTitle: { id: 'collections.upload.title', defaultMessage: 'Sources From Template' },
  downloadEmpty: { id: 'collections.download.emptycsv', defaultMessage: 'Download a template in CSV format' },
  downloadFull: { id: 'collections.download.fullcsv', defaultMessage: 'Download current sources in CSV format' },
  helpTitle: { id: 'collection.upload.help.text.title',
    defaultMessage: 'Upload a Template of Sources',
  },
  helpText: { id: 'collection.upload.help.text',
    defaultMessage: 'Uploaded sources with a CSV template. You can download a template by clicking the Download button.',
  },
  feedback: { id: 'collection.upload.feedback', defaultMessage: 'This upload was successful' },
};
class CollectionUploadSourceContainer extends React.Component {

  downloadCsv = () => {
    const { myCollectionId } = this.props;
    let url = null;
    if (myCollectionId) {
      url = `/api/collections/${myCollectionId}/sources.csv?dType=1`;
    } else {
      url = '/api/template/sources.csv?dType=1';
    }
    window.location = url;
  }
  selectedCSV = () => {
    this.setState({ confirmTemplate: true });
  }

  confirmLoadCSV = () => {
    this.setState({ confirmTemplate: false });
  }

  uploadCSV = () => {
    const { uploadCSVFile } = this.props;
    const fd = this.textInput.files[0];
    uploadCSVFile(fd);
    this.selectedCSV();
  }
  render() {
    const { onConfirm, mysources, myCollectionId } = this.props;
    const { formatMessage } = this.props.intl;
    let confirmContent = null;
    if (mysources && mysources.length > 0 && this.state && this.state.confirmTemplate) {
      confirmContent = (
        <CollectionUploadConfirmer onConfirm={onConfirm} onCancel={this.confirmLoadCSV} onClickButton={this.confirmLoadCSV} />
      );
    } else if (this.state && this.state.confirmTemplate) {
      confirmContent = <LoadingSpinner />;
    }
    return (
      <div>
        <input type="file" onChange={this.uploadCSV} ref={(input) => { this.textInput = input; }} />
        <DownloadButton tooltip={mysources && mysources.length > 0 && myCollectionId != null ? formatMessage(localMessages.downloadFull) : formatMessage(localMessages.downloadEmpty)} onClick={this.downloadCsv} />
        { confirmContent }
      </div>
    );
  }
}

CollectionUploadSourceContainer.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  // from parent
  onConfirm: React.PropTypes.func.isRequired,
  mysources: React.PropTypes.array,
  myCollectionId: React.PropTypes.string,
  // from parent
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  uploadCSVFile: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.form.toUpload.fetchStatus,
  mysources: state.sources.collections.form.toUpload.list, // this will activate confirmation message and button
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadCSVFile: (csvFile) => {
    dispatch(uploadSourceListFromTemplate({ file: csvFile }))
      .then((results) => {
        if (results.status === 'Error') {
          updateFeedback({ open: true, message: ownProps.intl.formatMessage({ id: 'collection.upload.error', defaultMessage: results.message }) });
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
        }
      });
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText])(
        CollectionUploadSourceContainer
      )
    )
  );
