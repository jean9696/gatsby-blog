---
path: "/blog/puppeteer"
date: "2019-07-04"
title: "React E2E testing with Puppeteer in CI"
---
When we work on a project we want to code **fast**, to be *agile*. Thus, we focus on features, sometime we do refactoring but I confess that tests are often forgotten. However, it comes a time when the codebase is so big that a little change can break the whole application and it can become scary to push new code to production.

A solution could have been testing every single react component in our codebase to reach the goal of 100% of test coverage but we didn’t want to unit test our 1000 components which could change at anytime (remember, we’re agiles 🐇).

The best alternative we’ve found at [habx](https://www.habx.com) has been to integrate puppeteer’s tests in our CI. As Puppeteer is using chrome headless, it’s perfectly working in a docker environment that are available in CI. Thus, our tests are ran every time we push to a branch, for different roles and in **parallel** ! This article will explain how we stabilize this testing process.

# Setting up environments

First we need to be able to run puppeteer and user actions in a test environment. This is already done by *smooth-code* with [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) . So the basic config is as following.
<br/><br/>
##### jest-puppeteer.config.js (at root folder)
```js
module.exports = {
 launch: {
   headless: true, // you can change that if you want to see what you're doing
   args: [
     '--no-sandbox',
     '--disable-setuid-sandbox',
     '--disable-gpu',
     '--disable-dev-shm-usage',
     '--disable-web-security',
   ],
 },
}
```
<br/>and in your jest config ⬇
<br/><br/>
##### package.json for example
```json
{
  ...
   "jest": {
    "preset": "jest-puppeteer",
     ...
    },
  ...
}
```

<br/>**Easy as that !** 👍<br/><br/>

Now for the CI, puppeteer needs some dependencies so we add them in the Dockerfile we use.<br/><br/>

##### Dockerfile to use in CI
```dockerfile
FROM node:8-slim
USER root

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-unstable'})
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install puppeteer so it's available in the container.
RUN npm i puppeteer

ENTRYPOINT ["dumb-init", "--"]
CMD ["google-chrome-unstable"]
USER root
```
<br/>At habx we usDockerfile to use in CIe [CircleCI](https://circleci.com) for our continuous integration but this example should work with other CIs (it works with [drone](https://drone.io/) 🤖)
<br/>So here is hour circle CI job
<br/><br/>
##### .circleci/config.yml
```yaml
test-puppeteer:
 docker:
   - image: jean9696/drone-puppeteer
     name: puppeteer
 steps:
   - attach_workspace:
       at: /root/
   - run:
       command: |
         # Run a nginx server with our built app inside
         apt-get update || true
         apt-get -y install nginx
         sed -i 's/root.*/root \/root\/project\/build\/;/' /etc/nginx/sites-enabled/default
         nginx -c /etc/nginx/nginx.conf
         chmod -R a+rx /root/
         npm run test
 ```

(NB: don’t forget to use `--runInBand` jest option as it is recommended by jest-puppeteer)

Now we have our test environment set up. *What’s next ?*


# Tests setup

Ok! So now we can run a headless chrome in local and in the CI but our app is private, it needs **authentication**. For now habx is using JWT to authentificate its users, so let’s generate it for our test users ! Thus, we need to configure a [jest global setup file](https://jestjs.io/docs/en/configuration#globalsetup-string) that do that for each test suits.

```js
/* here the var page is globally injected by the jest-puppeteer preset to call puppeteer actions */
beforeAll(async () => {
 jest.setTimeout(30000) // good to have since scenariis can take time 
 await page.setRequestInterception(true) // we enable puppeteer to intercept network request
 const generatedJwt = generateJwt()
 // Now at all request we make, we add the authenficated jwt
 await page.on('request', request => { 
   const headers = Object.assign({}, request.headers(), {
     Authorization: `${generatedJwt}`,
     cookie: `jwt=${generatedJwt};`,
   })
   // We don't want to send useless data from our test environement so since we are here, we abort our request if it has nothing to do with our app, otherwise we send the request
   if (request.url().includes('hotjar') || request.url().includes('segment')) {
     request.abort()
   } else {
     request.continue({ headers })
   }
 })
})
```

Great ! Now we can use our app correctly. But what if something is wrong with the server ? We need to log that…
So we add the following code (BTW, if you know a better way to log in jest, please tell us !).

```js
page.on('pageerror', err => console.log('Page Error: ', err))
page.on('error', err => console.log('Error: ', err))
```

Now we’re good to go !

# Making our life easier

With the previous config we can already test our app properly. We just added small pieces of code in order to help use doing them. Here they are:

## Knowing if we are in test mode

It’s good to know if we’re in test mode to optimize our tests speed. For instance, if you have a modal on which you can click only after the animation of 500ms, your test will either have to wait or fail. We can just tell our app that we are in test mode with puppeteer by adding the following code in the `beforeAll` of our *globalSetup*

```js
// You can use this function if you want to pass other informations to your app
const windowSet = (name, value) =>
 page.evaluateOnNewDocument(`
   Object.defineProperty(window, '${name}', {
     get() {
       return '${value}'
     }
   })
 `)
await windowSet('puppeteer', true)
```

Now in our global style we can add (or anything else if you are not using styled-component)

```js

import { createGlobalStyle, css } from 'styled-components'
const GlobalStyle = createGlobalStyle`
 ${({ isTest }) =>
   isTest &&
   css`
     * {
       transition: none !important;
       animation: none !important;
     }
     #_hjRemoteVarsFrame {
       display: none !important;
     }
   `}}
`
```
```jsx
<GlobalStyle isTest={window.puppeteer} />
```

## Use directly react-router 

Why changing browser url when we can just use react-router function ?
To do so we just need to expose react router in our app (if in test mode 😉)

```js
window.__router__ = this.props.history // react-router history prop
```

And then in our tests

```js
export const goTo = async (path) => {
 await page.evaluate(`
   (function goTo() {
      if (window.__router__) {
         window.__router__.push('${path}');
      } else {
         setTimeout(goTo, 200);
      }
    })()
 `)
}
```

## Wait for graphql response

As our app is fetching data on a graphqlAPI, it’s better sometime to wait until we get a response from a mutation before we test if a element is present for exemple. We can check if the response has pass through the network by checking graphql operation name§ 

```js
export const waitForResponse = (operationName, { variablesProperties = [], timeout } = {}) =>
 new Promise(resolve => {
   const handleResponse = response => {
     if (response.status() === 200) {
       try {
         const request = JSON.parse(response.request().postData())
         if (
           operationName === request.operationName &&
           variablesProperties.reduce(
             (context, property) => context && Object.keys(request.variables).includes(property),
             true
           )
         ) {
           page.removeListener('response', handleResponse)
           resolve(response)
           clearTimeout(timeoutHandler)
         }
       } catch (e) {}
     }
   }
   const defaultTimeout = timeout || 2000
   const timeoutHandler = setTimeout(() => {
     console.info(
       `Timeout: Unable to fetch response for ${operationName} ${variablesProperties.length > 0 &&
       `with ${variablesProperties.join(', ')}`} (${defaultTimeout})`
     )
     resolve()
   }, defaultTimeout)
   page.on('response', handleResponse)
 })
 ```
 
## Selectors
 
CSS selectors can be hard to write, especially when you use library such as styled-component which generate class names at every build. To simplify that, we add a data attribute called *data-testid* (the same used in [react-testing-library](https://github.com/testing-library/react-testing-library)) and we select our element based on that.

```js
export const selector = (identifier, { raw = false }= {}) =>
 raw ? identifier : `*[data-testid=${identifier}]`
```

## Small tests

Since every action of a test can be a failure, our tests are as small as possible in order to be able to know what is really failing and what is still working. We try to break our tests in smaller tests as much as possible.

## Testing for multiple roles

Todo ?

# Conclusion

Puppeteer helped us many times, avoiding to push code that would have break the app. Tests are made with real data which is a really good points for corner cases that we can’t predice. In addition, these tests often help us when we do refactoring client side but also server side because the tests are calling real apis that can be breaking for tests.
