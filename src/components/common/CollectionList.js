import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import CollectionIcon from './icons/CollectionIcon';
import { isCollectionTagSet } from '../../lib/sources';

const CollectionList = (props) => {
  const { title, intro, collections, handleClick } = props;
  const validCollections = collections.filter(c => isCollectionTagSet(c.tag_sets_id));
  return (
    <DataCard className="collection-list">
      <h2>{title}</h2>
      <p>{intro}</p>
      <div className="collection-list-item-wrapper">
        {validCollections.map(c =>
          <Chip className="chip" key={c.tags_id} onTouchTap={() => handleClick(c.tags_id)}>
            <Avatar size={32}><CollectionIcon height={15} /></Avatar>
            {c.label}
          </Chip>
        )}
      </div>
    </DataCard>
  );
};

CollectionList.propTypes = {
  // from parent
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string,
  collections: React.PropTypes.array.isRequired,
  linkToFullUrl: React.PropTypes.bool,
  // from dispatch
  handleClick: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleClick: (collectionId) => {
    if (ownProps.linkToFullUrl) {
      window.open(`https://sources.mediacloud.org/#/collections/${collectionId}/details`);
    } else {
      dispatch(push(`/collections/${collectionId}`));
    }
  },
});

export default
  connect(null, mapDispatchToProps)(
    CollectionList
  );
