import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import DataCard from '../../common/DataCard';
import CollectionIcon from '../../common/icons/CollectionIcon';

const CollectionList = (props) => {
  const { title, intro, collections, handleTouchTap } = props;
  return (
    <DataCard className="collection-list">
      <h2>{title}</h2>
      <p>{intro}</p>
      <div className="collection-list-item-wrapper">
        {collections.map(c =>
          <Chip className="chip" key={c.tags_id} onTouchTap={() => handleTouchTap(c.tags_id)}>
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
  // from dispatch
  handleTouchTap: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  handleTouchTap: (collectionId) => {
    dispatch(push(`/collections/${collectionId}/details`));
  },
});

export default
  connect(null, mapDispatchToProps)(
    CollectionList
  );
