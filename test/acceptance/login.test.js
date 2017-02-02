import config from '../../config/test.config';
import visit from '../helpers/visit';

describe('When visiting the log in page', () => {

	beforeAll(function(done) {
		jasmine.DEFAULT_TIMEOUT_INTERVAL=30000;
		done();
	});

  test('it logs user in', async() => {
  	let result = await visit('/#/login')
  					  .type('.login-form input[type=text]', config.username)
  					  .type('.login-form input[type=password]', config.password)
  					  .click('.login-form .app-button button')
  					  .wait('#content h1 span')
  					  .evaluate(() => document.querySelector('#content h1 span').innerText)
  					  .end();

  	expect(result).toBe('Media Cloud Sources and Collections');
  });
});
