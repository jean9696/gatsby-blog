---
path: "/blog/micro-graphql-schema"
date: "2019-08-26"
title: "Client managing micro Graphql services with Apollo"
---

**GraphQL** now takes a big part in the industry as well as **micro-services** architecture which is also becoming a reference. Now, the usual way of dealing with these two ideas is to have a single endpoint where clients can fetch data from different services. However, this requires to have a service that merge all the schemas of the all the micro-services to be able to serve them to the client by one single graphql endpoint.

At Habx, we didn't want to have a specific service for that so we use another way that worked but could be weird at first: the **client** is charge of fetching the right data from the right service.

## The usual way

The usal way of dealing with graphql micro services is to have one service that make requests to the other services

<div style="padding: 32px">
    <img src="./usual.png" alt="schema-usual-way"/>
</div> 


## Without hub service

In our case, each client is responsible for its data fetching meaning that for each request, the client has to know where it should query.
<div style="padding: 32px">
    <img src="./weird.png" alt="schema-weird way"/>
</div> 

#### Why no hub service ?

- Avoid single point of *failure* ❌
- Reduce request *time* ⏱
- Reduce architecture *cost* 💰
- Services are totally *standalone* 👍

## How to manage this architecture client side with Apollo client ?

Apollo client lets us building the `ApolloClient` class with [links](https://www.apollographql.com/docs/link/) and we can **compose** them
Then you can use the context of Apollo to redirect your request and specify which service to request.

Like this:

```js
const { data, loading } = useQuery(viewerQuery, {
    context: {
      api: 'crm',
    },
  })
```
To do so, we created a factory 🏭
```js
const buildLinks = links =>
  reduce(
    links,
    (acc, link, apiName) => {
      if (!acc) {
        return link
      }

      return split(
        operation => operation.getContext().api === apiName,
        link,
        acc
      )
    },
    undefined
  )
```

And we list all of our services

```js
const links = {
    housings: createHttpLink({
      uri: config.get('api.serviceHousings'),
      credentials: defaultCredentials,
    }),
    crm: createHttpLink({
      uri: config.get('api.serviceCRM'),
      credentials: defaultCredentials,
    }),
    projects: createHttpLink({
      uri: config.get('api.serviceProjects'),
      credentials: defaultCredentials,
    }),
    ...
  }
```
<br/>And finally we can create the `ApolloClient` 🎉<br/><br/>
```js
  new ApolloClient({
    link: buildLinks(links),
    cache: new InMemoryCache(),
  })
```

## Conclusion

This method of data fetching can be discussed but it allows every service to be standalone and developers can do what they want without breaking other services.  
