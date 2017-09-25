import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { schemeCategory10 } from 'd3';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import DataCard from '../../common/DataCard';
import LoginForm from '../../user/LoginForm';
import SearchForm from './SearchForm';
import SampleSearchContainer from './SampleSearchContainer';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DEFAULT_COLLECTION_OBJECT_ARRAY, generateQueryParamString, autoMagicQueryLabel } from '../../../lib/explorerUtil';

const localMessages = {
  title: { id: 'explorer.intro.title', defaultMessage: 'Explorer' },
  subtitle: { id: 'explorer.intro.subtitle', defaultMessage: 'Welcome to the Media Cloud Explorer' },
  summary: { id: 'explorer.intro.summary', defaultMessage: 'Get a quick overview of how your topic of interest is covered by digital news media.' },
  description: { id: 'explorer.intro.description', defaultMessage: 'Explorer is an open-source, web-based interface that allows you to run a search on any topic of your interest over one or more news sources, and over a custom time range. It allows you to retrieve stories matching your query, along with a series of outputs such as attention graphs, word clouds, and sentence and story examples.' },
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
    let urlParamString;
    if (hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN)) {
      const defaultDates = getPastTwoWeeksDateRange();
      const queries = [{
        q: values.keyword,
        startDate: defaultDates.start,
        endDate: defaultDates.end,
        color: schemeCategory10[0],
        collections: DEFAULT_COLLECTION_OBJECT_ARRAY,
        sources: [],
      }];
      queries[0].label = autoMagicQueryLabel(queries[0]);
      const queryStr = generateQueryParamString(queries);
      urlParamString = `search/${queryStr}`;
    } else {
      const queryStr = `[{"q":"${encodeURIComponent(values.keyword)}"}]`;
      urlParamString = `demo/search/${queryStr}`;
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
