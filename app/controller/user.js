'use strict';

const Controller = require('egg').Controller;
const cheerio = require("cheerio");
// const cookie = require("cookie");
var FormData = require('form-data');
const superagent = require("superagent");
const querystring = require("qs");
class UserController extends Controller {
  async login(){
  	const {ctx,app} = this;
  	const query = ctx.query;
  	var body = await new Promise((resolve)=>{
			superagent.post('https://m.huanghepiao.com/hhpuser.php')
		        .type('form')
		        .send({
		            username: query.username,
					password: query.password,
					act: 'act_login',
					back_act: './index.php',
					remember: 1
		        })
		        .end(function(err, res) {
		            if (err) {
		            	console.log(err);
		                // handleErr(err.message);
		                return;
		            }
		            var cookie = res.header['set-cookie']; //从response中得到cookie
		            // console.log(cookie);
		            resolve({
		            	cookie:cookie,
		            	res
		            });
		            // ctx.set("set-cookie",cookie.join(";"));
		            // emitter.emit("setCookeie");
		        });
  			
  		})

  	ctx.set("set-cookie",body.cookie);
  	var $ = cheerio.load(body.res.text);
  	console.log($('.tishimain').text());
	if($('.tishimain').text()=='登录成功'){
		ctx.success(1,$('.tishimain').text())
	}else{
		ctx.fail(401,$('.tishimain').text())
	}
	

  }
  // login?username=13680684951&password=123
  async logout(){
  	// ECS[user_id]=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; Max-Age=0; path=/
  	const {app,ctx} = this;
  	// console.log(app.request);
  	 // https://m.huanghepiao.com/hhpuser.php?act=logout
  	 var crawler_host = app.config.crawler_host;
	try{
	 var serverCookie = ctx.headers.cookie;
	 // console.log(serverCookie);
	 var query_obj={
	 	act:'logout',
	 }

	 var res = 	await app.mRequest
					   .get(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
					   .set("Cookie",serverCookie)
	}catch(err){
		console.log(err);
	}
	// console.log(res);
	var $ = res.$;
	if($(".tishimain").text().indexOf("成功")){
		this.ctx.set("set-cookie",res.headers['set-cookie']); //清空cookie：
		ctx.success($(".tishimain").text());
	}else{
		ctx.fail(401,$(".tishimain").text())
	}

	// ctx.body=1111;

  }
  showMy(){
	
  }
  register(){
  	return this.ctx.fail(401,"暂不做！");
  }
}

module.exports = UserController;