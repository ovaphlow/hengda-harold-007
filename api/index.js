const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const logger = require('../../hengda-harold/dispatcher/util/bunyan');
const postgres = require('../../hengda-harold/dispatcher/util/postgres');

const app = new Koa();

app.env = 'production';

app.use(bodyParser());

const router = new Router({
  prefix: '/api/ledger/07',
});

router.get('/:id', async (ctx) => {
  const cnx = await postgres.connect();
  try {
    const sql = `
    select * from harold.ledger07 where id = $1 limit 1
    `;
    const result = await cnx.query(sql, [parseInt(ctx.params.id, 10)]);
    ctx.response.body = !!result.rows.length ? result.rows[0] : {};
  } catch (err) {
    logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
    ctx.response.status = 500;
  }
});

router.put('/:id', async (ctx) => {
  const cnx = await postgres.connect();
  try {
    const sql = `
    update harold.ledger07
    set date1 = $1,
        paishui = $2::jsonb,
        date2 = $3,
        huifu = $4::jsonb
    where id = $5
    `;
    await cnx.query(sql, [
      ctx.request.body.date1,
      JSON.stringify({
        train: ctx.request.body.train1,
        rail: ctx.request.body.rail1,
        operator: ctx.request.body.operator1,
        leader: ctx.request.body.leader1,
        qc: ctx.request.body.qc1,
      }),
      ctx.request.body.date2,
      JSON.stringify({
        train: ctx.request.body.train2,
        rail: ctx.request.body.rail2,
        operator: ctx.request.body.operator2,
        leader: ctx.request.body.leader2,
        qc: ctx.request.body.qc2,
      }),
      parseInt(ctx.params.id, 10),
    ]);
    ctx.response.status = 200;
  } catch (err) {
    logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
    ctx.response.status = 500;
  }
});

router.delete('/:id', async (ctx) => {
  const cnx = await postgres.connect();
  try {
    const sql = `
    delete from harold.ledger07 where id = $1
    `;
    await cnx.query(sql, [parseInt(ctx.params.id, 10)]);
    ctx.response.status = 200;
  } catch (err) {
    logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
    ctx.response.status = 500;
  }
});

router.put('/', async (ctx) => {
  const cnx = await postgres.connect();
  try {
    let sql = `
    select * from harold.ledger07
    `;
    let result = [];
    const option = ctx.request.query.option || '';
    switch (option) {
      case '':
        sql += `
        limit 100
        `;
        result = await cnx.query(sql);
        break;
      case 'filter':
        sql += `
        where date1 between $1 and $2
            or date2 between $1 and $2
        limit 100
        `;
        result = await cnx.query(sql, [
          ctx.request.body.date1,
          ctx.request.body.date2,
        ]);
        break;
      case 'review':
        sql += `
        where paishui->'qc' = '""'
            or huifu->'qc' = '""'
        limit 100
        `;
        result = await cnx.query(sql);
        break;
      default:
        ctx.response.body = result;
    }
    ctx.response.body = result.rows;
  } catch (err) {
    logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
    ctx.response.status = 500;
  }
});

router.post('/', async (ctx) => {
  const cnx = await postgres.connect();
  try {
    const sql = `
    insert into harold.ledger07
        (date1, paishui, date2, huifu)
    values
        ($1, $2::jsonb, $3, $4::jsonb)
    `;
    await cnx.query(sql, [
      ctx.request.body.date1,
      JSON.stringify({
        train: ctx.request.body.train1,
        rail: ctx.request.body.rail1,
        operator: ctx.request.body.operator1,
        leader: ctx.request.body.leader1,
        qc: ctx.request.body.qc1,
      }),
      ctx.request.body.date2,
      JSON.stringify({
        train: ctx.request.body.train2,
        rail: ctx.request.body.rail2,
        operator: ctx.request.body.operator2,
        leader: ctx.request.body.leader2,
        qc: ctx.request.body.qc2,
      }),
    ]);
    ctx.response.status = 200;
  } catch (err) {
    logger.error(`--> ${ctx.request.method} ${ctx.request.url} ${err}`);
    ctx.response.status = 500;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
