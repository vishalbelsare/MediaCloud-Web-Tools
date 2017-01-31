import React from 'react';
import Title from 'react-title-component';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl, FormattedMessage } from 'react-intl';
import DataCard from '../../common/DataCard';
import { ExploreButton } from '../../common/IconButton';

const localMessages = {
  mainTitle: { id: 'collection.popular.mainTitle', defaultMessage: 'Browse Collections' },
  intro: { id: 'collection.popular.intro', defaultMessage: 'Browse popular collections' },
};

const BrowseCollectionsContainer = (props) => {
  const { collections } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;

  let content = null;
  if (collections && collections.length > 0) {
    content = (
      collections.map((c, idx) =>
        <Col lg={3} md={3} xs={3}>
          <DataCard key={idx} style={{ width: 100 }}>
            <h3>{c.label}</h3>
            <p>{c.description}</p>
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

BrowseCollectionsContainer.propTypes = {
  collections: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(BrowseCollectionsContainer);
