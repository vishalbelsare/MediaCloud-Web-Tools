import React from 'react';
import { injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import { FormattedMessage } from 'react-intl';

const localMessages = {
  title: { id: 'media.collections.list.title', defaultMessage: 'Collections' },
  intro: { id: 'media.collections.list.intro', defaultMessage: 'The {name} is part of {count} collections.' },
};

const MediaCollectionsList = (props) => {
  const { name, collections } = props;
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title}/>
      </h2>
      <p>
        <FormattedMessage {...localMessages.intro} values={{
          name: name,
          count: collections.length
        }} />
      </p>
      <ul>
        { collections.map(tag => <li key={tag.tags_id}>
            <a href={linkToCollection(tag.tags_id)}>{tag.label}</a>
          </li> ) }
      </ul>
    </DataCard>
  );
};

function linkToCollection(tags_id) {
  return `https://sources.mediameter.org/#media-tag/${tags_id}/details`;
}

MediaCollectionsList.propTypes = {
  // from parent
  name: React.PropTypes.string.isRequired,
  collections: React.PropTypes.array.isRequired,
  // from context
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(MediaCollectionsList);
