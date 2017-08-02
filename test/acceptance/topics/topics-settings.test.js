import visit from '../../helpers/visit';
import login from '../../helpers/login';
import { WRITEABLE_TOPIC_ID } from '../../helpers/topics';
import { SUBMIT_BUTTON, SENTENCES_OVER_TIME_CHART, inputNamed } from '../../helpers/dom';

// NOT DONE YET!

describe('From a write-allowed topic page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  test('the user can change topic settings', async () => {
    const result = await visit(`/#/topics/${WRITEABLE_TOPIC_ID}/summary`)
              .use(login)
              .wait(SENTENCES_OVER_TIME_CHART)
              .touchTap('.modify-topic button')
              .wait('.modify-topic-dialog-content') // the popup modal
              .click('#modify-topic-settings b')
              .wait('form.create-topic')
              .insert(inputNamed('description'),
                `Dig into coverage of about the US common core educational standard from mainstream media sources between 2013 - 2015 (${Math.random()})`)
              .click(SUBMIT_BUTTON)
              .wait('.content')
              .exists('.content')
              .end();
    expect(result).toBe(true);
  });
});
