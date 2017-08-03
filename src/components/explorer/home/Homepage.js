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
import { DEFAULT_COLLECTION_OBJECT } from '../../../lib/explorerUtil';

const localMessages = {
  title: { id: 'explorer.intro.title', defaultMessage: 'Explorer' },
  subtitle: { id: 'explorer.intro.subtitle', defaultMessage: 'Welcome to the Media Cloud Explorer' },
  summary: { id: 'explorer.intro.summary', defaultMessage: 'Get a quick overview of how your topic of interest is covered by digital news media.' },
  description: { id: 'explorer.intro.description', defaultMessage: 'Dashboard is an open-source, web-based interface that allows you to run a search on any topic of your interest over one or more news sources, and over acustom time range. It allows you to retrieve stories matching your query, along with a series of outputs such as attention graphs, word clouds, and sentence and story examples.' },
  loginTitle: { id: 'explorer.intro.login.title', defaultMessage: 'Have an Account? Login Now' },
};

const Homepage = (props) => {
  const { user, onKeywordSearch } = props;
  let sideBarContent;
  if (!user.isLoggedIn) {
    sideBarContent = (
      <Grid>
        <Row>
          <Col md={7}>
            <h1><FormattedMessage {...localMessages.subtitle} /></h1>
            <h2><FormattedMessage {...localMessages.summary} /></h2>
            <p><FormattedMessage {...localMessages.description} /></p>
          </Col>
          <Col md={5}>
            <DataCard>
              <h2><FormattedMessage {...localMessages.loginTitle} /></h2>
              <LoginForm />
            </DataCard>
          </Col>
        </Row>
      </Grid>
    );
  }
  return (
    <div>
      <Grid>
        <Row>
          <Col lg={12}>
            <SearchForm onSearch={val => onKeywordSearch(val, user)} user={user} />
          </Col>
        </Row>
      </Grid>
      <SampleSearchContainer />
      {sideBarContent}
    </div>
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
    const collection = JSON.stringify(DEFAULT_COLLECTION_OBJECT);
    // why bother sending this? const sources = '[]';
    const defParams = `[{"q":"${values.keyword}","startDate":"${dateObj.start}","endDate":"${dateObj.end}","collections":${collection}}]`;
    const demoParams = `[{"q":"${values.keyword}"}]`;

    if (hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN)) {
      urlParamString = `search/${defParams}`;
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
