import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { fetchRecentNews } from '../../../actions/systemActions';
import composeAsyncContainer from '../../common/AsyncContainer';
import RecentNewsMenu from './RecentNewsMenu';

const RecentNewsMenuContainer = (props) => {
  const { recentNews } = props;
  const listOfNotes = recentNews.map(release => release.notes);
  const newsItems = [].concat([], ...listOfNotes);
  return <RecentNewsMenu newsItems={newsItems.slice(0, 8)} />;
};

RecentNewsMenuContainer.propTypes = {
  // from parent
  // from state
  recentNews: PropTypes.array,
  // from compositional chain
};

const mapStateToProps = state => ({
  fetchStatus: state.system.recentNews.fetchStatus,
  recentNews: state.system.recentNews.releases,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchRecentNews());
  },
});

export default
  connect(mapStateToProps, mapDispatchToProps)(
    composeAsyncContainer(
      RecentNewsMenuContainer
    )
  );
