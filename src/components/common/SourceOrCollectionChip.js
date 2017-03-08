import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import CollectionIcon from './icons/CollectionIcon';
import MediaSourceIcon from './icons/MediaSourceIcon';

const SourceOrCollectionChip = (props) => {
  const { object, onDelete } = props;
  let icon;
  if (object.tags_id) {
    icon = <CollectionIcon height={15} />;
  } else {
    icon = <MediaSourceIcon height={15} />;
  }
  const typeClass = object.tags_id ? 'chip-collection' : 'chip-media-source';
  const objectId = object.tags_id || object.media_id;
  return (
    <Chip className={`chip ${typeClass}`} key={`chip${objectId}`} onRequestDelete={onDelete}>
      <Avatar size={32}>{icon}</Avatar>
      {object.name}
    </Chip>
  );
};

SourceOrCollectionChip.propTypes = {
  object: React.PropTypes.object.isRequired,
  onDelete: React.PropTypes.object,
};

export default SourceOrCollectionChip;
