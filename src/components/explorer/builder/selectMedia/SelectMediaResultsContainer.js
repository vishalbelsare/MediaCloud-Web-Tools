import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchMedia, selectMedia, updateMediaSelectionQuery } from '../../../../actions/explorerActions';
import ContentPreview from '../../../common/ContentPreview';
import CollectionIcon from '../../../common/icons/CollectionIcon';
import SelectMediaForm from './SelectMediaForm';

/*
const localMessages = {
  searchByName: { id: 'explorer.media.select.searchby.name', defaultMessage: 'Search by Name/URL' },
  searchByMetadata: { id: 'explorer.media.select.searchby.metadata', defaultMessage: 'Search by Metadata' },
  selectedMedia: { id: 'explorer.media.select.media', defaultMessage: 'Selected Media' },
  pubCountrySuggestion: { id: 'explorer.media.select.pubCountryTip', defaultMessage: 'published in' },
  pubStateSuggestion: { id: 'explorer.media.select.pubStateTip', defaultMessage: 'state published in' },
  pLanguageSuggestion: { id: 'explorer.media.select.pLanguageTip', defaultMessage: 'primary language' },
}; */

class SelectMediaResultsContainer extends React.Component {
  updateMediaQuery(obj, values) {
    const { updateMediaSelection } = this.props;
    const updateObject = obj;
    const fieldName = obj.target ? obj.target.name : obj.name;
    const fieldValue = obj.target ? obj.target.value : obj.value;
    updateObject[fieldName] = values;
    updateMediaSelection(updateObject, fieldValue);
  }
  render() {
    const { media } = this.props; // TODO differentiate betwee coll and src
    let content = null;
    if (media && media.length > 0) {
      content = (
        <ContentPreview
          items={media}
          classStyle="browse-items"
          itemType="media"
          icon={<CollectionIcon height={25} />}
          linkInfo={c => `media/${c.tags_id}`}
          linkDisplay={c => c.label}
        />
      );
    }
    return (
      <div className="select-media-container">
        <SelectMediaForm onSearch={() => this.updateMediaQuery} />
        <div>{content}</div>
      </div>
    );
  }
}

SelectMediaResultsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  queryArgs: React.PropTypes.object,
  handleSelection: React.PropTypes.func,
  media: React.PropTypes.array,
  updateMediaSelection: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.media.fetchStatus,
  media: state.explorer.media.collections,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateMediaSelection: (values) => {
    if (values) {
      dispatch(updateMediaSelectionQuery(values, ownProps));
    }
  },
  handleSelection: (values) => {
    if (values) {
      dispatch(selectMedia(values, ownProps));
    }
  },
  asyncFetch: () => {
    dispatch(fetchMedia(5)); // TODO make this a real search
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SelectMediaResultsContainer
      )
    )
  );

