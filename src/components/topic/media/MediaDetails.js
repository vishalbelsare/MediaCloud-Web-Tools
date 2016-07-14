import React from 'react';
import { injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';

const MediaDetails = (props) => {
  const { media } = props;
  return (
    <DataCard>
      <h2>Details</h2>
      <ul>
        <li>{media.name}</li>
        <li><a href={media.url}>{media.url}</a></li>
      </ul>
    </DataCard>
  );
};

MediaDetails.propTypes = {
  media: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(MediaDetails);
