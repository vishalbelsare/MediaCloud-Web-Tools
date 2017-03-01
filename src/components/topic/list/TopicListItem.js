import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { Col } from 'react-flexbox-grid/lib';
import Lock from 'material-ui/svg-icons/action/lock';
import IconButton from 'material-ui/IconButton';
import DataCard from '../../common/DataCard';
import FavoriteToggler from '../../common/FavoriteToggler';
import { PERMISSION_TOPIC_NONE } from '../../../lib/auth';

const localMessages = {
  notPermissioned: { id: 'topic.notPermissioned', defaultMessage: 'Missing Permission' },
  status: { id: 'topic.status', defaultMessage: 'Status: {status}' },
};

const TopicListItem = (props) => {
  const { topic, onChangeFavorited } = props;
  const { formatMessage } = props.intl;
  const disable = false; // (topic.state !== 'ready');
  let title = null;
  if (disable || (topic.user_permission === PERMISSION_TOPIC_NONE)) {
    title = topic.name;
  } else {
    title = <Link to={`/topics/${topic.topics_id}/summary`}>{topic.name}</Link>;
  }
  let mainButton = null;
  if (topic.user_permission !== PERMISSION_TOPIC_NONE) {
    mainButton = (<FavoriteToggler
      isFavorited={topic.isFavorite}
      onChangeFavorited={isFavNow => onChangeFavorited(topic.topics_id, isFavNow)}
    />);
  } else {
    mainButton = (
      <IconButton tooltip={formatMessage(localMessages.notPermissioned)} >
        <Lock color="#FF8C00" />
      </IconButton>
    );
  }
  return (
    <Col xs={12} sm={6} md={6} lg={6}>
      <DataCard disabled={disable} inline >
        <div className="actions">{mainButton}</div>
        <h3>{title}</h3>
        <p>{topic.description}</p>
        <p>
          <small><i>
            <FormattedMessage {...localMessages.status} values={{ status: topic.state }} />
          </i></small>
        </p>
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
