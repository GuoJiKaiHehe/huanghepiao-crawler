const Controller = require('egg').Controller;
const cheerio = require("cheerio");
const moment = require("moment");
const querystring = require("querystring");
class AddressController extends Controller {
	async getList(){
		const {app,ctx} = this;
		const query = ctx.query;
		
		var crawler_host = app.config.crawler_host;
		try{
		 var serverCookie = ctx.headers.cookie;
		 // console.log(serverCookie);
		 var query_obj={
		 	act:'address_list',
		 }
		 // if(query.status){
		 // 	query_obj.composite_status=query.status;
		 // }
		 var res = 	await app.mRequest
						   .set("Cookie",serverCookie)
						   .get(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
						   
						   // .type('form')
			   
		}catch(err){
			console.log(err);
			return ctx.fail(401,err);	
		}
		console.log(res.text);
		var $ = res.$;
		var list = $(".address_add");
		var result=[];
		for(var i=0;i<list.length;i++){
			if(list.eq(i).find("dl dt strong").text().trim()){
				var obj={};
				obj.receiver_name= list.eq(i).find("dl dt strong").text().trim()
				obj.address=list.eq(i).find("dl dd").text();
				obj.address_id= list.eq(i).find(".address_bottom .add_r a").attr("href").match(/\d+/)[0];
				// obj.
				result.push(obj);	
			}
		}
		ctx.body=result;

	}
	async del(){
		const {app,ctx} = this;
		const query = ctx.query;
		
		var crawler_host = app.config.crawler_host;
		try{
		 var serverCookie = ctx.headers.cookie;
		 // console.log(serverCookie);
		 var query_obj={
		 	act:'drop_consignee',
		 	id:query.id
		 }
		 // if(query.status){
		 // 	query_obj.composite_status=query.status;
		 // }
		 var res = 	await app.mRequest
						   .set("Cookie",serverCookie)
						   .get(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
						   
						   // .type('form')
			   
		}catch(err){
			console.log(err);
			return ctx.fail(401,err);	
		}
		// console.log(res.text);
		var $ = res.$;
		if($(".tishimain")[0]){
			return ctx.fail(401,$(".tishimain").text());
		}
		ctx.success(0,"删除成功！");
	}
	// 1省  2城市， 3区， 4乡村
	async getCityCascade(){ //城市练级；
		// selProvinces
		const {app,ctx} = this;
		const query = ctx.query;
		
		var crawler_host = app.config.crawler_host;
		try{
		 var serverCookie = ctx.headers.cookie;
		 // console.log(serverCookie);
		 var query_obj={
		 	act:'address',
		 }
		 // if(query.status){
		 // 	query_obj.composite_status=query.status;
		 // }
		 query.type = query.type||1;
		 if(query.type>4) return ctx.fail(401,"type参数错误");
		 if(query.type==1){
			 var res = 	await app.mRequest
							   .set("Cookie",serverCookie)
							   .get(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
			// console.log(res.text);
			var $ = res.$;
			var option_list = $('#selProvinces option');
			var sheng =[];
			for(var i=1;i<option_list.length;i++){
				sheng.push({
					region_name:option_list.eq(i).text(),
					region_id:option_list.eq(i).attr("value")
				})
			}
			return ctx.success(sheng);
		 }else{
			if(!query.parent_id) return ctx.fail(401,"参数错误:parent_id");
			 var query_obj={
			 	act:'selCities',
			 	type:query.type,
			 	parent:query.parent_id
			 }
			 var res = 	await app.mRequest
				   .set("Cookie",serverCookie)
				   .get(crawler_host+"/region.php?"+querystring.stringify(query_obj))

			// ctx.success(res.text);
			var regions = JSON.parse(res.text).regions;
			ctx.success(regions)
		 }	   
		}catch(err){
			console.log(err);
			return ctx.fail(401,err);	
		}
	}
	add(){

	}
}

module.exports=AddressController;