import visit from '../helpers/visit';
import login from '../helpers/login';

describe('From the sources home page...', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  test('the user can log in', async () => {
    const result = await visit('/#/home')
              .use(login)
              .wait('.datacard.favorite-sources-collections')
              .evaluate(() => document.querySelector('.datacard.favorite-sources-collections h2').innerText)
              .end();

    expect(result).toBe('My Starred Items');
  });

  test('the user can log out', async () => {
    const result = await visit('/#/home')
              .use(login)
              .wait('.user-menu button')
              .touchTap('.user-menu button')
              .wait('#user-logout')
              .touchTap('#user-logout')
              .wait('h2 span')
              .evaluate(() => document.querySelector('h2 span').innerText)
              .end();

    expect(result).toBe('Login');
  });
});

describe('When searching for "Boston" in search bar', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    done();
  });

  test('it suggests "Boston Globe"', async () => {
    const result = await visit('/#/home')
              .use(login)
              .wait('.source-search input')
              .type('.source-search input', 'Boston')
              .evaluate(() => document.querySelector('.source-search input').focus())
              .wait('#searchResult15')
              .evaluate(() => document.querySelector('#searchResult15').innerText)
              .end();
    expect(result.trim()).toBe('The Boston Globe');
  });
});

describe('After opening drawer', () => {
  beforeAll((done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
    done();
  });

  test('it links to Media Cloud sources', async () => {
    const mediaCloudHeader = 'Collections';
    const result = await visit('/#/home')
              .use(login)
              .wait('#sources-drawer-button')
              .touchTap('#sources-drawer-button')
              .wait('#media-cloud-collections')
              .touchTap('#media-cloud-collections')
              .wait('.collection-list h2')
              .evaluate(() => document.querySelector('.collection-list h2').innerText)
              .end();
    expect(result).toBe(mediaCloudHeader);
  });

  test('it links to Global Voices', async () => {
    const globalVoicesHeader = 'Global Voices Countries';
    const result = await visit('/#/home')
              .use(login)
              .wait('#sources-drawer-button')
              .touchTap('#sources-drawer-button')
              .wait('#global-voices-collections')
              .touchTap('#global-voices-collections')
              .wait('.collection-list h2')
              .evaluate(() => document.querySelector('.collection-list h2').innerText)
              .end();
    expect(result).toBe(globalVoicesHeader);
  });

  test('it links to European Monitor', async () => {
    const europeMediaMonitorHeader = 'Europe Media Monitor Countries';
    const result = await visit('/#/home')
              .use(login)
              .wait('#sources-drawer-button')
              .touchTap('#sources-drawer-button')
              .wait('#european-media-monitor-collections')
              .touchTap('#european-media-monitor-collections')
              .wait('.collection-list h2')
              .evaluate(() => document.querySelector('.collection-list h2').innerText)
              .end();
    expect(result).toBe(europeMediaMonitorHeader);
  });
});
