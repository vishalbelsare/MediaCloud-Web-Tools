import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import DataCard from './DataCard';
import FilledStarIcon from './icons/FilledStarIcon';
import { ExploreButton } from './IconButton';

const localMessages = {
  total: { id: 'topic.list.totalStories', defaultMessage: 'Total Stories' },
  media: { id: 'topic.list.mediaCount', defaultMessage: 'Media Sources' },
  links: { id: 'topic.list.links', defaultMessage: 'Story Links' },
};

const TopicContentPreviewList = (props) => {
  const { items, icon, linkInfo, linkDisplay, disabled } = props;
  let content = null;
  let subContent = null;
  if (items && items.length > 0) {
    content = (
      items.map((c, idx) => {
        const isDisabled = disabled ? disabled(c) : false;
        const title = isDisabled ? (linkDisplay(c)) : (<Link to={linkInfo(c)}>{linkDisplay(c)}</Link>);
        const exploreButton = isDisabled ? null : (<ExploreButton linkTo={linkInfo(c)} />);
        if (c.detailInfo !== undefined && c.detailInfo.timespan !== undefined) {
          subContent = (
            <Row className="topic-mini-cards">
              <Col>
                <h3><FormattedMessage {...localMessages.total} /></h3>
                {c.detailInfo.timespan.story_count}
              </Col>
              <Col>
                <h3><FormattedMessage {...localMessages.media} /></h3>
                {c.detailInfo.timespan.medium_count}
              </Col>
              <Col>
                <h3><FormattedMessage {...localMessages.links} /></h3>
                {c.detailInfo.timespan.story_link_count}
              </Col>
            </Row>
          );
        }
        return (
          <Col key={idx} lg={4} xs={12}>
            <DataCard key={idx} className="" disabled={isDisabled}>
              {icon}
              <div className="content">
                <div>
                  <h2>{title}{ c.isFavorite ? <FilledStarIcon /> : '' }</h2>
                  <p>{c.description}</p>
                </div>
              </div>
              <div className="actions">
                {exploreButton}
              </div>
              {subContent}
            </DataCard>
          </Col>
        );
      })
    );
  }
  return (
    <div className="browse-list">
      <Row>
        {content}
      </Row>
    </div>
  );
};

TopicContentPreviewList.propTypes = {
  // from parent
  intro: React.PropTypes.string,
  icon: React.PropTypes.object,
  linkDisplay: React.PropTypes.func,
  linkInfo: React.PropTypes.func,
  items: React.PropTypes.array.isRequired,
  classStyle: React.PropTypes.string,
  helpButton: React.PropTypes.node,
  disabled: React.PropTypes.func,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};


export default
  injectIntl(
    connect(null)(
      TopicContentPreviewList
    )
  );
