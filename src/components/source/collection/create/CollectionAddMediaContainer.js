import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import CollectionAddMediaForm from './CollectionAddMediaForm';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchSourceSearch } from '../../../../actions/sourceActions';

const localMessages = {
  title: { id: 'collection.addmedia.title', defaultMessage: 'Details' },
  intro: { id: 'collection.addmedia.intro', defaultMessage: 'You can change some of the attributes of this Source.' },
};

const CollectionAddMediaContainer = (props) => {
  const { onSave } = props;
  return (
    <div>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2><FormattedMessage {...localMessages.title} /></h2>
          <p><FormattedMessage {...localMessages.intro} /></p>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <CollectionAddMediaForm
            onSave={onSave}
          />
        </Col>
      </Row>
    </div>
  );
};

CollectionAddMediaContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,

  // from state
  fetchStatus: React.PropTypes.string,
};

const mapStateToProps = state => ({
  // filters: state.sources.selected.filters
  fetchStatus: state.sources.selected.details.create.sourceSearch.fetchStatus,
  list: state.sources.selected.details.create.sourceSearch.list,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchSourceSearch('new*'));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        CollectionAddMediaContainer
      )
    )
  );
