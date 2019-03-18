'use strict';

const Controller = require('egg').Controller;
const cheerio = require("cheerio");
const querystring = require("querystring");
class GoodsController extends Controller {
  async getDetail(){
  	const {ctx,app} =this;
	if(!ctx.params.goods_id)return ctx.fail(401,"参数错误:goods_id");
	var goods_id=ctx.params.goods_id;
	try{
		var html_str = await app.httpUtil({
  			method:"get",
	  		url:"/goods-"+goods_id+".html"
	  	});

    }catch(err){
    	// console.log("err",err.response);
    	var $ = cheerio.load(err.response.data);
    	return ctx.fail(err.response.status,$('#page h1').text()?$('#page h1').text():err.message);
    }
  	var crawler_host = this.app.config.crawler_host;

  	var result={};
  	// console.log(html_str);
  	var $ = cheerio.load(html_str)
  	if($(".thumb").attr("style")){
  		// result
  		var goods_img = $(".thumb").attr("style").match(/http(.*)\'/g);
  			if(goods_img){
  				goods_img=goods_img[0].replace("'","");
  			}
  		result.goods_img=goods_img;
  	}
	result.goods_name=$(".mn .tt").text();
	result.sale_status=$(".mn .tag-c2").text();
	console.log($(".mn .price").text());
	if($(".mn .price").text().match(/\d+/g)){
		result.goods_min_price = $(".mn .price").text().match(/\d+/g)[0];
	}
	// result.goods_price_type = $(".mn .price").text().match(/\d+/g);
	result.show_time = $("#show .info_center em").eq(0).text();
	var show_time_arr = result.show_time.split(/\s+/g);
	result.show_time = show_time_arr[0]+' '+show_time_arr[2];
	// result.goods_img=$(".thumb").css("backgroundImage").replace(/url\(\"/,"").replace(/\"\)/,"")
	result.changguan={};
	result.changguan.name = $("#show .info_center").eq(1).find("em a").text();
	result.changguan.href = $("#show .info_center").eq(1).find("em a").attr("href");
	result.changguan.id = result.changguan.href.match(/-\d+-/g)
	if(result.changguan.id){
		result.changguan.id = result.changguan.id[0].replace(/-/g,"");
	}
	result.price_arr=$("#show .pricebox").text().replace(/\s+/g,"").split(/\//).map((item)=>item.match(/\d+/g)?item.match(/\d+/g)[0]:"").filter((item)=>item);
	result.xunyan_citys=[];
	var dom_lis = $(".info_xuyan ul li");
	for(var i=0;i<dom_lis.length;i++){
		var obj={};
			obj.city=dom_lis.eq(i).find("a .xya").text();
			obj.show_time =dom_lis.eq(i).find(".xyb").text();
			// console.log(obj.show_time);	
			obj.goods_id = dom_lis.eq(i).find('a').attr("href");
			obj.goods_id = obj.goods_id.match(/-\d+/g);
			if(obj.goods_id){
				obj.goods_id=obj.goods_id[0].replace("-","")
			}
			obj.show_time = obj.show_time.replace(/[\u4e00-\u9fa5]+/g,"");
		result.xunyan_citys.push(obj);
	}
	result.buy_xuzhi = [];
	var dom_lis = $("#details ul li");
	for(var i=0;i<dom_lis.length;i++){
		result.buy_xuzhi.push(dom_lis.eq(i).text());
	}
	result.yanchu_detail={};
	result.yanchu_detail.summary=$(".info_dottm h3").text();

	// pricebox.
	return ctx.success(result);
  }
  async getGoodsInfo(){
  	const {ctx,app} =this;
	if(!ctx.params.goods_id)return ctx.fail(401,"参数错误:goods_id");
	var goods_id=ctx.params.goods_id;
	try{
		var html_str = await app.httpUtil({
  			method:"get",
	  		url:"/detail-infor.php?id="+goods_id
	  	});

    }catch(err){
    	// console.log("err",err.response);
    	var $ = cheerio.load(err.response.data);
    	return ctx.fail(err.response.status,$('#page h1').text()?$('#page h1').text():err.message);
    }
    var result={};
    var $ = cheerio.load(html_str)
     result.title=$(".biaoti").text();	
   	result.content=[];
   	var dom_ps = $(".detail-con p ");
   	for(var i=0;i<dom_ps.length;i++){
   		var obj={}
   		if(dom_ps.eq(i).find('img')[0]){
			obj.img_url = dom_ps.eq(i).find('img').attr("src");
   		}else{
   			obj.text= dom_ps.eq(i).text();
   		}
   		result.content.push(obj);
   	}
   
    return ctx.success(result)

  }
  /*
	5:演唱会
	4：音乐会
	6：话剧
	358：相声曲艺
	372：体育赛事
	371：儿童亲子
  */
  // 场馆；brandlist
  // 咨询：article_cat-18.html
  // 
  async getListByCateId(){
  	const {ctx,app}  =this;
  	const query = ctx.query;
  	if(!query.cate_id) return ctx.fail(401,"参数错误cate_id");
	var page= query.page||1;  	
	var limit= query.limit||10;
	var city = query.city; //
	var query_obj={
		act:'ajax',
		id:query.cate_id
	}

	var crawler_host = app.config.crawler_host;
	var serverCookie = ctx.headers.cookie;
	if(query.city){
		query_obj.c=query.city;
		if(query.time_id){
			query_obj.time_id=query.time_id;
		}

		// var res = await 
		// ?id=358&c=zhengzhou&time_id=0&act=ajax
		var res = 	await app.mRequest
					   .set("Cookie",serverCookie)
					   .post(crawler_host+"/citytype.php?"+querystring.stringify(query_obj))
					   .type('form')
					   .send({
					   	last:(page-1)*limit,
						amount:limit,
					   })
		if(!res.text) return ctx.success([]);

		// ctx.body=goods_list;
	}else{
		var res = 	await app.mRequest
							   .set("Cookie",serverCookie)
							   .post(crawler_host+"/categorys.php?"+querystring.stringify(query_obj))
							   .type('form')
							   .send({
							   	last:(page-1)*limit,
								amount:limit,
							   })
		// console.log(res.text);
		// ctx.body=res.text;
		if(!res.text) return ctx.success([]);
	}
	var result=[];
	var goods_list =JSON.parse(res.text);
	for(var i=0;i<goods_list.length;i++){
		var $ =cheerio.load(goods_list[i].info);
		var obj={};
		obj.goods_img = $(".goods_images img").attr("src");
		obj.goods_id = $(".goods_images a").attr("href").match(/\d+/g);
		if(obj.goods_id){
			obj.goods_id=obj.goods_id[0]
		}
		obj.goods_name = $(".item dl dt").text();
		var show_time =  $(".item dl dd p").eq(0).text();
			if(show_time.match(/\d+/)){
				obj.show_time= show_time.slice(3);
			}else{
				obj.show_time= show_time.slice(3);
			}
		obj.changguan_name= $(".item dl dd p").eq(1).text().slice(3);
		obj.goods_price= $(".item dl dd p").eq(2).text().slice(3);
		result.push(obj);
	}
	ctx.success(result);
  }
   async getShowAddrs(){
	const {ctx,app}  =this;
	const crawler_host = app.config.crawler_host;
	const serverCookie = ctx.headers.cookie;
	const query = ctx.query;
  	var res = 	await app.mRequest
						   .set("Cookie",serverCookie)
						   .get(crawler_host+"/category-5.html")

	// console.log(res.text);
	var $= res.$;
	var dom_lis = $(".sear-div ul li");
	var result=[];	
	for(var i=0;i<dom_lis.length;i++){
		var obj={
			city_name:dom_lis.eq(i).find("a").text(),
		}
		var href = dom_lis.eq(i).find("a").attr("href");
		obj.en_name = href.match(/c=[a-z]+/g)
		if(obj.en_name){
			obj.en_name=obj.en_name[0].replace("c=","");
		}
		result.push(obj)
	}
	ctx.success(result);						   
  }
  async getGoodsCates(){
	const {ctx,app}  =this;
	const crawler_host = app.config.crawler_host;
	const serverCookie = ctx.headers.cookie;
	const query = ctx.query;
  	var res = 	await app.mRequest
						   .set("Cookie",serverCookie)
						   .get(crawler_host+"/category-5.html")
	var $= res.$;
	var dom_a = $(".sear-div").eq(1).find("ul li a");
	// https://m.huanghepiao.com/citytype.php?id=358&c=zhengzhou
	var result=[];	
	for(var i=0;i<dom_a.length;i++){
		var obj={
			cate_name:dom_a.eq(i).text(),
		}
		var href = dom_a.eq(i).attr("href");
		obj.cate_id = href.match(/\d+/g)
		if(obj.cate_id){
			obj.cate_id=obj.cate_id[0]
		}
		result.push(obj)
	}
	ctx.success(result);
  }
  async collect(){
	const {ctx,app}  =this;
	const crawler_host = app.config.crawler_host;
	const serverCookie = ctx.headers.cookie;
	const query = ctx.query;
	if(!query.goods_id) return ctx.fail(401,'参数错误goods_id');
	 var query_obj={
	 	act:'collect',
	 	id:query.goods_id
	 }
	var res = 	await app.mRequest
						   .set("Cookie",serverCookie)
						   .get(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
	// var $= res.$;
	res.text=JSON.parse(res.text);
	ctx.success(res.text.message);
  }
  async showCollects(){ //查看收藏夹列表；
	const {ctx,app}  =this;
	const crawler_host = app.config.crawler_host;
	const serverCookie = ctx.headers.cookie;
	var query = ctx.query;
		query.page=query.page||1;
	var query_obj={
		 	act:'collection_list',
		 	page:query.page
	}
	var res = 	await app.mRequest
						   .set("Cookie",serverCookie)
						   .get(crawler_host+"/hhpuser.php?"+querystring.stringify(query_obj))
	var $ = res.$;
	var result=[];
	var dom_dls = $(".shouchang dl");
	for(var i=0;i<dom_dls.length;i++){
		var obj={}
		obj.goods_img=dom_dls.eq(i).find("dt img").attr("src");
		obj.goods_id=dom_dls.eq(i).find("dd a").attr("href").match(/\d+/g);
		if(obj.goods_id){
			obj.goods_id=obj.goods_id[0];
		}
		obj.goods_name =dom_dls.eq(i).find("dd a p").eq(0).text();
		obj.changguan_name =dom_dls.eq(i).find("dd a p").eq(1).text();
		obj.show_time =dom_dls.eq(i).find("dd a p").eq(2).text();
		obj.goods_price=dom_dls.eq(i).find("dd strong").text();
		result.push(obj);
	}
	// ctx.body=res.text;
	ctx.success(result);
  }
  /*
	const {ctx,app}  =this;
	const query = ctx.query;
	if(!query.cate_id) return ctx.fail(401,"参数错误cate_id");
	var page= query.page||1;  	
	var limit= query.limit||10;
	var city = query.city; //
	var query_obj={
	act:'ajax',
	id:query.cate_id,
	c:'guangzhou'
	}
	if(query.city){
	query_obj.c=query.city;
	}
	if(query.time_id){ 
	query_obj.time_id=query.time_id;
	}
	console.log(query_obj);
	var crawler_host = app.config.crawler_host;
	var serverCookie = ctx.headers.cookie;
	// citytype.php?id=4&c=zhengzhou&time_id=0&act=ajax
	var res = 	await app.mRequest
					   .set("Cookie",serverCookie)
					   .post(crawler_host+"/citytype.php?"+querystring.stringify(query_obj))
					   .type('form')
					   .send({
					   	last:(page-1)*limit,
						amount:limit,
					   })
	console.log(res.text);
	ctx.body=res.text;
  */
  //收藏商品
  collectGoods(){

  }
  // https://m.huanghepiao.com/hhpuser.php?act=collect&id=5471&1552706453702702
}

module.exports =GoodsController;