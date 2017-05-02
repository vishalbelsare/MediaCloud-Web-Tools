import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
// import KeywordStoryCountPreviewContainer from './KeywordStoryCountPreviewContainer';
import TopicAttentionPreview from './TopicAttentionPreview';
// import KeywordStoryPreviewContainer from './KeywordStoryPreviewContainer';


const TopicCreatePreview = (props) => {
  const { formData } = props;
  return (
    <div className="">
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicAttentionPreview keywords={formData} />
        </Col>
      </Row>
    </div>
  );
};

TopicCreatePreview.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  formData: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicCreatePreview
  );
