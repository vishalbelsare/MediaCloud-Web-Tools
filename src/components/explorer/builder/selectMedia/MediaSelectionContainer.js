import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
// import SourceOrCollectionChip from '../../../common/SourceOrCollectionChip';
// import SelectedMediaContainer from './SelectedMediaContainer';

const localMessages = {
  pickCollections: { id: 'explorer.media.select.pickCollections', defaultMessage: 'Pick A Collection' },
  pickSources: { id: 'explorer.media.select.pickSources', defaultMessage: 'Pick A Source' },
  pickAdvanced: { id: 'explorer.media.select.pickAdvanced', defaultMessage: 'Advanced Selection' },
};

class MediaSelectionContainer extends React.Component {

  toggleCollections = () => {
    this.setState({ pickCollection: !this.state.pickCollection });
  };

  toggleSources = () => {
    this.setState({ pickCollection: !this.state.pickCollection });
  };

  toggleAdvanced = () => {
    this.setState({ pickCollection: !this.state.pickCollection });
  };
  render() {
    // const { selectedMedia } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="explorer-select-media-menu">
        <Menu>
          <MenuItem
            primaryText={formatMessage(localMessages.pickCollections)}
            onTouchTap={this.toggleCollections}
          />
          <MenuItem
            primaryText={formatMessage(localMessages.pickSources)}
            onTouchTap={this.toggleSources}
          />
          <MenuItem
            primaryText={formatMessage(localMessages.pickAdvanced)}
            onTouchTap={this.toggleAdvanced}
          />
        </Menu>
      </div>
    );
  }
}

MediaSelectionContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  selectedMedia: React.PropTypes.array,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  queries: state.explorer.queries,
  sourcesResults: state.explorer.sources.results ? state.explorer.sources.results : null,
  collectionsResults: state.explorer.collections.results ? state.explorer.collections.results : null,
  fetchStatus: state.explorer.collections.fetchStatus,
  // formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});


export default
  injectIntl(
    connect(mapStateToProps)(
      MediaSelectionContainer
    )
  );
