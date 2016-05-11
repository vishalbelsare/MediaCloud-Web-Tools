import React from 'react';
import { injectIntl } from 'react-intl';
import Paper from 'material-ui/Paper';

const ControversyTopStories = (props) => {
  const { stories } = props;
  return (
    <Paper>
    Stories 
    </Paper>
  );
};

ControversyTopStories.propTypes = {
  stories: React.PropTypes.array.isRequired,
  intl: React.PropTypes.object.isRequired,
};

export default injectIntl(ControversyTopStories);
