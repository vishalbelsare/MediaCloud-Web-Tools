import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import DataCard from './DataCard';
import messages from '../../resources/messages';
import { DownloadButton } from './IconButton';
import SourceTable from './SourceTable';

const localMessages = {
  title: { id: 'collection.details.sources.title', defaultMessage: 'Sources' },
  intro: { id: 'collection.details.sources.intro',
    defaultMessage: 'This collection includes {count, plural,\n =0 {no media sources} \n =1 {one media source} \n other {# media sources}\n}.',
  },
};

class SourceList extends React.Component {

  downloadCsv = () => {
    const { collectionId, downloadUrl } = this.props;
    let url = null;
    if (collectionId) {
      url = `/api/collections/${collectionId}/sources.csv`;
    } else {
      url = downloadUrl;
    }
    window.location = url;
  }

  render() {
    const { sources, title, intro } = this.props;
    const { formatMessage } = this.props.intl;

    let titleRefactor = null;
    if (title) {
      titleRefactor = title;
    } else {
      titleRefactor = (
        <FormattedMessage
          {...localMessages.title}
          values={{ count: sources.length }}
        />
      );
    }
    let introRefactor = null;
    if (title) {
      introRefactor = intro;
    } else {
      introRefactor = (
        <FormattedMessage
          {...localMessages.intro}
          values={{ count: sources.length }}
        />
      );
    }
    return (
      <DataCard className="source-list">
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>{titleRefactor}</h2>
        <p>
          {introRefactor}
        </p>
        <SourceTable sources={sources} />
      </DataCard>
    );
  }
}

SourceList.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  title: PropTypes.string,
  intro: PropTypes.string,
  sources: PropTypes.array.isRequired,
  collectionId: PropTypes.number,
  downloadUrl: PropTypes.string,
};

export default
  injectIntl(
    SourceList
  );
