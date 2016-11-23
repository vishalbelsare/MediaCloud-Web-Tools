import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchCollectionList } from '../../../actions/sourceActions';
import CollectionIcon from '../../common/icons/CollectionIcon';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'sources.collections.all.title', defaultMessage: 'All Collections' },
  intro: { id: 'sources.collections.all.intro',
    defaultMessage: 'This is a list of all of our curated collections of media sources.  Collections are our primary way of organizing media sources; almost every media source in our system is a member of one or more of these curated collections.  Some collections are manually curated, and others are generated using quantitative metrics.  Some are historical, while others are actively maintained and updated.' },
};

const AllCollectionsContainer = (props) => {
  const { collections } = props;
  return (
    <div className="all-collections">
      <Grid>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h2>
              <CollectionIcon height={32} />
              <FormattedMessage {...localMessages.title} />
            </h2>
          </Col>
        </Row>
        <Row>
          <table width="100%">
            <tbody>
              <tr>
                <th><FormattedMessage {...messages.collectionNameProp} /></th>
                <th><FormattedMessage {...messages.collectionDescriptionProp} /></th>
              </tr>
              {collections.map((c, idx) => (
                <tr key={c.tags_id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td>
                    <Link to={`/collections/${c.tags_id}`}>{c.label}</Link>
                  </td>
                  <td>
                    {c.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Row>
      </Grid>
    </div>
  );
};

AllCollectionsContainer.propTypes = {
  // from state
  collections: React.PropTypes.array.isRequired,
  fetchStatus: React.PropTypes.string.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.allCollections.fetchStatus,
  collections: state.sources.allCollections.results,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchCollectionList());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        AllCollectionsContainer
      )
    )
  );
