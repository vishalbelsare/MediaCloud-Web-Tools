import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import Link from 'react-router/lib/Link';
import DataCard from './DataCard';
import { ExploreButton } from './IconButton';
import TopicContentPreviewList from './TopicContentPreviewList';

const ContentPreview = (props) => {
  const { items, icon, linkInfo, linkDisplay, disabled, classStyle } = props;
  let content = null;
  if (items && items.length > 0) {
    if (classStyle === 'topic-list') {
      content = <TopicContentPreviewList items={items} linkInfo={linkInfo} linkDisplay={linkDisplay} />;
    } else {
      content = (
        items.map((c, idx) => {
          const isDisabled = disabled ? disabled(c) : false;
          const title = isDisabled ? (linkDisplay(c)) : (<Link to={linkInfo(c)}>{linkDisplay(c)}</Link>);
          const exploreButton = isDisabled ? null : (<ExploreButton linkTo={linkInfo(c)} />);
          return (
            <Col key={idx} lg={4} xs={12}>
              <DataCard key={idx} className="browse-items" disabled={isDisabled}>
                {icon}
                <div className="content">
                  <div>
                    <h2>{title}</h2>
                    <p>{c.description}</p>
                  </div>
                </div>
                <div className="actions">
                  {exploreButton}
                </div>
              </DataCard>
            </Col>
          );
        })
      );
    }
  }
  return (
    <div className="browse-list">
      <Row>
        {content}
      </Row>
    </div>
  );
};

ContentPreview.propTypes = {
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
  contentType: React.PropTypes.string,
};


export default
  injectIntl(
    connect(null)(
      ContentPreview
    )
  );
