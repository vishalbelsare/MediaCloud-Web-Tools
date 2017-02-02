import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';
import { fetchPopularCollectionList } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import { ExploreButton } from '../../common/IconButton';
import CollectionIcon from '../../common/icons/CollectionIcon';

const localMessages = {
  mainTitle: { id: 'collection.popular.mainTitle', defaultMessage: 'Browse by Category' },
  intro: { id: 'collection.popular.intro', defaultMessage: 'Browse popular collections' },
};

const PopularCollectionsContainer = (props) => {
  const { collections } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;

  let content = null;
  if (collections && collections.length > 0) {
    content = (
      collections.map((c, idx) =>
        <Col key={idx} lg={4} md={4} xs={4}>
          <DataCard key={idx} style={{ width: 100 }}>
            <CollectionIcon height={25} />
            <h3><Link to={`/collections/${c.id}/summary`}>{c.label}</Link></h3>
            <h4>{c.description}</h4>
            <div className="source-home-explore">
              <ExploreButton linkTo={`/collections/${c.tags_id}`} />
            </div>
          </DataCard>
        </Col>
      )
    );
  }

  return (
    <Grid>
      <Title render={titleHandler} />
      <h2>
        <FormattedMessage {...localMessages.mainTitle} />
      </h2>
      <Row>
        {content}
      </Row>
    </Grid>
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
