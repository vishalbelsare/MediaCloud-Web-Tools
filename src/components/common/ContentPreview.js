import PropTypes from 'prop-types';
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
  intro: PropTypes.string,
  icon: PropTypes.object,
  linkDisplay: PropTypes.func,
  linkInfo: PropTypes.func,
  items: PropTypes.array.isRequired,
  classStyle: PropTypes.string,
  helpButton: PropTypes.node,
  disabled: PropTypes.func,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  contentType: PropTypes.string,
};


export default
  injectIntl(
    connect(null)(
      ContentPreview
    )
  );
