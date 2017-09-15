import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import { Grid, Row } from 'react-flexbox-grid/lib';
import { selectMediaPickerQueryArgs, toggleMedia, selectMedia } from '../../../actions/systemActions';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED, STARRED } from '../../../lib/explorerUtil';
import SourceOrCollectionWidget from '../SourceOrCollectionWidget';
// import SelectedMediaContainer from './SelectedMediaContainer';

const localMessages = {
  pickCollections: { id: 'system.mediaPicker.select.pickCollections', defaultMessage: 'Pick A Collection' },
  pickSources: { id: 'system.mediaPicker.select.pickSources', defaultMessage: 'Pick A Source' },
  pickAdvanced: { id: 'system.mediaPicker.select.pickAdvanced', defaultMessage: 'Advanced Selection' },
  pickStarred: { id: 'system.mediaPicker.select.pickStarred', defaultMessage: 'Pick From Starred' },
};

class MediaSelectionContainer extends React.Component {

  updateMediaType = (type) => {
    const { updateMediaSelection } = this.props;
    updateMediaSelection(type);
  };
  render() {
    const { selectedMediaQueryType, selectedMedia, handleToggleAndSelectMedia } = this.props;
    const { formatMessage } = this.props.intl;
    const content =
      selectedMedia.map((obj) => {
        const handleDelete = () => {
          handleToggleAndSelectMedia(obj);
        };
        return (<Grid><Row><SourceOrCollectionWidget key={obj.id || obj.tags_id || obj.media_id} object={obj} onDelete={handleDelete} /></Row></Grid>);
      });

    return (
      <div className="select-media-menu">
        <Menu style={{ zIndex: 'inherit', width: 200 }} >
          <MenuItem
            className={selectedMediaQueryType === 0 ? 'select-media-menu-selected' : ''}
            value={PICK_COLLECTION}
            primaryText={formatMessage(localMessages.pickCollections)}
            onTouchTap={() => this.updateMediaType(PICK_COLLECTION)}
          />
          <MenuItem
            className={selectedMediaQueryType === 1 ? 'select-media-menu-selected' : ''}
            value={PICK_SOURCE}
            primaryText={formatMessage(localMessages.pickSources)}
            onTouchTap={() => this.updateMediaType(PICK_SOURCE)}
          />
          <MenuItem
            primaryText={formatMessage(localMessages.pickAdvanced)}
            value={ADVANCED}
            onTouchTap={() => this.updateMediaType(ADVANCED)}
          />
          <MenuItem
            primaryText={formatMessage(localMessages.pickStarred)}
            value={STARRED}
            onTouchTap={() => this.updateMediaType(STARRED)}
          />
        </Menu>
        {content}
      </div>
    );
  }
}

MediaSelectionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  selectedMedia: React.PropTypes.array,
  selectedMediaQueryType: React.PropTypes.number,
  updateMediaSelection: React.PropTypes.func.isRequired,
  handleToggleAndSelectMedia: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  sourcesResults: state.system.mediaPicker.media ? state.system.mediaPicker.media.results : null, // resutl of query?
  collectionsResults: state.system.mediaPicker.collections ? state.system.mediaPicker.collections.results : null,
});

const mapDispatchToProps = dispatch => ({
  updateMediaSelection: (type) => {
    if (type >= 0) {
      dispatch(selectMediaPickerQueryArgs({ type }));
    }
  },
  handleToggleAndSelectMedia: (selectedMedia) => {
    if (selectedMedia) {
      dispatch(toggleMedia(selectedMedia));
      dispatch(selectMedia(selectedMedia)); // disable MediaPickerPreviewList button too
    }
  },
});


export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      MediaSelectionContainer
    )
  );
