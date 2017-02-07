import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import DataCard from '../../common/DataCard';
import { ExploreButton } from '../../common/IconButton';

const localMessages = {
  mainTitle: { id: 'collection.popular.mainTitle', defaultMessage: 'Browse Public Topics' },
};

const PublicTopics = (props) => {
  const { topics } = props;
  let content = null;
  if (topics && topics.length > 0) {
    content = (
      topics.map((c, idx) =>
        <Col key={idx} lg={4} md={4} xs={4}>
          <DataCard key={idx} className="public-topics">
            <div className="content">
              <div>
                <h2><Link to={`/topics/public/${c.topics_id}/summary`}>{c.name}</Link></h2>
                <p>{c.description}</p>
              </div>
            </div>
            <div className="actions">
              <ExploreButton linkTo={`/topics/public/${c.topics_id}/summary`} />
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

PublicTopics.propTypes = {
  topics: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    connect(null)(
      PublicTopics
    )
  );
