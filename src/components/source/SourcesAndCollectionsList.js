import React from 'react';
import Link from 'react-router/lib/Link';
import Title from 'react-title-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { SelectField, Checkbox, MenuItem } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import CollectionIcon from '../common/icons/CollectionIcon';
import SourceIcon from '../common/icons/MediaSourceIcon';

const localMessages = {
  sourceHeader: { id: 'sourceCollectionList.source', defaultMessage: 'Source: {name}' },
  collectionHeader: { id: 'sourceCollectionList.collection', defaultMessage: 'Collection: {name}' },
  checkAllFirstPage: { id: 'sourceCollectionList.checkAllFirstPage', defaultMessage: 'Select All On This Page' },
  unCheckAll: { id: 'sourceCollectionList.collection.unCheckAll', defaultMessage: 'Unselect All' },
  checkAllPages: { id: 'sourceCollectionList.checkAllPages', defaultMessage: 'Select All Results' },
};

const SourcesAndCollectionsList = (props) => {
  const { queriedSources, queriedCollections, addToSelectedSources, addToSelectedCollections, addRemoveAll } = props;
  const { formatMessage } = props.intl;
  const content = null;
  const titleHandler = parentTitle => `${queriedCollections.label} | ${parentTitle}`;
  if (queriedSources === undefined || queriedCollections === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <Grid>
      <Col lg={12}>
        <SelectField name="allOrNone">
          <MenuItem primaryText={formatMessage(localMessages.checkAllFirstPage)}>
            <Checkbox
              name="chkSelectAllFirstPage"
              onCheck={addRemoveAll}
            />
          </MenuItem>
          <MenuItem primaryText={formatMessage(localMessages.unCheckAll)} />
          <MenuItem primaryText={formatMessage(localMessages.checkAllPages)}>
            <Checkbox
              name="chkSelectAllPages"
              onCheck={addRemoveAll}
            />
          </MenuItem>
        </SelectField>
      </Col>
      <Col lg={12}>
        <Title render={titleHandler} />
        {queriedSources.map(source => (
          <Row key={`src_${source.media_id}`} name={`src_${source.media_id}`}>
            <Col lg={2}>
              <Checkbox
                key={source.media_id}
                name={`src_${source.media_id}`}
                onCheck={() => addToSelectedSources(source.media_id)}
              />
            </Col>
            <Col lg={6}>
              <h2>
                <SourceIcon height={32} />
                <FormattedMessage {...localMessages.sourceHeader} values={{ name: source.name }} />
              </h2>
              <h5>
                <FormattedMessage {...localMessages.sourceHeader} values={{ name: source.url }} />
              </h5>
            </Col>
            <Col lg={2}>
              <Link to={`/sources/${source.media_id}`}>Explore {source.name}</Link>
            </Col>
          </Row>
          )
        )}
        {queriedCollections.map(collection => (
          <Row key={`clxn_${collection.tag_sets_id}`} name={`clxn_${collection.tag_sets_id}`}>
            <Col lg={2}>
              <Checkbox
                key={collection.tag_sets_id}
                name={`clxn_${collection.tag_sets_id}`}
                onCheck={() => addToSelectedCollections(collection.tag_sets_id)}
              />
            </Col>
            <Col lg={6}>
              <CollectionIcon height={32} />
              <h2><FormattedMessage {...localMessages.collectionHeader} values={{ name: collection.description }} /></h2>
              <h5>
                <FormattedMessage {...localMessages.sourceHeader} values={{ name: collection.name }} />
              </h5>
            </Col>
            <Col lg={2}>
              <Link to={`/collections/${collection.tag_sets_id}`}>{collection.description}</Link>
            </Col>
          </Row>
          )
        )}
      </Col>
    </Grid>
  );
};

SourcesAndCollectionsList.propTypes = {
  queriedSources: React.PropTypes.array,
  queriedCollections: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
  addToSelectedSources: React.PropTypes.func,
  addToSelectedCollections: React.PropTypes.func,
  addRemoveAll: React.PropTypes.func.isRequired,
};

export default injectIntl(SourcesAndCollectionsList);
