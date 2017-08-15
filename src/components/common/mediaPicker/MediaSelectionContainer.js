import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import { Row } from 'react-flexbox-grid/lib';
import { selectMediaPickerQueryArgs } from '../../../actions/systemActions';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED, STARRED } from '../../../lib/explorerUtil';
import SourceOrCollectionChip from '../SourceOrCollectionChip';
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
    const { selectedMediaQueryType, selectedMedia } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="select-media-menu">
        <Row>
          <Menu>
            <MenuItem
              className={selectedMediaQueryType === 0 ? 'select-media-menu-selected' : ''}
              value={0}
              primaryText={formatMessage(localMessages.pickCollections)}
              onTouchTap={() => this.updateMediaType(PICK_COLLECTION)}
            />
            <MenuItem
              className={selectedMediaQueryType === 1 ? 'select-media-menu-selected' : ''}
              value={1}
              primaryText={formatMessage(localMessages.pickSources)}
              onTouchTap={() => this.updateMediaType(PICK_SOURCE)}
            />
            <MenuItem
              primaryText={formatMessage(localMessages.pickAdvanced)}
              onTouchTap={() => this.updateMediaType(ADVANCED)}
            />
            <MenuItem
              primaryText={formatMessage(localMessages.pickStarred)}
              onTouchTap={() => this.updateMediaType(STARRED)}
            />
          </Menu>
        </Row>
        <Row>
          {selectedMedia.map(obj => (
            <SourceOrCollectionChip key={obj.tags_id || obj.media_id} object={obj} />
          ))}
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
  selectedMediaQueryType: React.PropTypes.number,
  updateMediaSelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  queries: state.explorer.queries,
  selectedMediaQueryType: state.system.mediaPicker.selectMediaQuery ? state.system.mediaPicker.selectMediaQuery.args.type : 0,
  sourcesResults: state.system.mediaPicker.media ? state.system.mediaPicker.media.results : null, // resutl of query?
  collectionsResults: state.system.mediaPicker.collections ? state.system.mediaPicker.collections.results : null,
  selectedMedia: state.system.mediaPicker.selectMedia.list,
  // formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});

const mapDispatchToProps = dispatch => ({
  updateMediaSelection: (type) => {
    if (type >= 0) {
      dispatch(selectMediaPickerQueryArgs({ type }));
    }
  },
});


export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      MediaSelectionContainer
    )
  );
