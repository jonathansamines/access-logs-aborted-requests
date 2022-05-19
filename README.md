# access-logs-aborted-requests
A sandbox to play around access logs implementation behavior around aborted requests

## Express server

```js
node server.js
```

### Morgan

#### Completed request

Log is correct

```bash
::ffff:127.0.0.1 - - [Thu, 19 May 2022 15:21:46 GMT] "GET /immediate HTTP/1.1" 500 18 "-" "-"
```

#### Aborted request

Log is correct but response time is not included

```bash
::ffff:127.0.0.1 - - [Thu, 19 May 2022 14:57:24 GMT] "GET /delayed HTTP/1.1" - - "-" "-"
```

### pino-http

### Completed request

Log is correct

```bash
{"level":30,"time":1652973706067,"pid":4030,"hostname":"codespaces-0f9e76","req":{"id":2,"method":"GET","url":"/immediate","query":{},"params":{},"headers":{"host":"127.0.0.1:4000","connection":"close"},"remoteAddress":"::ffff:127.0.0.1","remotePort":43018},"res":{"statusCode":500,"headers":{"x-powered-by":"Express","content-type":"application/json; charset=utf-8","content-length":"18","etag":"W/\"12-+eLe/Is4e/DsYM51R9etEfeL+TE\""}},"err":{"type":"Error","message":"failed with status code 500","stack":"Error: failed with status code 500\n    at ServerResponse.onResFinished (/workspaces/access-logs-aborted-requests/node_modules/pino-http/logger.js:107:40)\n    at ServerResponse.emit (node:events:538:35)\n    at onFinish (node:_http_outgoing:830:10)\n    at callback (node:internal/streams/writable:552:21)\n    at afterWrite (node:internal/streams/writable:497:5)\n    at afterWriteTick (node:internal/streams/writable:484:10)\n    at processTicksAndRejections (node:internal/process/task_queues:82:21)"},"responseTime":4,"msg":"request errored"}
```

#### Aborted request

Log is not even generated

```bash
-
```

## Hapi server

```js
node hapi-server.js
```

### hapi-pino

#### Completed request

Log is correct

```bash
{"level":30,"time":1652973536836,"pid":2728,"hostname":"codespaces-0f9e76","req":{"id":"1652973536834:codespaces-0f9e76:2728:l3d5qt36:10003","method":"get","url":"/immediate","headers":{"host":"127.0.0.1:4000","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":42740},"res":{"statusCode":500,"headers":{"content-type":"application/json; charset=utf-8","cache-control":"no-cache","content-length":18}},"responseTime":2,"msg":"[response] get /immediate 500 (2ms)"}
```

#### Aborted request

Log is incorrect. Status code is included as `200` in both `msg` and `res.statusCode`, even when the request was aborted.

```bash
{"level":30,"time":1652973536840,"pid":2728,"hostname":"codespaces-0f9e76","req":{"id":"1652973536834:codespaces-0f9e76:2728:l3d5qt36:10002","method":"get","url":"/delayed","headers":{"host":"127.0.0.1:4000","connection":"close"},"remoteAddress":"127.0.0.1","remotePort":42738},"res":{"statusCode":200,"headers":{}},"responseTime":6,"msg":"[response] get /delayed 200 (6ms)"}
```