const config = Object.assign({}, require('../chimp.config.js'), {
  webdriverio: {
    deprecationWarnings: false,
    waitforTimeout: 70000,
    desiredCapabilities: {
      chromeOptions: {
        args: ['headless', 'disable-gpu']
      },
      isHeadless: true
    }
  }
})

module.exports = config
