import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { GridList, GridTile } from 'material-ui/GridList';
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
            <GridList
              cols={3}
              margin={0}
              padding={0}
              cellHeight={100}
              className="topic-mini-cards"
            >
              <GridTile margin={0}>
                <h3><FormattedMessage {...localMessages.total} /></h3>
                {c.detailInfo.timespan.story_count}
              </GridTile>
              <GridTile margin={0}>
                <h3><FormattedMessage {...localMessages.media} /></h3>
                {c.detailInfo.timespan.medium_count}
              </GridTile>
              <GridTile>
                <h3><FormattedMessage {...localMessages.links} /></h3>
                {c.detailInfo.timespan.story_link_count}
              </GridTile>
            </GridList>
          );
        }
        return (
          <Col key={idx} lg={4} xs={12}>
            <DataCard key={idx} className="topic-browse-items" disabled={isDisabled}>
              {icon}
              <div className="content">
                <div>
                  <h2>{title}
                    <div className="actions">
                      {exploreButton}
                    </div>
                    { c.isFavorite ? <FilledStarIcon /> : '' }
                  </h2>
                  <p>{c.description}</p>
                </div>
              </div>
              {subContent}
            </DataCard>
          </Col>
        );
      })
    );
  }
  return (
    <div className="">
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
