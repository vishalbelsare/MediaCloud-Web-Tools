import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchSimilarCollections } from '../../../actions/sourceActions';
import composeHelpfulContainer from '../../common/HelpfulContainer';
import CollectionList from '../../common/CollectionList';

const localMessages = {
  similarCollectionsTitle: { id: 'collections.similar.title', defaultMessage: 'Similar Collections' },
  helpTitle: { id: 'collection.summary.similar.help.text.title',
    defaultMessage: '<p>This list of collections has similar collections of sources.</p>',
  },
  helpText: { id: 'collection.summary.similar.help.text',
    defaultMessage: 'Click on a chip to view the details of the similar collection.</p>',
  },
};

class CollectionSimilarContainer extends React.Component {
  downloadCsv = () => {
    const { collectionId } = this.props;
    const url = `/api/collections/${collectionId}/similar/arewedoingthis.csv`;
    window.location = url;
  }
  render() {
    const { similarCollections, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <CollectionList
        title={formatMessage(localMessages.similarCollectionsTitle)}
        collections={similarCollections}
      />
    );
  }
}

CollectionSimilarContainer.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  total: React.PropTypes.number,
  // from parent
  collectionId: React.PropTypes.number.isRequired,
  similarCollections: React.PropTypes.array,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.selected.details.collectionDetailsReducer.collectionSimilar.fetchStatus,
  similarCollections: state.sources.selected.details.collectionDetailsReducer.collectionSimilar.list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchSimilarCollections(ownProps.collectionId));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeHelpfulContainer(localMessages.helpTitle, [localMessages.helpText])(
        composeAsyncContainer(
          CollectionSimilarContainer
        )
      )
    )
  );
