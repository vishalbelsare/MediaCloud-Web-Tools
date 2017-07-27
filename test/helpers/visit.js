import nightmare from 'nightmare'
import url from 'url'

const BASE_URL = url.format({
  protocol : process.env.PROTOCOL || 'http',
  hostname : process.env.HOST || 'www.localhost',
  port     : process.env.PORT || 5000
})

const DEBUG = process.env.DEBUG || false

export default function (path='', query={}) {
  const location = url.resolve(BASE_URL, path)

  /* add custom actions here */
  nightmare.action('touchTap', function(selector, done) {
  	this.evaluate_now((selector) => {
  		var t = new Touch({
		    identifier: Date.now(),
		    target: document.querySelector(selector),
		    clientX: 100,
		    clientY: 100,
		    radiusX: 2.5,
		    radiusY: 2.5,
		    rotationAngle: 10,
		    force: 0.5,
		  });

		  var touchEvent = new TouchEvent('touchend', {
		    cancelable: true,
		    bubbles: true,
		    touches: [t],
		    targetTouches: [],
		    changedTouches: [t],
		    shiftKey: true,
		  });

		  document.querySelector(selector).dispatchEvent(touchEvent);
  	}, done, selector);
  });

  /* Create new nightmare instance */
  const page = nightmare({
    show: true,
    pollInterval: 50
  })

  return page.goto(location)
}
