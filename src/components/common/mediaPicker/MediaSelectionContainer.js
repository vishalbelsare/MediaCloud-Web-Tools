import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import { Row } from 'react-flexbox-grid/lib';
import { selectMediaPickerQueryArgs } from '../../../actions/explorerActions';
import { PICK_COLLECTION, PICK_SOURCE, ADVANCED, STARRED } from '../../../lib/explorerUtil';
// import SourceOrCollectionChip from '../../../common/SourceOrCollectionChip';
// import SelectedMediaContainer from './SelectedMediaContainer';

const localMessages = {
  pickCollections: { id: 'explorer.media.select.pickCollections', defaultMessage: 'Pick A Collection' },
  pickSources: { id: 'explorer.media.select.pickSources', defaultMessage: 'Pick A Source' },
  pickAdvanced: { id: 'explorer.media.select.pickAdvanced', defaultMessage: 'Advanced Selection' },
  pickStarred: { id: 'explorer.media.select.pickStarred', defaultMessage: 'Pick From Starred' },
};

class MediaSelectionContainer extends React.Component {

  updateMediaType = (type) => {
    const { updateMediaSelection } = this.props;
    updateMediaSelection(type);
  };
  render() {
    // const { selectedMedia } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="explorer-select-media-menu">
        <Row>
          <Menu>
            <MenuItem
              value={0}
              primaryText={formatMessage(localMessages.pickCollections)}
              onTouchTap={() => this.updateMediaType(PICK_COLLECTION)}
            />
            <MenuItem
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
  selectedMediaQuery: state.explorer.media.selectMediaQuery ? state.explorer.media.selectMediaQuery.type : null,
  sourcesResults: state.explorer.media.media ? state.explorer.media.media.results : null, // resutl of query?
  collectionsResults: state.explorer.media.collections ? state.explorer.media.collections.results : null,
  fetchStatus: state.explorer.collections.fetchStatus,
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
