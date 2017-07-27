import PropTypes from 'prop-types';
import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import CollectionIcon from './icons/CollectionIcon';
import MediaSourceIcon from './icons/MediaSourceIcon';

const SourceOrCollectionChip = (props) => {
  const { object, onDelete, onClick, children } = props;
  const isCollection = object.tags_id !== undefined;
  let icon;
  if (isCollection) {
    icon = <CollectionIcon height={15} />;
  } else {
    icon = <MediaSourceIcon height={15} />;
  }
  const typeClass = isCollection ? 'chip-collection' : 'chip-media-source';
  const objectId = object.id || isCollection ? object.tags_id : object.media_id;
  const name = isCollection ? (object.name || object.label || object.tag) : (object.name || object.url);
  return (
    <Chip
      className={`chip ${typeClass}`}
      key={`chip${objectId}`}
      onRequestDelete={onDelete}
      onTouchTap={onClick}
      backgroundColor={'rgb(255,255,255)'}
      style={{ border: '1px solid rgb(204,204,204)' }}
    >
      <Avatar size={32}>{icon}</Avatar>
      {name}
      {children}
    </Chip>
  );
};

SourceOrCollectionChip.propTypes = {
  object: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default SourceOrCollectionChip;
