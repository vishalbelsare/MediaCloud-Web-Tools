import React from 'react';
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { Row, Col } from 'react-flexbox-grid/lib';
import SourceList from '../../common/SourceList';
import CollectionSentenceCountContainer from './CollectionSentenceCountContainer';
import CollectionTopWordsContainer from './CollectionTopWordsContainer';
import CollectionGeographyContainer from './CollectionGeographyContainer';
import CollectionSourceRepresentation from './CollectionSourceRepresentation';
import CollectionSimilarContainer from './CollectionSimilarContainer';
import CollectionMetadataCoverageSummaryContainer from './CollectionMetadataCoverageSummaryContainer';
import { hasPermissions, getUserRoles, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { WarningNotice } from '../../common/Notice';

const localMessages = {
  searchNow: { id: 'collection.details.searchNow', defaultMessage: 'Search on the Dashboard' },
  collectionDetailsTitle: { id: 'collection.details.title', defaultMessage: 'Collection: {name}' },
  noHealth: { id: 'collection.details.noHealth', defaultMessage: 'Sorry, we can\'t show collection-level health yet.' },
  sourceTableTitle: { id: 'collection.details.sourceTable.title', defaultMessage: 'Sources' },
  sourceTableIntro: { id: 'collection.details.sources.intro',
    defaultMessage: 'This collection includes {count, plural,\n =0 {no media sources} \n =1 {one media source} \n other {# media sources}\n}.',
  },
  collectionIsOrIsnt: { id: 'collection.details.isOrIsnt', defaultMessage: 'This is a {shows, plural,\n =0 {dynamic collection; sources can be added and removed from it}\n =1 {static collection; the sources that are part of it will not change}\n}.' },
  collectionIsNotStatic: { id: 'collection.details.isStatic', defaultMessage: 'This is a dynamic collection; sources can be added and removed from it' },
  collectionIsStatic: { id: 'collection.details.isNotStatic', defaultMessage: 'This is a static collection; the sources that are part of it will not change.' },
  collectionShowOn: { id: 'collection.details.showOn', defaultMessage: 'This collection {onMedia, plural,\n =0 {does not show}\n =1 {shows}\n} up on media and {onStories, plural,\n =0 {does not show}\n =1 {shows}\n other {does not show}\n} up on stories.' },
  collectionFavorited: { id: 'collection.favorited', defaultMessage: 'Marked this as a starred collection' },
  collectionUnFavorited: { id: 'collection.unfavorited', defaultMessage: 'Remove this as a starred collection' },
  notPermitted: { id: 'collection.notPermitted', defaultMessage: 'Sorry, this is a private collection.' },
};

class CollectionDetailsContainer extends React.Component {

  searchOnDashboard = () => {
    const { collection } = this.props;
    const dashboardUrl = `https://dashboard.mediacloud.org/#query/["*"]/[{"sets":[${collection.tags_id}]}]/[]/[]/[{"uid":1,"name":"${collection.label}","color":"55868A"}]`;
    window.open(dashboardUrl, '_blank');
  }

  render() {
    const { collection, user } = this.props;
    const { formatMessage } = this.props.intl;
    const filename = `SentencesOverTime-Collection-${collection.tags_id}`;

    if (collection && !collection.show_on_media && !hasPermissions(getUserRoles(user), PERMISSION_MEDIA_EDIT)) {
      return (
        <WarningNotice><FormattedHTMLMessage {...localMessages.notPermitted} /></WarningNotice>
      );
    }

    return (
      <div>
        <Row>
          <Col lg={8}>
            <p><b>{collection.description}</b></p>
            <p>
              <li><FormattedMessage {...localMessages.collectionIsOrIsnt} values={{ shows: collection.is_static }} /></li>
              <li><FormattedMessage {...localMessages.collectionShowOn} values={{ onMedia: collection.show_on_media, onStories: collection.show_on_stories }} /></li>
            </p>
          </Col>
          <Col lg={4}>
            <RaisedButton label={formatMessage(localMessages.searchNow)} primary onClick={this.searchOnDashboard} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <CollectionTopWordsContainer collectionId={collection.tags_id} />
          </Col>
          <Col lg={6} xs={12}>
            <CollectionSentenceCountContainer collectionId={collection.tags_id} filename={filename} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} xs={12}>
            <CollectionGeographyContainer collectionId={collection.tags_id} collectionName={collection.label} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} xs={12}>
            <CollectionMetadataCoverageSummaryContainer collectionId={collection.tags_id} collection={collection} sources={collection.media} />
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <SourceList collectionId={collection.tags_id} sources={collection.media} />
          </Col>
          <Col lg={6} xs={12}>
            <CollectionSourceRepresentation collectionId={collection.tags_id} />
            <CollectionSimilarContainer collectionId={collection.tags_id} filename={filename} />
          </Col>
        </Row>
      </div>
    );
  }

}

CollectionDetailsContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  params: React.PropTypes.object.isRequired,       // params from router
  collectionId: React.PropTypes.number.isRequired,
  // from state
  collection: React.PropTypes.object,
  user: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  collectionId: parseInt(ownProps.params.collectionId, 10),
  collection: state.sources.collections.selected.collectionDetails.object,
  user: state.user,
});

export default
  injectIntl(
    connect(mapStateToProps)(
      CollectionDetailsContainer
    )
  );
