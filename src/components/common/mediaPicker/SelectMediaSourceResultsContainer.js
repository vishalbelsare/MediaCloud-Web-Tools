import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { selectMediaPickerQueryArgs, fetchMediaPickerSources, resetMediaPickerSources } from '../../../actions/systemActions';
import messages from '../../../resources/messages';
import * as fetchConstants from '../../../lib/fetchConstants';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import MediaPickerWrapper from './MediaPickerWrapper';

const localMessages = {
  title: { id: 'system.mediaPicker.select.title', defaultMessage: 'title' },
  intro: { id: 'system.mediaPicker.select.info',
    defaultMessage: '<p>This is an intro</p>' },
  helpTitle: { id: 'system.mediaPicker.select.help.title', defaultMessage: 'About Media' },
};


class SelectMediaResultsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedMediaQueryKeyword !== this.props.selectedMediaQueryKeyword) {
      this.updateMediaQuery({ type: nextProps.selectedMediaQueryType, mediaKeyword: nextProps.selectedMediaQueryKeyword });
    }
  }
  componentWillUnmount() {
    resetMediaPickerSources();
  }
  updateMediaQuery(values) {
    const { updateMediaQuerySelection, selectedMediaQueryType } = this.props;
    const updatedQueryObj = Object.assign({}, values, { type: selectedMediaQueryType });
    updateMediaQuerySelection(updatedQueryObj);
  }

  render() {
    const { selectedMediaQueryKeyword, sourceResults } = this.props;
    let whichMedia = [];
    whichMedia.storedKeyword = { mediaKeyword: selectedMediaQueryKeyword };
    whichMedia.fetchStatus = null;
    if (sourceResults && (sourceResults.list && (sourceResults.list.length > 0 || (sourceResults.args && sourceResults.args.keyword)))) {
      whichMedia = sourceResults.list;
      whichMedia.storedKeyword = sourceResults.args;
      whichMedia.fetchStatus = sourceResults.fetchStatus;
      whichMedia.type = 'sources';
    }

    return <MediaPickerWrapper whichMedia={whichMedia} handleToggleAndSelectMedia={this.handleToggleAndSelectMedia} />;
  }
}

SelectMediaResultsContainer.propTypes = {
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
  updateMediaQuerySelection: React.PropTypes.func.isRequired,
  selectedMediaQueryKeyword: React.PropTypes.string,
  selectedMediaQueryType: React.PropTypes.number,
  sourceResults: React.PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.mediaPicker.sourceQueryResults.fetchStatus === fetchConstants.FETCH_SUCCEEDED ? fetchConstants.FETCH_SUCCEEDED : fetchConstants.FETCH_INVALID,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  selectedMediaQueryKeyword: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.mediaKeyword : null,
  sourceResults: state.system.mediaPicker.sourceQueryResults,
});

const mapDispatchToProps = dispatch => ({
  updateMediaQuerySelection: (values) => {
    if (values) {
      dispatch(selectMediaPickerQueryArgs(values));
      dispatch(fetchMediaPickerSources(values));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.intro, messages.mediaPickerHelpText])(
        SelectMediaResultsContainer
      )
    )
  );

