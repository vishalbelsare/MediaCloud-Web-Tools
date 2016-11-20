import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import SourceAddMetaForm from './SourceAddMetaForm';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchCountryList, fetchSourceMetadata } from '../../../../actions/sourceActions';

const localMessages = {
  title: { id: 'source.add.title', defaultMessage: 'Source Metadata' },
};

const SourceAddMetaContainer = (props) => {
  const { metadataList, countrylist } = props;
  return (
    <div>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2><FormattedMessage {...localMessages.title} /></h2>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <SourceAddMetaForm
            meta={metadataList}
            countries={countrylist}
          />
        </Col>
      </Row>
    </div>
  );
};

SourceAddMetaContainer.propTypes = {
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  topicId: React.PropTypes.number,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  metadataList: React.PropTypes.object,
  countrylist: React.PropTypes.array,
  // from state
  fetchStatus: React.PropTypes.string,
};

const mapStateToProps = state => ({
  // filters: state.sources.selected.filters
  fetchStatus: state.sources.selected.details.sourceCreate.metadata.fetchStatus,
  metadataList: state.sources.selected.details.sourceCreate.metadata.list,
  countrylist: state.sources.selected.details.sourceCreate.countrylist.list,

});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchSourceMetadata());
    dispatch(fetchCountryList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SourceAddMetaContainer
      )
    )
  );
