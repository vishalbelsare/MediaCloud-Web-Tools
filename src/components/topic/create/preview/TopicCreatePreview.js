import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import TopicStoryCountPreview from './TopicStoryCountPreview';
import TopicAttentionPreview from './TopicAttentionPreview';
import TopicStorySamplePreview from './TopicStorySamplePreview';
import TopicWordsPreview from './TopicWordsPreview';

const TopicCreatePreview = (props) => {
  const { formData } = props;

  return (
    <div className="">
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicStoryCountPreview query={formData} />
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicAttentionPreview query={formData} />
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicWordsPreview query={formData} />
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicStorySamplePreview query={formData} />
        </Col>
      </Row>
    </div>
  );
};

TopicCreatePreview.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  // from parent
  formData: React.PropTypes.object,
};

export default
  injectIntl(
    TopicCreatePreview
  );
