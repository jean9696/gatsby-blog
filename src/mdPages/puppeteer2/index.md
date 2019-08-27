---
path: "/blog/puppeteer2"
date: "2019-08-12"
title: "React E2E testing with Puppeteer in CI - Part 2"
---

If you have read the first part of *React E2E testing with Puppeteer in CI*, you have set up your tests. Now we want to make our tests efficients and scalable ! ☺️
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

As our app is fetching data on a graphqlAPI, it’s better sometime to wait until we get a response from a mutation before we test if a element is present for exemple. We can check if the response has pass through the network by checking graphql operation name

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

## Multiple roles in parallel

At Habx we have a notion of **roles**. An admin can see everything but other users cannot edit some of our data. We want to make sure that our tools work for all of them.
To make that simple, we added a little function to *jest*
```js
global.test.if = (condition, name, fn, timeout) => {
  (condition ? test : test.skip)(name, fn, timeout)
}
global.test.ifRoles = (roles = [], name, fn, timeout) =>
  test.if(roles.includes(process.env.HABX_ROLE), name, fn, timeout)
```

With this in the jest setup config, we can call the `test.ifRoles([...roles])` function to skip test if the user is not even allow to interact with what we are testing.

But now we need to run as many tests as we have users roles... But we will do in in parallel !<br/>
You need to configure your circleCI job with [parallelism](https://circleci.com/docs/2.0/parallelism-faster-jobs/) with as many tests as you want.
Then what we'll do is to have a *role* for each run of test

```js
switch (process.env.CIRCLE_NODE_INDEX) {
  case '0':
    process.env['ROLE'] = 'admin'
    break
  case '1':
    process.env['ROLE'] = 'user'
    break
  case '2':
    process.env['ROLE'] = 'super-user'
    break
  default:
    break
}
```
Now that you have the environment variable you can manage to connect your user with the role or whatever you want 😇
## Small tests

Since every action of a test can be a failure, our tests are as small as possible in order to be able to know what is really failing and what is still working. We try to break our tests in smaller tests as much as possible.

# Conclusion

It's been 6 months now that we use Puppeteer tests in our CI at Habx. Now we could say that our tests are stable thanks to all of theses little tricks and rules that avoid false positives. 🥳
