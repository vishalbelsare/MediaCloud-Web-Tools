import Nightmare from 'nightmare';
import nightmareInlineDownload from 'nightmare-inline-download';
import visit from '../../helpers/visit';
import login from '../../helpers/login';
import { WRITEABLE_TOPIC_ID } from '../../helpers/topics';
import { SENTENCES_OVER_TIME_CHART } from '../../helpers/dom';

nightmareInlineDownload(Nightmare);

describe('From a write-allowed topic page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5 * 60 * 1000;
    done();
  });

  test('the user can download topic top stories', async () => {
    const downloadedItem = await
              visit(`/#/topics/${WRITEABLE_TOPIC_ID}/summary`)
              .use(login)
              .wait(SENTENCES_OVER_TIME_CHART)
              .touchTap('.topic-summary-top-stories .action-icon-menu button')
              .wait('#topic-summary-top-stories-download')
              .exists('#topic-summary-top-stories-download')
              .touchTap('#topic-summary-top-stories-download')
              .download();

    expect(downloadedItem).toEqual(expect.anything());
  });
});
