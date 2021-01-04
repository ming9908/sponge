import Router from 'koa-router';
import * as advCtrl from './adv.ctrl';

const adv = new Router();

adv.get("/", advCtrl.advList);
adv.post("/", advCtrl.advInfo);
adv.get("/:to_day", advCtrl.overdate);

export default adv;