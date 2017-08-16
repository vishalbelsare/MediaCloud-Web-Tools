import visit from '../../helpers/visit';
import login from '../../helpers/login';
import { WRITEABLE_TOPIC_ID, pathToTopicSummaryPage } from '../../helpers/topics';

describe('From the topics home page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    done();
  });

  test('the user can log in and Personal Topic list', async () => {
    const result = await visit('/#/login')
              .use(login)
              .wait('.topic-list-container')
              .evaluate(() => document.querySelector('#content h2').innerText)
              .end();
    expect(result).toBe('Personal Topics');
  });

  test('the user is redirected to topic summary page after log in', async () => {
    const result = await visit(pathToTopicSummaryPage(WRITEABLE_TOPIC_ID))
              .use(login)
              .wait('.topic-summary')
              .exists('.topic-summary')
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

    expect(result).toBe('Explore Public Topics');
  });
});
