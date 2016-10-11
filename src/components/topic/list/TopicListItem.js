import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import { FavoriteButton, FavoriteBorderButton } from '../../common/IconButton';
import messages from '../../../resources/messages';

const TopicListItem = (props) => {
  const { topic, onChangeFavorited } = props;
  const { formatMessage } = props.intl;
  const disable = (topic.state !== 'ready');
  let title = null;
  if (disable) {
    title = topic.name;
  } else {
    title = <Link to={`/topics/${topic.topics_id}/summary`}>{topic.name}</Link>;
  }
  let favButton = null;
  if (topic.isFavorite) {
    favButton = (<FavoriteButton
      tooltip={formatMessage(messages.unfavorite)}
      onClick={() => onChangeFavorited(topic.topics_id, false)}
    />);
  } else {
    favButton = (<FavoriteBorderButton
      tooltip={formatMessage(messages.favorite)}
      onClick={() => onChangeFavorited(topic.topics_id, true)}
    />);
  }
  return (
    <Col xs={12} sm={6} md={6} lg={6}>
      <DataCard disabled={disable}>
        <div className="actions">
          {favButton}
        </div>
        <h3>{title}</h3>
        <p>{topic.description}</p>
        <p><small>{topic.state}</small></p>
      </DataCard>
    </Col>
  );
};

TopicListItem.propTypes = {
  intl: React.PropTypes.object.isRequired,
  topic: React.PropTypes.object.isRequired,
  onChangeFavorited: React.PropTypes.func.isRequired,
};

export default injectIntl(TopicListItem);
