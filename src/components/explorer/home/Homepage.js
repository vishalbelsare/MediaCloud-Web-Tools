import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import LoginForm from '../../user/LoginForm';
import SearchForm from './SearchForm';
import SampleSearchContainer from './SampleSearchContainer';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';

const localMessages = {
  title: { id: 'explorer.intro.title', defaultMessage: 'Explorer' },
  loginTitle: { id: 'explorer.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const Homepage = (props) => {
  const { user, onKeywordSearch } = props;
  let sideBarContent;

  if (!user.isLoggedIn) {
    sideBarContent = (
      <DataCard>
        <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
        <LoginForm />
      </DataCard>
    );
  }
  return (
    <Grid>
      <Row>
        <Col lg={12}>
          <SearchForm onSearch={onKeywordSearch} user={user} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <SampleSearchContainer />
        </Col>
      </Row>
      {sideBarContent}
    </Grid>
  );
};

Homepage.propTypes = {
  intl: React.PropTypes.object.isRequired,
  // from context
  location: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,       // params from router
  onKeywordSearch: React.PropTypes.func.isRequired,
  // from state
  user: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  onKeywordSearch: (values, user) => {
    let urlParamString = null;
    // use default dates, collection, sources
    const dateObj = getPastTwoWeeksDateRange();
    const collection = '[8875027]';
    // why bother sending this? const sources = '[]';
    const defParams = `[{"q":"${values.keyword}","startDate":"${dateObj.start}","endDate":"${dateObj.end}","collections":${collection}}]`;
    const demoParams = `[{"q":"${values.keyword}"}]`;

    if (hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN)) {
      urlParamString = `demo/search/${defParams}`;
    } else {
      urlParamString = `demo/search/${demoParams}`;
    }
    dispatch(push(`/queries/${urlParamString}`));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      Homepage
    )
  );
