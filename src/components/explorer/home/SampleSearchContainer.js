import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ItemSlider from '../../common/ItemSlider';
import DataCard from '../../common/DataCard';
import SampleSearchItem from './SampleSearchItem';
import { fetchSampleSearches } from '../../../actions/explorerActions';

const localMessages = {
  mainTitle: { id: 'explorer.featured.mainTitle', defaultMessage: 'Featured Queries' },
  intro: { id: 'explorer.featured.intro', defaultMessage: 'We are featuring these queries' },
};

class SampleSearchContainer extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  render() {
    const { searches, user } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedSearchSlides = null;

    if (searches && searches.length > 0) {
      fixedSearchSlides = searches.map((search, index) => (<div key={index}><SampleSearchItem search={search} user={user} /></div>));

      content = (
        <ItemSlider title={formatMessage(localMessages.intro)} slides={fixedSearchSlides} />
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
  }
}

SampleSearchContainer.propTypes = {
  searches: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  searches: state.explorer.samples.list,
  user: state.user,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchSampleSearches());
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SampleSearchContainer
    )
  );

