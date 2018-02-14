import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid } from 'react-flexbox-grid/lib';
import Word2VecTimespanPlayerContainer from './Word2VecTimespanPlayerContainer';
import WordCloudComparisonContainer from './WordCloudComparisonContainer';

function InfluentialWordsContainer() {
  return (
    <Grid>
      <WordCloudComparisonContainer />
      <Word2VecTimespanPlayerContainer />
    </Grid>
  );
}

InfluentialWordsContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    InfluentialWordsContainer
  );
