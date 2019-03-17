'use strict';

const Controller = require('egg').Controller;
const cheerio = require("cheerio");
const querystring = require("qs");
class OrderController extends Controller {
  async add(){

  }
 //不传获取全部;
 //100  待付款，
 // 101待发货
 // 105 待收货
 // 102 已完成
  async getList(){
  	// hhpuser.php?act=order_list&composite_status=100

  	//status 
	const {app,ctx} = this;
	const query = ctx.query;
	const page = query.page||1;
	const limit = query.limit||10;
	// console.log(app.mRequest)
	// return;
	var crawler_host = app.config.crawler_host;
	try{
	 console.log("orderlist",crawler_host+"/hhpuser.php?act=order_list&composite_status="+query.status);
	 var serverCookie = ctx.headers.cookie;
	 // console.log(serverCookie);
	 var query_obj={
	 	act:'ajax_order_list',
	 }
	 // if(query.status){
	 // 	query_obj.composite_status=query.status;
	 // }
	 var res = 	await app.mRequest
					   .post(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
					   .set("Cookie",serverCookie)
					   .type('form')
					   .send({
				            composite_status: query.status?query.status:-1,
							last: (page-1)*limit,
							amount: limit,
				        })
					   // .type('form')
		   
	}catch(err){
		console.log(err);
		return ctx.fail(401,err);	
	}
	// console.log(res);
	console.log(app.isJSON(res.text));
	// if(!app.isJSON(res.text) && ){
	// 	return ctx.fail(401,res.text);
	// }

	try{
		var order_infos=JSON.parse(res.text);
	}catch(err){
		return ctx.fail(401,err.message);
	}

	if(!order_infos) return ctx.success(0,[]);
	// console.log(order_infos);
	// var $ = cheerio.load(order_infos)
	var result=[];
	for(var i=0;i<order_infos.length;i++){
		// console.log(order_infos[i].info);
		var $ = cheerio.load(order_infos[i].info) 
		var status_text = $("h2 strong").text();
		var status_arr = status_text.split(/\s+/g);
		var obj={
			order_status:status_arr[0],
			pay_status:status_arr[1],
			logisti_status:status_arr[2],
		};
		var count_price= $(".pic").text().match(/\d+/g);
		var href = $("h2").next("a").attr("href");
		var order_id = href.match(/\d+/g);
		if(order_id){
			obj.order_id=order_id[0];
		}
		if(count_price){
			obj.goods_count=count_price[0];
			obj.order_price=count_price[1];
		}
		obj.order_list_goods=[];
		var order_list_goods_dom =$(".order_list_goods dl");
		for(var i=0;i<order_list_goods_dom.length;i++){
			var goods_obj={};
			goods_obj.goods_img =order_list_goods_dom.eq(i).find("dt img").attr("src");;
			goods_obj.goods_name = order_list_goods_dom.eq(i).find(".name strong").text();
			var str_arr= order_list_goods_dom.eq(i).find(".name span").text().split("\n").filter((item)=>item=item.trim()).map((item)=>item.trim())
			// var 
			// console.log(str);
			goods_obj.show_time=str_arr.shift().split(/[^\d]:/g)[1];
			goods_obj.attrs=str_arr.join(";")
			goods_obj.goods_count = $(".pice").text().match(/\d+/g);
			if(goods_obj.goods_count){
				goods_obj.goods_price = goods_obj.goods_count[0];
				goods_obj.goods_count = goods_obj.goods_count[1];
			}
			obj.order_list_goods.push(goods_obj);
		}
		result.push(obj);
	}
	ctx.success(result);
	// console.log(res);
	// https://m.huanghepiao.com/hhpuser.php?act=ajax_order_list
	// ctx.body=res.text;
  }
  async getDetail(){ //获取订单详情；
  	const {ctx,app} = this;
  	try{
  	 var query=ctx.query;
	 console.log("orderlist",crawler_host+"/hhpuser.php?act=order_list&composite_status="+query.status);
	 var serverCookie = ctx.headers.cookie;
	 // console.log(serverCookie);

	 var query_obj={
	 	act:'order_detail',
	 	order_id:query.order_id
	 };
	 // if(query.status){
	 // 	query_obj.composite_status=query.status;
	 // }
	 	var crawler_host = app.config.crawler_host;
	 var res = 	await app.mRequest
					   .get(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
					   .set("Cookie",serverCookie)
					  //  .type('form')
					  //  .send({
				   //          composite_status: query.status?query.status:-1,
							// last: (page-1)*limit,
							// amount: limit,
				   //      })
					   // .type('form')
		   
	}catch(err){
		console.log(err);
		return ctx.fail(401,err);	
	}
	var $ = res.$;
	var result={};
	result.order_status = $(".order_zhifu dl dd span").eq(0).text().split(/：/g)[1];
	result.receiver={};
	var user_info =$(".information dd span").text().split(/\s+/g)
	result.receiver.receiver_name=user_info[2];
	result.receiver.mobile_phone=user_info[3];
	result.receiver.address=$(".information dd p").text().replace(/\s+/g,"").split(/:/g)[1]
	result.order_sn = $(".navContent ul li").eq(0).text().replace(/\s+/g,"").split(/:/g)[1]
	result.distri_mode= $(".navContent ul li").eq(1).text().replace(/\s+/g,"").split(/:/g)[1]
	result.payment= $(".navContent ul li").eq(2).text().replace(/\s+/g,"").split(/:/g)[1]
	var price_arr= $(".jiage").text().replace(/\s+/g,"").match(/\d+\.\d+/g)
	result.order_price= price_arr[0];
	result.order_yingfu_price= price_arr[1];
	result.goods_list=[];
	var dl_doms = $(".good_list dl");
	for(var i =0;i<dl_doms.length;i++){
		var obj={};
		obj.goods_img = dl_doms.eq(i).find("dt img").attr("src");
		obj.goods_name = dl_doms.eq(i).find(".good_name strong").text();
		var str_arr= dl_doms.eq(i).find(".good_name span").text().split("\n").filter((item)=>item=item.trim()).map((item)=>item.trim())
		// console.log(str);
		obj.show_time=str_arr.shift().split(/[^\d]:/g)[1];
		obj.attrs=str_arr.join(";")
		obj.goods_count = $(".good_pice").text().match(/\d+/g);
		if(obj.goods_count){
			obj.goods_price = obj.goods_count[0];
			obj.goods_count = obj.goods_count[1];
		}
		result.goods_list.push(obj);
	}
	// good_list
	ctx.success(result,"ok");


  }
}

module.exports=OrderController;





