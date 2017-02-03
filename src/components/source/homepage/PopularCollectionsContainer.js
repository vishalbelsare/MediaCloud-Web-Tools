import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';
import { fetchPopularCollectionList } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import { ExploreButton } from '../../common/IconButton';
import CollectionIcon from '../../common/icons/CollectionIcon';

const localMessages = {
  mainTitle: { id: 'collection.popular.mainTitle', defaultMessage: 'Popular Collections' },
};

const PopularCollectionsContainer = (props) => {
  const { collections } = props;
  let content = null;
  if (collections && collections.length > 0) {
    content = (
      collections.map((c, idx) =>
        <Col key={idx} lg={4} md={4} xs={4}>
          <DataCard key={idx} className="popular-collection">
            <CollectionIcon height={25} />
            <div className="content">
              <div>
                <h2><Link to={`/collections/${c.id}/summary`}>{c.label}</Link></h2>
                <p>{c.description}</p>
              </div>
            </div>
            <div className="actions">
              <ExploreButton linkTo={`/collections/${c.tags_id}`} />
            </div>
          </DataCard>
        </Col>
      )
    );
  }
  return (
    <div className="popular-collection-list">
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
