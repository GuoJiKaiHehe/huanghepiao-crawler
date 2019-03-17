'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/home/getBanners', controller.home.getBanners); //获取banner
  router.get('/api/home/getCates', controller.home.getCates); //获取分类；

  router.get('/api/home/getHotPerforms', controller.home.getHotPerforms); //获取热门演出；
  router.get('/api/home/getRoadShows', controller.home.getRoadShows); //巡演聚合
  router.get('/api/home/getYanChanghuis', controller.home.getYanChanghuis); //演唱会
  router.get('/api/home/getMusicales', controller.home.getMusicales); //音乐会
  router.get('/api/home/getModernDramas', controller.home.getModernDramas); //话剧
  router.get('/api/home/getSportsEvents', controller.home.getSportsEvents); //体育赛事
  router.get('/api/home/getChildParenthilds', controller.home.getChildParenthilds); //儿童亲子
  router.get('/api/home/getArticles', controller.home.getArticles); //演出资讯
  // router.get("/api/home/getAll",controller.home.getAllGoods);
	
  router.get('/api/user/login',controller.user.login)
  router.get('/api/user/logout',controller.user.logout)
  //商品
  router.get('/api/goods/getDetail/:goods_id', controller.goods.getDetail); //获取热门演出；
  router.get('/api/goods/getGoodsInfo/:goods_id', controller.goods.getGoodsInfo); //获取热门演出
  //资讯相关；

  //场馆相关；

  //明星相关；
  router.get('/api/star/getDetail/:star_id', controller.star.getDetail); //获取热门演出；

  //订单相关；
  router.get("/api/order/getList",controller.order.getList); //获取订单列表；
  router.get("/api/order/getDetail",controller.order.getDetail); //获取订单列表；
};
