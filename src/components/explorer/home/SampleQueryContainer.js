import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ItemSlider from '../../common/ItemSlider';
import DataCard from '../../common/DataCard';
import SampleQueryItem from './SampleQueryItem';
import { fetchSampleSearches } from '../../../actions/explorerActions';

const localMessages = {
  mainTitle: { id: 'explorer.featured.mainTitle', defaultMessage: 'Featured Queries' },
  intro: { id: 'explorer.featured.intro', defaultMessage: 'We are featuring these queries' },
};

const sampleQueryList = [
  { id: 0, label: 'public health query', description: 'lorem epsum', q: 'public', start_date: '2016-02-02', end_date: '2017-02-02', imagePath: '.', color: 'green' },
  { id: 1, label: 'chocolate query', description: 'lorem epsum', q: 'chocolate and dessert', start_date: '2016-02-026', end_date: '2017-02-02', imagePath: '.', color: 'blue' },
  { id: 2, label: 'bike safety query', description: 'lorem epsum', q: 'bike or safety', start_date: '2016-02-026', end_date: '2017-02-02', imagePath: '.', color: 'red' },
];

class SampleQueryContainer extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  render() {
    const { queries } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedQuerySlides = null;

    if (queries && queries.length > 0) {
      fixedQuerySlides = queries.map((query, index) => (<div key={index}><SampleQueryItem query={query} /></div>));

      content = (
        <ItemSlider title={formatMessage(localMessages.intro)} slides={fixedQuerySlides} />
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

SampleQueryContainer.propTypes = {
  queries: React.PropTypes.array,
  intl: React.PropTypes.object.isRequired,
  fetchData: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  queries: state.explorer.queries.list,
});


const mapDispatchToProps = dispatch => ({
  fetchData: () => {
    dispatch(fetchSampleSearches(sampleQueryList));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SampleQueryContainer
    )
  );

