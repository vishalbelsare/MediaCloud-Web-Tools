import React from 'react';
import { reduxForm } from 'redux-form';
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
          <TopicAttentionPreview query={formData.solr_seed_query} />
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

// TODO shouldnt be necessary
const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false,  // so the wizard works
};

export default
  injectIntl(
    reduxForm(reduxFormConfig)(
      TopicCreatePreview
    )
  );
