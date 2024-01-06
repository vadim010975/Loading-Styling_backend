const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors')
const { koaBody } = require('koa-body');
const { data } = require('./data.js');
const slow = require('koa-slow');

const app = new Koa;

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(cors());

app.use(slow({
  url: /\/films\/new$/i,
  delay: 3000
}));

const Router = require('koa-router');
const router = new Router();

router.get('/films/new', async (ctx, next) => {
  const response = data.map(el => {
    return {
      content: el.content,
      img: el.img,
      date: Date.now(),
    }
  });
  ctx.response.body = JSON.stringify(response);
});

app.use(router.routes()).use(router.allowedMethods());

const port = 7070;

const server = http.createServer(app.callback());

server.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Server is listening to ' + port);
});
