import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import { fetchPopularCollectionList } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import ContentPreview from '../../common/ContentPreview';
import CollectionIcon from '../../common/icons/CollectionIcon';

const localMessages = {
  mainTitle: { id: 'collection.popular.mainTitle', defaultMessage: 'Popular Collections' },
};

const PopularCollectionsContainer = (props) => {
  const { collections } = props;
  let content = null;
  if (collections && collections.length > 0) {
    content = (
      <ContentPreview
        items={collections}
        classStyle="browse-items"
        itemType="collections"
        icon={<CollectionIcon height={25} />}
        linkInfo={c => `collections/${c.tags_id}`}
        linkDisplay={c => c.label}
      />
    );
  }
  return (
    <div>
      <h2>
        <FormattedMessage {...localMessages.mainTitle} />
      </h2>
      <Row>
        {content}
      </Row>
    </div>
  );
};

PopularCollectionsContainer.propTypes = {
  collections: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.popular.fetchStatus,
  collections: state.sources.collections.popular.list,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchPopularCollectionList());
  },
  asyncFetch: () => {
    dispatch(fetchPopularCollectionList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        PopularCollectionsContainer
      )
    )
  );
