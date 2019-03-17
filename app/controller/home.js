'use strict';

const Controller = require('egg').Controller;
const cheerio = require("cheerio");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  searchGoods(){
    
  }
  searchRecStar(){// 搜搜推荐明星

  }
  async getAllGoods(){
    const {app,ctx} = this;
    // console.log('getAllGoods');
    // return;
    // var json_data = await app.httpUtil({
    //   method:"get",
    //   url:"/ss.php?wd="
    // });
    // console.log("fetch end")
    // json_data = json_data.abc;
    // console.log(json_data[0]);
    // return ctx.success(json_data);
  
    // var GoodsModel =ctx.model.Goods;
    // for(var i=0;i<json_data.length;i++){
    //     var row = await GoodsModel.findOne({
    //       goods_id: json_data[i].goods_id
    //     });
    //     if(!row){
    //       var goods = new GoodsModel(json_data[i]);
    //       var aff = await goods.save();
    //     }
    // }
    // return ctx.success(true);

  }
  async getBanners(){
  	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_li_a = $("#scrollimg ul li a");
  	var result=[];
	for(var i=0;i<dom_li_a.length;i++){
		var obj={};
		// console.log()
		var href=dom_li_a.eq(i).attr("href");
		obj.href=href.indexOf("http")==-1?(crawler_host+'/'+href):href
		obj.star_id=href.match(/-\d+/g)[0].replace("-","");
		var img_url=dom_li_a.eq(i).attr("src");
		obj.img_url=href.indexOf("http")==-1?(crawler_host+'/'+img_url):img_url;
		result.push(obj);
	}
  	ctx.success(result);
  }
  async getCates(){
  	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_li_a = $(".tubiao-logo li a");
  	var result=[];
	for(var i=0;i<dom_li_a.length;i++){
		var obj={};
		// console.log()
		var href=dom_li_a.eq(i).attr("href");
		obj.href=href.indexOf("http")==-1?(crawler_host+'/'+href):href
		var icon_url=dom_li_a.eq(i).attr("src");
		// console.log(href)
		// obj.cate_id=href.match(/-\d+/g)[0].replace("-","");
		obj.icon_url=href.indexOf("http")==-1?(crawler_host+'/'+icon_url):icon_url;
		obj.cate_name=dom_li_a.eq(i).find("div").text();
		result.push(obj);
	}
  		ctx.success(result);
  }
  async getHotPerforms(){
  	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_uls = $(".index_floor #scroll_hot  ul");
  	console.log(dom_uls.length);
  	var result=[];
	for(var i=0;i<dom_uls.length;i++){
		var obj={};
		// console.log()
		var dom_lis=  href=dom_uls.eq(i).find("li");
		for(var j=0;j<dom_lis.length;j++){
			var href = dom_lis.eq(j).find(".index_pro .products_kuang a").attr("href");
			// console.log(href);
			obj.href=href.indexOf("http")==-1?(crawler_host+'/'+href):href
			var img_url=dom_lis.eq(j).find(".index_pro .products_kuang a img").attr("src");
			obj.img_url=img_url;
			obj.goods_desc=dom_lis.eq(j).find("a").attr("title");
			obj.goods_id=href.match(/-\d+/g)[0].replace("-","");
			result.push(obj);
		}
	}
  	ctx.success(result);
  }
  async getRoadShows(){
	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_lis = $(".con1 ul li");
  	var result=[];
	for(var i=0;i<dom_lis.length;i++){
		var obj={};
		var href = dom_lis.eq(i).find("a").attr("href");
		obj.href=href.indexOf("http")==-1?(crawler_host+'/'+href):href
		obj.star_id=href.match(/-\d+/g)[0].replace("-","");
		var img_url = dom_lis.eq(i).find("a img").attr("src");
		obj.img_url = img_url.indexOf("http")==-1?(crawler_host+'/'+img_url):img_url
		obj.desc=dom_lis.eq(i).find("dl dt").text();
		result.push(obj);	
	}
  	ctx.success(result);
  }
  async getYanChanghuis(){//获取演唱会
	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_uls = $(".floor_body").eq(1).find("ul")
  	var result=[];
  	for(var i=0;i<dom_uls.length;i++){
  		var dom_lis = dom_uls.eq(i).find("li");
  		var obj={};
  		for(var j=0;j<dom_lis.length;j++){
  			var goods_href= dom_lis.eq(j).find(".products_kuang a").attr("href");
			var aa =goods_href.match(/-\d+/);
			if(aa){
				obj.goods_href=aa[0].replace("-","");
			}
			obj.img_url=dom_lis.eq(j).find(".products_kuang a img").attr("src");

			obj.goods_name=dom_lis.eq(j).find(".products_kuang a").attr("title");
			var t_str=dom_lis.eq(j).find(".price span").text();
			var time_arr=t_str.split(/\s+/g);
			obj.show_time=time_arr[0]+' '+time_arr[2];
			result.push(obj)

  		}
  	}
  	 ctx.success(result);
  }
  async getMusicales(){
	  	const {app,ctx} = this;
	  	var html_str = await app.httpUtil({
	  		method:"get",
	  		url:"/"
	  	});
	  	var crawler_host = this.app.config.crawler_host;

	  	// console.log(html_str);
	  	const $ = cheerio.load(html_str)
	  	var dom_uls = $(".floor_body").eq(3).find("ul")
	  	var result=[];
	  	for(var i=0;i<dom_uls.length;i++){
	  		var dom_lis = dom_uls.eq(i).find("li");
	  		var obj={};
	  		for(var j=0;j<dom_lis.length;j++){
	  			var goods_href= dom_lis.eq(j).find(".products_kuang a").attr("href");
				var aa =goods_href.match(/-\d+/);
				if(aa){
					obj.goods_href=aa[0].replace("-","");
				}
				obj.img_url=dom_lis.eq(j).find(".products_kuang a img").attr("src");

				obj.goods_name=dom_lis.eq(j).find(".products_kuang a").attr("title");
				var t_str=dom_lis.eq(j).find(".price span").text();
				var time_arr=t_str.split(/\s+/g);
				obj.show_time=time_arr[0]+' '+time_arr[2];
				result.push(obj)

	  		}
	  	}
	  	 ctx.success(result);
  }
  async getModernDramas(){
  	const {app,ctx} = this;
	  	var html_str = await app.httpUtil({
	  		method:"get",
	  		url:"/"
	  	});
	  	var crawler_host = this.app.config.crawler_host;

	  	// console.log(html_str);
	  	const $ = cheerio.load(html_str)
	  	var dom_uls = $(".floor_body").eq(5).find("ul")
	  	var result=[];
	  	for(var i=0;i<dom_uls.length;i++){
	  		var dom_lis = dom_uls.eq(i).find("li");
	  		var obj={};
	  		for(var j=0;j<dom_lis.length;j++){
	  			var goods_href= dom_lis.eq(j).find(".products_kuang a").attr("href");
				var aa =goods_href.match(/-\d+/);
				if(aa){
					obj.goods_href=aa[0].replace("-","");
				}
				obj.img_url=dom_lis.eq(j).find(".products_kuang a img").attr("src");

				obj.goods_name=dom_lis.eq(j).find(".products_kuang a").attr("title");
				var t_str=dom_lis.eq(j).find(".price span").text();
				var time_arr=t_str.split(/\s+/g);
				obj.show_time=time_arr[0]+' '+time_arr[2];
				result.push(obj)

	  		}
	  	}
	  	 ctx.success(result);
  }
  async getCrossTalks(){
  	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_uls = $(".floor_body").eq(7).find("ul")
  	var result=[];
  	for(var i=0;i<dom_uls.length;i++){
  		var dom_lis = dom_uls.eq(i).find("li");
  		var obj={};
  		for(var j=0;j<dom_lis.length;j++){
  			var goods_href= dom_lis.eq(j).find(".products_kuang a").attr("href");
			var aa =goods_href.match(/-\d+/);
			if(aa){
				obj.goods_href=aa[0].replace("-","");
			}
			obj.img_url=dom_lis.eq(j).find(".products_kuang a img").attr("src");

			obj.goods_name=dom_lis.eq(j).find(".products_kuang a").attr("title");
			var t_str=dom_lis.eq(j).find(".price span").text();
			var time_arr=t_str.split(/\s+/g);
			obj.show_time=time_arr[0]+' '+time_arr[2];
			result.push(obj)

  		}
  	}
  	 ctx.success(result);
  }
  async getSportsEvents(){
  	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_uls = $(".floor_body").eq(9).find("ul")
  	var result=[];
  	for(var i=0;i<dom_uls.length;i++){
  		var dom_lis = dom_uls.eq(i).find("li");
  		var obj={};
  		for(var j=0;j<dom_lis.length;j++){
  			var goods_href= dom_lis.eq(j).find(".products_kuang a").attr("href");
			var aa =goods_href.match(/-\d+/);
			if(aa){
				obj.goods_href=aa[0].replace("-","");
			}
			obj.img_url=dom_lis.eq(j).find(".products_kuang a img").attr("src");

			obj.goods_name=dom_lis.eq(j).find(".products_kuang a").attr("title");
			var t_str=dom_lis.eq(j).find(".price span").text();
			var time_arr=t_str.split(/\s+/g);
			obj.show_time=time_arr[0]+' '+time_arr[2];
			result.push(obj)

  		}
  	}
  	 ctx.success(result);
  }
  async getChildParenthilds(){
  	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_uls = $(".floor_body").eq(11).find("ul")
  	var result=[];
  	for(var i=0;i<dom_uls.length;i++){
  		var dom_lis = dom_uls.eq(i).find("li");
  		var obj={};
  		for(var j=0;j<dom_lis.length;j++){
  			var goods_href= dom_lis.eq(j).find(".products_kuang a").attr("href");
			var aa =goods_href.match(/-\d+/);
			if(aa){
				obj.goods_href=aa[0].replace("-","");
			}
			obj.img_url=dom_lis.eq(j).find(".products_kuang a img").attr("src");

			obj.goods_name=dom_lis.eq(j).find(".products_kuang a").attr("title");
			var t_str=dom_lis.eq(j).find(".price span").text();
			var time_arr=t_str.split(/\s+/g);
			obj.show_time=time_arr[0]+' '+time_arr[2];
			result.push(obj)

  		}
  	}
  	 ctx.success(result);
  }
  async getArticles(){
  	const {app,ctx} = this;
  	var html_str = await app.httpUtil({
  		method:"get",
  		url:"/"
  	});
  	var crawler_host = this.app.config.crawler_host;

  	// console.log(html_str);
  	const $ = cheerio.load(html_str)
  	var dom_lis = $(".hot #mq li");
  	var result=[];
  	for(var i=0;i<dom_lis.length;i++){
		var obj={}
		var href = dom_lis.eq(i).find("a").attr("href");
		var matchs = href.match(/\d+/g);
		if(matchs){
			obj.article_id =matchs[matchs.length-1];
		}
		obj.article_title=dom_lis.eq(i).find("a").text();
		result.push(obj);
  	}
  	return ctx.success(result);

  }
}

module.exports = HomeController;




