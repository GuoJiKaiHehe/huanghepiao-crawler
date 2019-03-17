// app/extend/application.js
const BAR = Symbol('Application#bar');
const path = require('path');
let Duplex = require('stream').Duplex; 
const uuid = require('uuid');
const moment = require("moment");
const htmlTags = require('html-tags');
const axios = require("axios");
const request = require('superagent')
const superagentCheerio = require('superagent-cheerio')
const agent = request.agent().use(superagentCheerio)
// axios.defaults.withCredentials=true;
const instanceAxios = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000*20, //1m request timeout
  // headers:{
  //   platform:'eryi_private'
  // },
  withCredentials: true,
  crossDomain:true 

});
module.exports = {
  mRequest:agent,
  // request:request,
  async getBufferByStream(stream) {
    return new Promise((resolve,reject)=>{
      var str="";
      const buffers = [];
      stream.on("data",(chunk)=>{
        buffers.push(chunk);
      });
      stream.on('end',()=>{
        resolve(Buffer.concat(buffers))
      });
      stream.on('error',(err)=>{
        reject(err);
      })
    })    
  },
  bufferToStream(buffer){
    let stream = new Duplex();
     stream.push(buffer);
     stream.push(null);
     return stream; 
  },
  isJSON(body) {
    if (!body) return false;
    if ('string' == typeof body) return false;
    if ('function' == typeof body.pipe) return false;
    if (Buffer.isBuffer(body)) return false;
    return true;
  },
  isHtml(str){
    const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;
    const full = new RegExp(htmlTags.map(x => `<${x}\\b[^>]*>`).join('|'), 'i');

    return  basic.test(str) || full.test(str);
  },
  httpUtil(options={},callback){
    return new Promise((resolve,reject)=>{
        if(!options.headers) options.headers={};
        // options.headers.host=this.config.crawler_host;
        if(options.browser){
            // if(options.headers)
            if(!options.headers['User-Agent']) options.headers['User-Agent']=this.mUtil.randomUserAgent();
        }
        // console.log(options.headers);

        // console.log(options.method);
        options={
          url:this.config.crawler_host+options.url,
          method:options.method?options.method:'get',
          headers:options.headers,
          data:options.data,
          // {
            // Referer: "http://music.163.com",
            // Cookie: "appver=1.5.2",
            // "Content-Type": "application/x-www-form-urlencoded",
            // "User-Agent": useragent,
            // Host:"music.163.com",
            // Connection:"keep-alive",
            // Cookie:cookie,
          // },
        }
        if(options.method=='post'){
          // console.log(options);
        }
       instanceAxios(options).then((res)=>{
          // console.log(res);
          callback && callback(null,res.data,res);
          resolve(res.data);
        }).catch((err)=>{

          callback && callback(err);
          reject(err);
        })   
    });
  },
  async sleep(second){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        resolve(second)
      },second*1000)
    })
  },

  mUtil:{
    clearSpeStr:function(str){
        if(typeof str=='string'){
          return str.replace(/[\'\"\\\/\b\f\n\r\t]/g,"")
        }
    },
    randomUserAgent:function(){
      const userAgentList = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
      "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
      "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0",
      "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
      "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",
      "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)",
      "Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586",
      "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1"
      ];
      const num = Math.floor(Math.random() * userAgentList.length);
      return userAgentList[num];      
    }
  }
};
instanceAxios.interceptors.request.use(config => {
  // Do something before request is sent

  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  // }
  // alert("666");
  // Message({
  //   type:'success',
  //   message:"请求成功！"
  // })
 /* Notification({
    title: 'Info',
    message: '这是一条没有关闭按钮的消息',
    showClose: false
  })*/
  // config.headers['eryi-token'] = tools.getToken() //
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
});
instanceAxios.interceptors.response.use(
  response => {
   return response;  
  },
  
  error => {
    return Promise.reject(error)
  })
