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

## Exercise 0: Request types and status codes

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

## Tasks

- Read SO post: [https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- test endpoint status code
- make PUT /signatures/:epoch pass
- write tests for DELETE /signatures:epoch
