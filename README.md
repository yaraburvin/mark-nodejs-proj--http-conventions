# HTTP Conventions

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's [technical curriculum for **The Mark**](https://github.com/WeAreAcademy/curriculum-mark). All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

Now you've built a working server, we'll start adding some common conventions on top of them - focusing on status codes and request types.

## Learning Outcomes

- Use conventions on HTTP request types
- Use conventions on HTTP status codes
- Use a route parameter in Express
- Use JSend formatting
- Send JSON body data with Postman
- Handle JSON body data with Express (including middleware)

Make sure you do the reading in Exercise 0 _before_ you look at this project code - parts of it will be very cryptic without it.

## Exercise 0: Conventions in request types and status codes

### HTTP request types

It is common to think about CRUD actions when interacting with a server (and, later, a database):

- **C**reate
- **R**ead
- **U**pdate
- **D**elete

for example:

- hatching a digipet is _creating_ something (a 'resource')
- viewing a digipet's stats is _reading_ a resource
- feeding your digipet is _updating_ a resource
- rehoming your digipet is _deleting_ a resource

We've been exclusively making `GET` requests and defining corresponding `app.get` route handlers - instead, we're going to start pairing up the intended CRUD action to the commonly associated HTTP request type:

| Action | Request type | Example |
| --- | --- | --- |
| Create | POST | POST `/todos` to create a new todo |
| Read | GET | GET `/todos` to view all todos; GET `/todos/4` to get todo #4 |
| Update | PUT\* | PUT `/todos/4` to update todo #4 |
| Delete | DELETE | DELETE `/todos/4` to delete todo #4 |

\*either a PUT or a PATCH can be used to update. They have slightly different semantics, but we'll set those aside for now and exclusively use PUT for the sake of simplicity.

More reading: [https://restfulapi.net/http-methods/](HTTP methods)

### HTTP status codes

When we send a response from our server, it has a numerical status code attached.

In Express, this defaults to `200` - but [there are lots more to choose from](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

We don't need to learn all of these, but here are some ones that are more common
- [`200` (OK)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200)
- [`201` (Created)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201)
- [`400` (Bad Request)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400)
- [`404` (Not Found)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) - the classic

And, one which is pretty rare:
- [`418` (I'm a teapot)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418) - yes, really

Most of the time, we will be using `200` (there's a good reason for it to be the Express default), but we will be more explicit about this and occasionally dip into other status codes.

### JSON response structure: JSend

We could send back our JSON data in any particular structure we want.

For example, in response to a `GET /todos`, here are some possible JSON responses:

```json
[
  { "text": "Buy some milk" },
  { "text": "Solve the P versus NP problem" }
]
```

```json
{
  "message": "Showing all todos",
  "data": [
    { "text": "Buy some milk" },
    { "text": "Solve the P versus NP problem" }
  ]
}
```

```json
{
  "report": "Successfully fetched 2 todos",
  "metadata": {
    "time": 104
  },
  "fetched": {
    "todos": [
      { "text": "Buy some milk" },
      { "text": "Solve the P versus NP problem" }
    ]
  }
}
```

```json
{
  "errors": [],
  "data": {
    "resource": "todos",
    "content": [
      { "text": "Buy some milk" },
      { "text": "Solve the P versus NP problem" }
    ]
  }
}
```

Some formatting guidelines and conventions have emerged, with the most popular being a specification called [JSON:API](https://jsonapi.org/) - but it's pretty meaty and overkill for the small APIs which we're building...!

Instead, for learning purposes, we'll use the simpler (if less popular) [JSend specification](https://github.com/omniti-labs/jsend), which would prescribe:


```json
{
  "status": "success",
  "data": {
    "todos": [
      { "text": "Buy some milk" },
      { "text": "Solve the P versus NP problem" }
    ]
  }
}
```

### Conventions vs requirements

You don't _have_ to use any of these conventions - it is perfectly possible to write a server which performs CRUD operations without using conventional HTTP request types, status codes or JSON response specifications.

(This is exactly what we did with our digipet backend - exclusively GET requests, and exclusively `200` status codes by default.)

However, writing our server by following conventions will make it much easier for others to work with it.


## Tasks

- Read SO post: [https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- test endpoint status code
- make PUT /signatures/:epoch pass
- write tests for DELETE /signatures:epoch
