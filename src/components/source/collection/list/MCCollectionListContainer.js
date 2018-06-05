import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../../common/AsyncContainer';
import { fetchCollectionList } from '../../../../actions/sourceActions';
import CollectionTable from '../../../common/CollectionTable';
import TabSelector from '../../../common/TabSelector';
import { TAG_SET_MC_ID, isCollectionTagSet, canSeePrivateCollections } from '../../../../lib/tagUtil';

const localMessages = {
  private: { id: 'sources.collections.mc.private', defaultMessage: 'Private' },
  public: { id: 'sources.collections.mc.public', defaultMessage: 'Public' },
};

class MCCollectionListContainer extends React.Component {
  state = {
    selectedViewIndex: 0,
  };
  render() {
    const { name, collections, linkToFullUrl } = this.props;
    const { formatMessage } = this.props.intl;
    const privateColl = collections.filter(t => (isCollectionTagSet(t.tag_sets_id) && (!t.show_on_media || canSeePrivateCollections)));
    const allOtherCollections = collections.filter(t => (isCollectionTagSet(t.tag_sets_id) && (t.show_on_media)));

    let selectedTabCollections = allOtherCollections;
    if (this.state.selectedViewIndex === 0) {
      selectedTabCollections = allOtherCollections;
    } else {
      selectedTabCollections = privateColl;
    }
    return (
      <div className="mc-collections-table">
        <Grid>
          <h1>{name}</h1>
          <TabSelector
            tabLabels={[
              formatMessage(localMessages.public),
              formatMessage(localMessages.private),
            ]}
            onViewSelected={index => this.setState({ selectedViewIndex: index })}
          />
          <br />
          <Row>
            <Col lg={12}>
              <div className="collection-list-item-wrapper">
                <CollectionTable collections={selectedTabCollections} absoluteLink={linkToFullUrl} />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

MCCollectionListContainer.propTypes = {
  // from state
  collections: PropTypes.array.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  user: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  linkToFullUrl: PropTypes.bool,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.all.fetchStatus,
  name: state.sources.collections.all.name,
  description: state.sources.collections.all.description,
  collections: state.sources.collections.all.collections,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchCollectionList(TAG_SET_MC_ID));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        MCCollectionListContainer
      )
    )
  );
