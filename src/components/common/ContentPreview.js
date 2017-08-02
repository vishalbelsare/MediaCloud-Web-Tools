import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid/lib';
import SourceContentPreviewList from './SourceContentPreviewList';

const ContentPreview = (props) => {
  const { items, icon, linkInfo, linkDisplay, classStyle, disabled } = props;
  let content = null;
  if (items && items.length > 0) {
    content = <SourceContentPreviewList items={items} linkInfo={linkInfo} linkDisplay={linkDisplay} icon={icon} disabled={disabled} />;
  }
  return (
    <div className={`browse-list ${classStyle}`}>
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
