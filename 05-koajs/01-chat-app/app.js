const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve) => {
    app.on('message', (msg) => {
      resolve(msg);
    });
  });
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  if (!message) {
    ctx.throw(400, 'required field `message` missing');
  }
  app.emit('message', message);
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
