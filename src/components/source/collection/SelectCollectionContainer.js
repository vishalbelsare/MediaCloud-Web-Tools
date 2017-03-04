import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { Grid } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { selectCollection, fetchCollectionDetails } from '../../../actions/sourceActions';
import { setSubHeaderVisible } from '../../../actions/appActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import SourceControlBar from '../controlbar/SourceControlBar';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_MEDIA_EDIT } from '../../../lib/auth';
import { EditButton } from '../../common/IconButton';

const localMessages = {
  editCollection: { id: 'collection.edit', defaultMessage: 'Modify this Collection' },
};

class SelectCollectionContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { collectionId, fetchData } = this.props;
    if ((nextProps.collectionId !== collectionId)) {
      fetchData(nextProps.collectionId);
    }
  }

  componentWillUnmount() {
    const { removeCollectionId } = this.props;
    removeCollectionId();
  }

  render() {
    const { children, collection } = this.props;
    const titleHandler = parentTitle => `${collection.label} | ${parentTitle}`;
    return (
      <div>
        <Title render={titleHandler} />
        <SourceControlBar>
          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
            <span className="collection-edit-link">
              <Link to={`/collections/${collection.tags_id}/edit`} >
                <EditButton />
                <FormattedMessage {...localMessages.editCollection} />
              </Link>
            </span>
          </Permissioned>
        </SourceControlBar>
        <Grid className="details collection-details">
          {children}
        </Grid>
      </div>
    );
  }

}

SelectCollectionContainer.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  removeCollectionId: React.PropTypes.func.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  collectionId: React.PropTypes.number.isRequired,
  children: React.PropTypes.node.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  collection: React.PropTypes.object,
};

SelectCollectionContainer.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  collectionId: parseInt(ownProps.params.collectionId, 10),
  fetchStatus: state.sources.collections.selected.collectionDetails.fetchStatus,
  collection: state.sources.collections.selected.collectionDetails.object,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  removeCollectionId: () => {
    dispatch(selectCollection(null));
    dispatch(setSubHeaderVisible(false));
  },
  fetchData: (collectionId) => {
    dispatch(selectCollection(collectionId));
    dispatch(fetchCollectionDetails(collectionId))
      .then(() => dispatch(setSubHeaderVisible(true)));
  },
  asyncFetch: () => {
    dispatch(selectCollection(ownProps.params.collectionId));
    dispatch(fetchCollectionDetails(ownProps.params.collectionId))
      .then(() => dispatch(setSubHeaderVisible(true)));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        SelectCollectionContainer
      )
    )
  );
