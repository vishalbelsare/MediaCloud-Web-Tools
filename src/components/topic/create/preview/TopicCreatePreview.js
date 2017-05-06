import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import TopicStoryCountPreview from './TopicStoryCountPreview';
import TopicAttentionPreview from './TopicAttentionPreview';
import TopicStorySamplePreview from './TopicStorySamplePreview';
import { prepDateForSolrQuery } from '../../../../lib/dateUtil';

const TopicCreatePreview = (props) => {
  const { formData } = props;
  // TODO make sure we are validating this query String, making sure no rogue code is in there etc.
  let queryString = null;
  if (formData !== undefined) {
    queryString = `${formData.solr_seed_query} AND ${prepDateForSolrQuery(formData.start_date, formData.end_date)}`;
  }

  return (
    <div className="">
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicStoryCountPreview query={queryString} />
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicAttentionPreview query={formData} />
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <TopicStorySamplePreview query={queryString} />
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
