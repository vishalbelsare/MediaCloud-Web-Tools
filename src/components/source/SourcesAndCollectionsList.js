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
  exploreInvite: { id: 'sourceCollectionList.explore', defaultMessage: 'Explore {name}' },
};

const SourcesAndCollectionsList = (props) => {
  const { queriedSources, queriedCollections, addOrRemoveToSelectedSources,
    addOrRemoveToSelectedCollections, addRemoveAll,
    ADD_ALL_THIS_PAGE, REMOVE_ALL, ADD_ALL_PAGES } = props;
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
      <Col lg={5}>
        <SelectField name="allOrNone" fullWidth >
          <MenuItem
            name="chkSelectAllFirstPage"
            onClick={function getVals(...args) {
              return addRemoveAll(ADD_ALL_THIS_PAGE, args[1]);
            }
            }
            primaryText={formatMessage(localMessages.checkAllFirstPage)}
          />
          <MenuItem
            primaryText={formatMessage(localMessages.unCheckAll)}
            onClick={function getVals(...args) {
              return addRemoveAll(REMOVE_ALL, args[1]);
            }
            }
          />
          <MenuItem
            name="chkSelectAllPages"
            onClick={function getVals(...args) {
              return addRemoveAll(ADD_ALL_PAGES, args[1]);
            }
            }
            primaryText={formatMessage(localMessages.checkAllPages)}
          />
        </SelectField>
      </Col>
      <Col lg={12}>
        <Title render={titleHandler} />
        {queriedSources.map(source => (
          <Row key={`src_${source.media_id}`} name={`src_${source.media_id}`}>
            <Col lg={2}>
              <Checkbox
                checked={source.selected}
                key={source.media_id}
                name={`src_${source.media_id}`}
                onCheck={function getVals(...args) {
                  return addOrRemoveToSelectedSources(source.media_id, args[1]);
                }
              }
              />
            </Col>
            <Col lg={6}>
              <h2>
                <SourceIcon height={32} />
                <FormattedMessage {...localMessages.sourceHeader} values={{ name: source.name }} />
              </h2>
              <p>{source.url}</p>
            </Col>
            <Col lg={2}>
              <Link to={`/sources/${source.media_id}`}>
                <FormattedMessage {...localMessages.exploreInvite} values={{ name: source.name }} />
              </Link>
            </Col>
          </Row>
          )
        )}
        {queriedCollections.map(collection => (
          <Row key={`clxn_${collection.tags_id}`} name={`clxn_${collection.tags_id}`}>
            <Col lg={2}>
              <Checkbox
                checked={collection.selected}
                key={collection.tags_id}
                name={`clxn_${collection.tags_id}`}
                onCheck={function getVals(...args) {
                  return addOrRemoveToSelectedCollections(collection.tags_id, args[1]);
                }
              }
              />
            </Col>
            <Col lg={6}>
              <h2>
                <CollectionIcon height={32} />
                <FormattedMessage {...localMessages.collectionHeader} values={{ name: collection.label }} />
              </h2>
              <p>{collection.description}</p>
            </Col>
            <Col lg={2}>
              <Link to={`/collections/${collection.tags_id}`}>
                <FormattedMessage {...localMessages.exploreInvite} values={{ name: collection.label }} />
              </Link>
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
  addOrRemoveToSelectedSources: React.PropTypes.func,
  addOrRemoveToSelectedCollections: React.PropTypes.func,
  addRemoveAll: React.PropTypes.func.isRequired,
  allOrNoneCheck: React.PropTypes.bool,
  ADD_ALL_THIS_PAGE: React.PropTypes.number,
  REMOVE_ALL: React.PropTypes.number,
  ADD_ALL_PAGES: React.PropTypes.number,
};

export default injectIntl(SourcesAndCollectionsList);
