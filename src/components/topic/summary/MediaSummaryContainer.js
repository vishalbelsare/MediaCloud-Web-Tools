import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncContainer from '../../common/hocs/AsyncContainer';
import withDescribedDataCard from '../../common/hocs/DescribedDataCard';
import MediaTable from '../MediaTable';
import messages from '../../../resources/messages';
import { fetchTopicTopMedia, sortTopicTopMedia } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import LinkWithFilters from '../LinkWithFilters';
import Permissioned from '../../common/Permissioned';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DownloadButton, ExploreButton } from '../../common/IconButton';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';

const localMessages = {
  title: { id: 'topic.summary.topMedia.title', defaultMessage: 'Top Media' },
  descriptionIntro: { id: 'topic.summary.stories.help.title', defaultMessage: 'The top media sources within this topic can show which sources had control of the main narratives. Sort by different measures to get a better picture of a media source\'s influence.' },
  description: { id: 'topic.summary.topMedia.help.text',
    defaultMessage: '<p>This table shows you the media that wrote about this Topic the most.</p><p>This table has one row for each Media Source.  The column currently being used to sort the results has a little down arrow next to it.  Click one of the green column headers to change how it is sorted.  Here is a summary of the columns:</p><ul><li>Name: the name of the Media Source; click to see details about this source\'s content within this Topic</li><li>Media Inlinks: how many unique other Media Sources have links to this content from this Media Source in the Topic</li><li>Outlinks: the number of links in this Media Source to other stories</li><li>Bit.ly Clicks: the number of clicks on links to stories from this Media Source shortened using the Bit.ly URL shortening service</li><li>Facebook Shares: the number of times stories from this Media Source were shared on Facebook</li></ul><p>Click the download button in the top right to download a CSV of the full list of stories</p>',
  },
};

const NUM_TO_SHOW = 10;

class MediaSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== this.props.sort)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }
  refetchData = () => {
    const { topicId, filters, fetchData, sort } = this.props;
    fetchData(topicId, filters.snapshotId, filters.timespanId, sort);
  }
  downloadCsv = () => {
    const { topicId, filters, sort } = this.props;
    const url = `/api/topics/${topicId}/media.csv?${filtersAsUrlParams(filters)}&sort=${sort}`;
    window.location = url;
  }
  render() {
    const { media, sort, topicId, filters, user } = this.props;
    const { formatMessage } = this.props.intl;
    const exploreUrl = `/topics/${topicId}/media`;
    const isLoggedIn = hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN);
    return (
      <DataCard>
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ExploreButton linkTo={filteredLinkTo(exploreUrl, filters)} />
            <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
          </div>
        </Permissioned>
        <h2>
          <LinkWithFilters to={exploreUrl}>
            <FormattedMessage {...localMessages.title} />
          </LinkWithFilters>
        </h2>
        <MediaTable
          media={media}
          onChangeSort={isLoggedIn ? this.onChangeSort : null}
          sortedBy={sort}
          topicId={topicId}
        />
      </DataCard>
    );
  }
}

MediaSummaryContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  media: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topMedia.fetchStatus,
  sort: state.topics.selected.summary.topMedia.sort,
  media: state.topics.selected.summary.topMedia.media,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: NUM_TO_SHOW,
    };
    dispatch(fetchTopicTopMedia(props.topicId, params));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopMedia(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData({
        topicId: ownProps.topicId,
        filters: ownProps.filters,
        sort: stateProps.sort,
      });
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      withDescribedDataCard(localMessages.descriptionIntro, localMessages.description)(
        withAsyncContainer(
          MediaSummaryContainer
        )
      )
    )
  );
