import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ItemSlider from '../common/ItemSlider';
import DataCard from '../common/DataCard';
import FeaturedItem from './FeaturedItem';
// import { fetchFeaturedQueries } from '../../actions/explorerActions';
import composeAsyncContainer from '../common/AsyncContainer';

const localMessages = {
  mainTitle: { id: 'explorer.featured.mainTitle', defaultMessage: 'Featured Queries' },
  intro: { id: 'explorer.featured.intro', defaultMessage: 'We are featuring these queries' },
};

const FeaturedQueriesContainer = (props) => {
  const { queries } = props;
  let content = null;
  const dummyQuery = { id: 1, label: 'something' };
  const dummyQuery2 = { id: 2, label: 'something else' };
  const fixedQuerySlides = (
    <div>
      <div key={1}><FeaturedItem query={dummyQuery} /></div>
      <div key={2}><FeaturedItem query={dummyQuery2} /></div>
      <div key={3}><FeaturedItem query={dummyQuery} /></div>
    </div>
  );
  if (queries && queries.length > 0) {
    content = (
      <ItemSlider slides={fixedQuerySlides} />
    );
  }

  return (
    <div className="featured-collections">
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.mainTitle} />
        </h2>
        <div>
          {content}
        </div>
      </DataCard>
    </div>
  );
};

FeaturedQueriesContainer.propTypes = {
  queries: React.PropTypes.array,
  fetchStatus: React.PropTypes.object.isRequired,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = () => ({
  // fetchStatus: state.explorer.queries.featured.fetchStatus,
  // queries: state.explorer.queries.featured.list,
});


const mapDispatchToProps = () => ({
  fetchData: () => {
    // dispatch(fetchFeaturedQueries());
  },
  asyncFetch: () => {
    // dispatch(fetchFeaturedQueries());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        FeaturedQueriesContainer
      )
    )
  );

