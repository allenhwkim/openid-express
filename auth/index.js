const { Issuer, custom } = require('openid-client');

const { getDomain, initialize, session, requireAuth } = require('./middleware');
const routes = require('./routes');
const { serialize, deserialize } = require('./session');

custom.setHttpOptionsDefaults({
  headers: {
    'User-Agent': 'PostmanRuntime/7.26.5'
  },

  hooks: {
    beforeRequest: [
      (options) => {
        const { method, url, headers, body, form } = optoins;
        console.log('>>>>> Request', { method, url, headers, body: body || form });
      }, 
    ], 
    afterResponse: [
      (response) => {
        const { statusCode, headers, body } = response;
        const { method, url } = response.request.options;

        console.log('<<<<< Response', method, url, statusCode, headers, body);
        return response;
      },
    ],
  },
})


module.exports = {
  getDomain, initialize, session, requireAuth,
  routes,
  serialize, deserialize,
}