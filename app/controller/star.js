const Controller = require('egg').Controller;
const cheerio = require("cheerio");
const moment = require("moment");
class StarController extends Controller {
	async getDetail(){
		const {ctx,app} =this;
		if(!ctx.params.star_id)return ctx.fail(401,"参数错误:star_id");
		var star_id=ctx.params.star_id;
		try{
			var html_str = await app.httpUtil({
	  			method:"get",
		  		url:"/patrol_poly-"+star_id+".html"
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
		var head_txt = $(".goods_header span").text();
		var t_index = head_txt.indexOf("巡演");
		result.star_name = head_txt.slice(0,t_index);
		var avatar = $('.juheback img').attr("src");
		result.star_id=star_id;
		result.avatar=avatar;
		result.show_list=[];
		var dom = $("#patrol_star")
		if(!dom[0]) return ctx.fail(401,"内容没找到");
		console.log('dom',dom);
		var dom_lis = $("#patrol_star #poly_menu .poly_disabled");
		for(var i=0;i<dom_lis.length;i++){
			var time_str=dom_lis.eq(i).find(".poly_a p").text();	
			var time_arr=time_str.split(/\s+/g);
			var obj={}
			if(time_arr.length>2){
				obj.show_time = time_arr[0]+' '+time_arr[2]; 
				obj.show_week = time_arr[1];
			}else{
				obj.show_time = time_str;
			}
			obj.city = dom_lis.eq(i).find(".city_x").text();
			obj.changguan = dom_lis.eq(i).find(".poly_cg a").text();
			var changguan_href = dom_lis.eq(i).find(".poly_cg a").attr("href");
			var t_str =changguan_href.match(/brand-(\d+)/g)
			if(t_str && t_str.length){
				obj.changguan_id= t_str[0].replace("brand-","");
			}
			var goods_href= dom_lis.eq(i).find(".poly_gp").attr("href");
			var match_goods_id = goods_href.match(/-\d+/g)
			if(match_goods_id && match_goods_id.length){
				obj.goods_id = match_goods_id[0].replace("-","");
			}
			result.show_list.push(obj);
		}
		var dom_lis = $("#xuzhi ul li");
		result.xuzhi=[];
		for(var i=0;i<dom_lis.length;i++){
			result.xuzhi.push(dom_lis.eq(i).find('span').text());
		}
		var dom_lis = $("#zixun ul li");
		result.zixun=[];
		for(var i=0;i<dom_lis.length;i++){
			var obj={}
			var artical_href = dom_lis.eq(i).find('.starmesimg').attr("href")
			var aa= artical_href.match(/-\d+/g)
			if(aa){
				obj.article_id = aa[0].replace("-","");
			}
			obj.title = dom_lis.eq(i).find("dl dt a").text();
			obj.summary = dom_lis.eq(i).find("dl dd ").text();
			result.zixun.push(obj)
		}
		// console.log(head_txt.);
		return ctx.success(result);
	}
}

module.exports=StarController;