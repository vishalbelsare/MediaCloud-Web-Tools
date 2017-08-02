import visit from '../../helpers/visit';
import login from '../../helpers/login';
import { WRITEABLE_TOPIC_ID } from '../../helpers/topics';
import { SUBMIT_BUTTON, SENTENCES_OVER_TIME_CHART, inputNamed, textareaNamed } from '../../helpers/dom';

describe('From the write-allower topic page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  test('the user can enter the subtopic manager', async () => {
    const result = await visit(`/#/topics/${WRITEABLE_TOPIC_ID}/summary`)
      .use(login)
      .wait(SENTENCES_OVER_TIME_CHART)
      .touchTap('.modify-topic button')
      .wait('.modify-topic-dialog-content') // show the popup modal
      .click('#modify-topic-subtopics b')
      .wait('.manage-focal-sets')           // list of subtopic sets
      .click('#create-foci-button a')       // click to create a subtopic
      .wait('.focus-builder-wizard')        // on the first step
      .wait('.focal-technique-selector')
      .click('#technique-boolean-query .app-icon-keyword-search') // click keyword search
      .click(SUBMIT_BUTTON)                 // 1 - submit technique selection (step 1)
      .wait('.focus-create-edit')
      .insert(inputNamed('keywords'), 'bananas')
      .click('#keyword-search-preview-button')
      .wait(SENTENCES_OVER_TIME_CHART)
      .click(SUBMIT_BUTTON)                 // 2 - submit technique configuration (step 3)
      .exists('form.focus-create-details')
      .insert(inputNamed('focusName'), 'TEST - bananas')
      .insert(textareaNamed('focusDescription'), 'TEST - stories about bananas')
      .touchTap('div[name="focalSetDefinitionId"] button')
      .touchTap('div[role="menu"] span[role="menuitem"]')
      .screenshot('1.png')
      .click(SUBMIT_BUTTON)                 // 3 - submit technique description (step 3)
      .wait('form.focus-confirm')
      .click(SUBMIT_BUTTON)                 // create the subtopic
      .wait('.manage-focal-sets')           // back on "manage subtopics page"
      .exists('.focus-definition')          // need to check a bananas one is there...
      .end();
    expect(result).toBe(true);
  });
});
