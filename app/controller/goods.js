'use strict';

const Controller = require('egg').Controller;
const cheerio = require("cheerio");

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
  getListByCateId(){

  }
  //收藏商品
  collectGoods(){

  }
  // https://m.huanghepiao.com/hhpuser.php?act=collect&id=5471&1552706453702702
}

module.exports =GoodsController;