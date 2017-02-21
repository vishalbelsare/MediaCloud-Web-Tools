import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import SourceControlBar from './controlbar/SourceControlBar';
import Permissioned from '../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../lib/auth';

const PageWrapper = (props) => {
  const { children, goToAdvancedSearch } = props;
  return (
    <div>
      <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
        <SourceControlBar onAdvancedSearchSelected={goToAdvancedSearch} />
      </Permissioned>
      {children}
    </div>
  );
};

PageWrapper.propTypes = {
  children: React.PropTypes.node,
  goToAdvancedSearch: React.PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  goToAdvancedSearch: (values) => {
    if (values.toLowerCase() !== 'advanced search') {
      dispatch(push(`/search?search=${values}`));
    } else {
      dispatch(push('/search?search='));
    }
  },
});

export default
  injectIntl(
    connect(null, mapDispatchToProps)(
      PageWrapper
    ),
  );
