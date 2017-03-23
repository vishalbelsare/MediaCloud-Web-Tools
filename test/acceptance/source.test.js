import config from '../../config/test.config';
import visit from '../helpers/visit';

describe('When searching for "Boston" in search bar', () => {

	beforeAll(function(done) {
		jasmine.DEFAULT_TIMEOUT_INTERVAL=20000;
		done();
	});

  test('it suggests "Boston Globe"', async() => {
  	let result = await visit('/#/home')
              .type('.login-form input[type=text]', config.username)
              .type('.login-form input[type=password]', config.password)
              .click('.login-form .app-button button')
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

  beforeAll(function(done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL=40000;
    done();
  });

  test('it links to Media Cloud sources', async() => {
    let mediaCloudHeader = 'Collections';
    let result = await visit('/#/home')
              .type('.login-form input[type=text]', config.username)
              .type('.login-form input[type=password]', config.password)
              .click('.login-form .app-button button')
              .wait('#sources-drawer-button')
              .click('#sources-drawer-button')
              .wait('#media-cloud-collections') 
              .click('#media-cloud-collections')  
              .wait('.collection-list h2')
              .evaluate(() => document.querySelector('.collection-list h2').innerText)
              .end();
    expect(result).toBe(mediaCloudHeader);
  });

  test('it links to Global Voices', async() => {
    let globalVoicesHeader = 'Global Voices Countries';
    let result = await visit('/#/home')
              .type('.login-form input[type=text]', config.username)
              .type('.login-form input[type=password]', config.password)
              .click('.login-form .app-button button')
              .wait('#sources-drawer-button')
              .click('#sources-drawer-button')
              .wait('#global-voices-collections') 
              .click('#global-voices-collections')  
              .wait('.collection-list h2')
              .evaluate(() => document.querySelector('.collection-list h2').innerText)
              .end();
    expect(result).toBe(globalVoicesHeader);
  });

  test('it links to European Monitor', async() => {
    let europeMediaMonitorHeader = 'Europe Media Monitor Countries';
    let result = await visit('/#/home')
              .type('.login-form input[type=text]', config.username)
              .type('.login-form input[type=password]', config.password)
              .click('.login-form .app-button button')
              .wait('#sources-drawer-button')
              .click('#sources-drawer-button')
              .wait('#european-media-monitor-collections') 
              .click('#european-media-monitor-collections')  
              .wait('.collection-list h2')
              .evaluate(() => document.querySelector('.collection-list h2').innerText)
              .end();
    expect(result).toBe(europeMediaMonitorHeader);
  });
});