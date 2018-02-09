import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { Grid } from 'react-flexbox-grid/lib';
import Title from 'react-title-component';
import { selectCollection, fetchCollectionDetails } from '../../../actions/sourceActions';
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
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  asyncFetch: PropTypes.func.isRequired,
  removeCollectionId: PropTypes.func.isRequired,
  // from context
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,       // params from router
  collectionId: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  collection: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  collectionId: parseInt(ownProps.params.collectionId, 10),
  fetchStatus: state.sources.collections.selected.collectionDetails.fetchStatus,
  collection: state.sources.collections.selected.collectionDetails.object,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  removeCollectionId: () => {
    dispatch(selectCollection(null));
  },
  fetchData: (collectionId) => {
    dispatch(selectCollection(collectionId));
    dispatch(fetchCollectionDetails(collectionId));
  },
  asyncFetch: () => {
    dispatch(selectCollection(ownProps.params.collectionId));
    dispatch(fetchCollectionDetails(ownProps.params.collectionId));
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
