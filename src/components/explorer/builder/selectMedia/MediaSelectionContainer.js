import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid/lib';
// import SourceOrCollectionChip from '../../../common/SourceOrCollectionChip';
import SelectMediaForm from './SelectMediaForm';
// import SelectedMediaContainer from './SelectedMediaContainer';
import { updateMediaSelectionQuery } from '../../../../actions/explorerActions';


class MediaSelectionContainer extends React.Component {
  updateMediaQuery(obj, values) {
    const { updateMediaSelection } = this.props;
    const updateObject = obj;
    const fieldName = obj.target ? obj.target.name : obj.name;
    const fieldValue = obj.target ? obj.target.value : obj.value;
    updateObject[fieldName] = values;
    updateMediaSelection(updateObject, fieldValue);
  }
  render() {
    /* const { selectedMedia } = this.props;
    // const { formatMessage } = this.props.intl;
    let selectedList = null;
    if (selectedMedia && selectedMedia.length > 0) {
      selectedList = selectedMedia.map(object => <SourceOrCollectionChip key={object.tags_id || object.media_id} object={object} />);
    } */
    return (
      <div className="explorer-select-media-dialog">
        <Row>
          <SelectMediaForm onSearch={() => this.updateMediaQuery} />
        </Row>
      </div>
    );
  }
}

MediaSelectionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  selectedMedia: React.PropTypes.array,
  updateMediaSelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  queries: state.explorer.queries,
  sourcesResults: state.explorer.sources.results ? state.explorer.sources.results : null,
  collectionsResults: state.explorer.collections.results ? state.explorer.collections.results : null,
  fetchStatus: state.explorer.collections.fetchStatus,
  // formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  updateMediaSelection: (values) => {
    if (values) {
      dispatch(updateMediaSelectionQuery(values, ownProps));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      MediaSelectionContainer
    )
  );
