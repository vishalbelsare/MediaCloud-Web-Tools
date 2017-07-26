import visit from '../../helpers/visit';
import login from '../../helpers/login';
import { TOPIC_ID_CLIMATE_CHANGE, TOPIC_ID_COMMON_CORE } from '../../helpers/topics';

describe('From the topics logged-in home page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  test('the user can see "modify topic" for one they have write permission for', async () => {
    const result = await visit('/#/home')
              .use(login)
              .wait('.topic-list-container')
              .click(`#topic-preview-${TOPIC_ID_CLIMATE_CHANGE} h2 a`)
              .wait('.controlbar-topic')
              .exists('.modify-topic')
              .end();
    expect(result).toBe(false);
  });

  test('the user can\'t see "modify topic" they have read permission for', async () => {
    const result = await visit('/#/home')
              .use(login)
              .wait('.topic-list-container')
              .click(`#topic-preview-${TOPIC_ID_COMMON_CORE} h2 a`)
              .wait('.controlbar-topic')
              .exists('.modify-topic')
              .end();
    expect(result).toBe(true);
  });
});
