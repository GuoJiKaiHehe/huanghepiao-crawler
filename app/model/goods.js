// {app_root}/app/model/user.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const GoodsSchema = new Schema({
    goods_id: { type: Number  },
    city_id:{type:Number}, //城市id
    cat_id:{type:Number}, //城市id
    goods_name: { type: String  },
    goods_name_style:{type:String},
    goods_piaodate:{type:String},
    goods_piaoname:{type:String},
    goods_piaotime:{type:String},
    click_count:{type:String},
    click_num:{type:String},
    brand_id:{type:Number}, //场所id
    goods_short:{type:String},
    goods_sn:{type:String},
    goods_img: { type: String  },
    goods_thumb:{type:String},
    goods_desc:{type:String},
    goods_brief:{type:String}, //摘要
    desc_brief:{type:String}, //摘要
    titlekeywords:{type:String},
    keywords:{type:String},
    warn_number:{type:Number}, //警告库存；
    buymax_start_date:{type:String}, //开始购买
    buymax_end_date:{type:String}, //结束购买
    buymax:{type:Number}, //最大购买
    is_buy:{type:Number}, //是否可以购买；
    gp_ts:{type:String},
    original_img:{type:String},
    is_alone_sale:{type:String},
    is_on_sale:{type:String},
    add_time:{type:Number},
    sort_order:{type:Number},
    is_delete:{type:Boolean},
    is_best:{type:Boolean},
    is_new:{type:Boolean},
    is_hot:{type:Boolean},
    is_promote:{type:Boolean}, // 是否促销
    star_id:{type:Number},
    zhekou:{type:String},
    bonus_type_id:{type:Number},
    last_update:{type:Number},
    zuowei:{type:String},
    love:{type:Number},
    star_list:{type:String},
    cost_price:{type:String},
    extension_code:{type:String},
  });

  return mongoose.model('Goods', GoodsSchema);
}