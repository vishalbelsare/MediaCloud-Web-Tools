import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { fetchFeaturedCollectionList } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { ExploreButton } from '../../common/IconButton';
import CollectionIcon from '../../common/icons/CollectionIcon';

const localMessages = {
  mainTitle: { id: 'collection.popular.mainTitle', defaultMessage: 'Featured Collections' },
};

const FeaturedCollectionsContainer = (props) => {
  const { collections } = props;
  return (
    <div className="featured-collections-wrapper">
      <h2>
        <FormattedMessage {...localMessages.mainTitle} />
      </h2>
      <div className="featured-collections-list">
        <Row>
          {collections.map((c) => {
            const link = `collections/${c.tags_id}`;
            return (
              <Col key={c.tags_id} lg={4} xs={12}>
                <DataCard className="featured-collections-item">
                  <CollectionIcon height={25} />
                  <div className="content">
                    <div>
                      <h2><Link to={link}>{c.label}</Link></h2>
                      <p><i>{c.tag_set_label}</i></p>
                      <p>{c.description}</p>
                    </div>
                  </div>
                  <div className="actions">
                    <ExploreButton linkTo={link} />
                  </div>
                </DataCard>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

FeaturedCollectionsContainer.propTypes = {
  collections: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.featured.fetchStatus,
  collections: state.sources.collections.featured.list,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchFeaturedCollectionList());
  },
  asyncFetch: () => {
    dispatch(fetchFeaturedCollectionList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        FeaturedCollectionsContainer
      )
    )
  );
