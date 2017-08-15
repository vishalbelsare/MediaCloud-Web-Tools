import visit from '../../helpers/visit';
import login from '../../helpers/login';
import { pathToSampleSearchQueryPage, SAMPLE_SEARCH_US_ELECTION } from '../../helpers/explorer';

describe('From the explorer home page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  test('the user can log in', async () => {
    const result = await visit('/#/login')
              .use(login)
              .wait('.sample-searches')
              .exists('.sample-search-item')
              .evaluate(() => document.querySelector('.sample-search-item').innerText)
              .end();
    expect(result).toContain('Clinton');
  });

  test('the user is redirected to LoggedInQueryBuilder page after log in', async () => {
    const result = await visit(pathToSampleSearchQueryPage(SAMPLE_SEARCH_US_ELECTION))
              .use(login)
              .wait('.sample-searches')
              .exists('.sample-search-item')
              .end();
    expect(result).toBe(true);
  });

  test('the user can log out', async () => {
    const result = await visit('/#/home')
              .use(login)
              .wait('.user-menu button')
              .touchTap('.user-menu button')
              .wait('#user-logout')
              .touchTap('#user-logout')
              .wait('h1 span')
              .evaluate(() => document.querySelector('h1 span').innerText)
              .end();

    expect(result).toBe('Explorer');
  });
});
