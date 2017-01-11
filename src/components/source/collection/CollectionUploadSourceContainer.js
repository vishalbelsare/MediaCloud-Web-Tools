import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { uploadSourceListFromTemplate, updateFeedback } from '../../../actions/sourceActions';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import CollectionUploadConfirmer from './form/CollectionUploadConfirmer';

const localMessages = {
  uploadSourcesFromTemplateTitle: { id: 'collections.upload.title', defaultMessage: 'Similar Collections' },
  helpTitle: { id: 'collection.upload.help.text.title',
    defaultMessage: 'Similar Collections',
  },
  helpText: { id: 'collection.upload.help.text',
    defaultMessage: 'Here is a list of similar collections, based on how many sources they have in common. This can be a great way to discover other collecitons you might want to be using. Click one to explore it.',
  },
  feedback: { id: 'collection.upload.feedback', defaultMessage: 'This upload was successful' },
};
class CollectionUploadSourceContainer extends React.Component {

  uploadCSV = () => {
    const { uploadCSVFile } = this.props;
    const fd = this.textInput.files[0];
    uploadCSVFile(fd);
  }
  render() {
    const { onConfirm, sources } = this.props;
    let confirmContent = null;
    if (sources.length > 0) {
      confirmContent = (
        <CollectionUploadConfirmer onConfirm={onConfirm} />
      );
    }
    return (
      <div>
        <input type="file" onChange={this.uploadCSV} ref={(input) => { this.textInput = input; }} />
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
  sources: React.PropTypes.array,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
  uploadCSVFile: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.form.toUpload.fetchStatus,
  sources: state.sources.collections.form.toUpload.list, // this will activate confirmation message and button
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  uploadCSVFile: (csvFile) => {
    dispatch(uploadSourceListFromTemplate({ file: csvFile }))
      .then(() => {
        // let them know it worked
        dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
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
