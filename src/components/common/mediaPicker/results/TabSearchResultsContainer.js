import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-flexbox-grid/lib';
import CollectionResultsTable from './CollectionResultsTable';
import StarredSearchResultsContainer from './StarredSearchResultsContainer';
import MediaPickerSearchForm from '../MediaPickerSearchForm';
import { FETCH_ONGOING } from '../../../../lib/fetchConstants';
import LoadingSpinner from '../../../common/LoadingSpinner';
import TabSelector from '../../../common/TabSelector';

const localMessages = {
  title: { id: 'system.mediaPicker.collections.title', defaultMessage: 'Collections matching "{name}"' },
  hintText: { id: 'system.mediaPicker.collections.hint', defaultMessage: 'Search for collections by name' },
  noResults: { id: 'system.mediaPicker.collections.noResults', defaultMessage: 'No results. Try searching for issues like online news, health, blogs, conservative to see if we have collections made up of those types of sources.' },
  featured: { id: 'system.mediaPicker.collections.title', defaultMessage: 'featured' },
  favorited: { id: 'system.mediaPicker.collections.title', defaultMessage: 'favorited' },
};

const VIEW_FAVORITES = 0;
const VIEW_FEATURED = 1;

class TabSearchResultsContainer extends React.Component {
  state = {
    selectedViewIndex: VIEW_FAVORITES,
  };
  render() {
    const { selectedMediaQueryKeyword, queryResults, onSearch, handleToggleAndSelectMedia, fetchStatus, hintTextMsg } = this.props;
    const { formatMessage } = this.props.intl;
    const tabs = (
      <div className="media-picker-results-container">
        <Grid>
          <Row>
            <TabSelector
              tabLabels={[
                formatMessage(localMessages.favorited),
                formatMessage(localMessages.featured),
              ]}
              onViewSelected={index => this.setState({ selectedViewIndex: index })}
            />
          </Row>
        </Grid>
      </div>
    );
    let tabContent = null;
    if (fetchStatus === FETCH_ONGOING) {
      // we have to do this here to show a loading spinner when first searching (and featured collections are showing)
      tabContent = <LoadingSpinner />;
    } else if (this.state.selectedViewIndex === VIEW_FAVORITES &&
      queryResults && (queryResults.favoritedCollections || queryResults.favoritedSources)) {
      tabContent = (
        <div className="media-picker-tabbed-content-wrapper">
          <StarredSearchResultsContainer
            title={formatMessage(localMessages.title, { name: selectedMediaQueryKeyword })}
            collections={queryResults.featured.list}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        </div>
      );
    } else if (this.state.selectedViewIndex === VIEW_FEATURED &&
      queryResults && (queryResults.featured)) {
      tabContent = (
        <div className="media-picker-tabbed-content-wrapper">
          <CollectionResultsTable
            title={formatMessage(localMessages.title, { name: selectedMediaQueryKeyword })}
            collections={queryResults.featured.list}
            handleToggleAndSelectMedia={handleToggleAndSelectMedia}
          />
        </div>
      );
    } else {
      tabContent = <FormattedMessage {...localMessages.noResults} />;
    }
    return (
      <div>
        <MediaPickerSearchForm
          initValues={{ storedKeyword: { mediaKeyword: selectedMediaQueryKeyword } }}
          onSearch={val => onSearch(val)}
          hintText={formatMessage(hintTextMsg || localMessages.hintText)}
        />
        {tabs}
        {tabContent}
      </div>
    );
  }
}


TabSearchResultsContainer.propTypes = {
  // form compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  handleToggleAndSelectMedia: PropTypes.func.isRequired,
  whichTagSet: PropTypes.number,
  hintTextMsg: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  // from state
  selectedMediaQueryKeyword: PropTypes.string,
  selectedMediaQueryType: PropTypes.number,
  queryResults: PropTypes.object,
  initItems: PropTypes.object,
  fetchStatus: PropTypes.string,
};

export default
  injectIntl(
    connect()(
      TabSearchResultsContainer
    )
  );

