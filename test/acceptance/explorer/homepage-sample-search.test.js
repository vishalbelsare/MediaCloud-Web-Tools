import visit from '../../helpers/visit';
import { SUBMIT_BUTTON, inputNamed } from '../../helpers/dom';

describe('From the explorer home page the user selects a sample search', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  test('the user can selects a sample search', async () => {
    const result = await visit(`/#/home`)
      .wait('.sample-searches')
      .exists('.sample-search-item')
      .click('.sample-search-item a[href="#/queries/demo/0"]')
      .wait('.query-builder')
      .exists('.query-picker')
      .exists('.query-picker-item')
      .exists('query-form-wrapper')
      .evaluate(() => document.querySelector('.query-picker-item').innerText)
      .end();
    expect(result).toContain("clinton");
  });

  test('the user can view sentence counts', async () => {
    const result = await visit(`/#/queries/demo/0`)
      .wait('.sentences-over-time-chart')
      .exists('.sentences-over-time-chart')
      .end();
    expect(result).toBe(true);
  });

  test('the user can view story table', async () => {
    const result = await visit(`/#/queries/demo/0`)
      .wait('.story-table')
      .exists('.story-table')
      .end();
    expect(result).toBe(true);
  });

  test('the user can view story counts', async () => {
    const result = await visit(`/#/queries/demo/0`)
      .wait('.bubble-chart-story-total')
      .exists('.bubble-chart-story-total')
      .end();
    expect(result).toBe(true);
  });

  test('the user can view geo data', async () => {
    const result = await visit(`/#/queries/demo/0`)
      .wait('.geo-mini-cards')
      .exists('.geo-mini-cards')
      .end();
    expect(result).toBe(true);
  });
});
