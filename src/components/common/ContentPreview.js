import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid/lib';
import TopicContentPreviewList from './TopicContentPreviewList';
import SourceContentPreviewList from './SourceContentPreviewList';

const ContentPreview = (props) => {
  const { items, icon, linkInfo, linkDisplay, classStyle, disabled } = props;
  let content = null;
  if (items && items.length > 0) {
    if (classStyle === 'topic-list') {
      content = <TopicContentPreviewList items={items} linkInfo={linkInfo} linkDisplay={linkDisplay} />;
    } else {
      content = <SourceContentPreviewList items={items} linkInfo={linkInfo} linkDisplay={linkDisplay} icon={icon} disabled={disabled} />;
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
