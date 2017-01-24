import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import { DownloadButton } from '../common/IconButton';
import messages from '../../resources/messages';

const FavoritedList = (props) => {
  const { title, intro, favoritedItems, onDownload, helpButton } = props;
  const { formatMessage } = props.intl;
  let actions = null;
  if (onDownload) {
    actions = (
      <div className="actions">
        <DownloadButton tooltip={formatMessage(messages.download)} onClick={onDownload} />
      </div>
    );
  }
  return (
    <DataCard className="favorited-list">
      {actions}
      <h2>{title}{helpButton}</h2>
      <p>{intro}</p>
      <div className="">
        {favoritedItems.map(c =>
          <p>{c.name}</p>
        )}
      </div>
    </DataCard>
  );
};

FavoritedList.propTypes = {
  // from parent
  title: React.PropTypes.string.isRequired,
  intro: React.PropTypes.string,
  favoritedItems: React.PropTypes.array.isRequired,
  linkToFullUrl: React.PropTypes.bool,
  onDownload: React.PropTypes.func,
  helpButton: React.PropTypes.node,
  // from dispatch
  handleClick: React.PropTypes.func.isRequired,
  // from compositional chain
  intl: React.PropTypes.object.isRequired,
};

const mapDispatchToProps = () => ({
});

export default
  injectIntl(
    connect(null, mapDispatchToProps)(
      FavoritedList
    )
  );
