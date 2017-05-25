import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import DataCard from '../../common/DataCard';
import FeaturedItem from './FeaturedItem';
import { fetchFeaturedQueryList } from '../../../actions/explorerActions';
import composeAsyncContainer from '../../common/AsyncContainer';

const localMessages = {
  mainTitle: { id: 'explorer.featured.mainTitle', defaultMessage: 'Featured Queries' },
  intro: { id: 'explorer.featured.intro', defaultMessage: 'We are featuring these queries' },
};

const FeaturedQueriesContainer = (props) => {
  const { queries } = props;
  let content = null;

  if (queries && queries.length > 0) {
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
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.explorer.queries.featured.fetchStatus,
  queries: state.explorer.queries.featured.list,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchFeaturedQueryList());
  },
  asyncFetch: () => {
    dispatch(fetchFeaturedQueryList());
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

