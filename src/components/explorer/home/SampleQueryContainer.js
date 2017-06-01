import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ItemSlider from '../../common/ItemSlider';
import DataCard from '../../common/DataCard';
import SampleQueryItem from './SampleQueryItem';
import { setQueryList } from '../../../actions/explorerActions';

const localMessages = {
  mainTitle: { id: 'explorer.featured.mainTitle', defaultMessage: 'Featured Queries' },
  intro: { id: 'explorer.featured.intro', defaultMessage: 'We are featuring these queries' },
};

const sampleQueryList = [
  { id: 1, label: 'public health query', queryParams: '{"keyword":"public"}', imagePath: '.' },
  { id: 2, label: 'chocolate query', queryParams: '{"keyword":"chocolate and dessert"}', imagePath: '.' },
  { id: 3, label: 'bike safety query', queryParams: '{"keyword":"bike or safety"}', imagePath: '.' },
];

class SampleQueryContainer extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData();
  }

  render() {
    const { queries } = this.props;
    let content = null;
    let fixedQuerySlides = null;

    if (queries && queries.length > 0) {
      fixedQuerySlides = queries.map((query, index) => (<div key={index}><SampleQueryItem query={query} /></div>));

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
    dispatch(setQueryList(sampleQueryList));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SampleQueryContainer
    )
  );

