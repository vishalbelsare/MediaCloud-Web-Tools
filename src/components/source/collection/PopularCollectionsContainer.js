import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import DataCard from '../../common/DataCard';
import { fetchPopularCollectionList } from '../../../actions/sourceActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import { ExploreButton } from '../../common/IconButton';
import messages from '../../../resources/messages';

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
        <Col key={idx} lg={3} md={3} xs={3}>
          <DataCard key={idx} style={{ width: 100 }}>
            <h3>{c.label}</h3>
            <h4>{c.description}</h4>
            <FormattedMessage {...messages.explore} />
            <ExploreButton linkTo={`/collections/${c.tags_id}`} />
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
