import visit from '../../helpers/visit';
import login from '../../helpers/login';

describe('From the topics public home page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  test('the user can see a title listing public topics', async () => {
    const result = await visit('/#/home')
              .wait('#content h1')
              .exists('.topic-preview-list')
              .end();
    expect(result).toBe(true);
  });

  test('the user can see a login form', async () => {
    const result = await visit('/#/home')
              .wait('#content h1')
              .exists('.login-form')
              .end();
    expect(result).toBe(true);
  });
});
