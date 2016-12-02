import React from 'react';
import Title from 'react-title-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import CollectionAdvancedSearchMetadataForm from './form/CollectionAdvancedSearchMetadataForm';
import SourcesAndCollectionsContainer from '../SourcesAndCollectionsContainer';
import { fetchSourceByMetadata, fetchCollectionByMetadata } from '../../../actions/sourceActions';

const localMessages = {
  mainTitle: { id: 'collection.maintitle', defaultMessage: 'Advanced Search' },
  addButton: { id: 'collection.add.save', defaultMessage: 'Search' },
};

const AdvancedSearchContainer = (props) => {
  const { queriedSources, queriedCollections, requerySourcesAndCollections, initialValues } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.mainTitle)} | ${parentTitle}`;
  return (
    <div>
      <Title render={titleHandler} />
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.mainTitle} /></h1>
          </Col>
        </Row>
        <CollectionAdvancedSearchMetadataForm
          initialValues={initialValues}
          buttonLabel={formatMessage(localMessages.addButton)}
          requerySourcesAndCollections={requerySourcesAndCollections}
        />
        <SourcesAndCollectionsContainer queriedSources={queriedSources} queriedCollections={queriedCollections} />
      </Grid>
    </div>
  );
};

AdvancedSearchContainer.propTypes = {
  // from context
  intl: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string,
  queriedCollections: React.PropTypes.array,
  queriedSources: React.PropTypes.array,
  requerySourcesAndCollections: React.PropTypes.func,
  initialValues: React.PropTypes.array,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  requerySourcesAndCollections: () => {
    dispatch(fetchSourceByMetadata());
    dispatch(fetchCollectionByMetadata());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      AdvancedSearchContainer
    ),
  );
