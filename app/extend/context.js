const uuid = require("uuid");
const moment = require("moment");
const cookie = require("cookie");
const util = require("util");
const uaParser = require('ua-parser-js');

module.exports ={
	success(data,msg,extend_obj={}){
		var body={
		  error:0,
		  data:data,
		  message:msg,
		  ...extend_obj
		}
		this.body=body
	},
	fail(code,msg,data){
		this.body={
		  error:code,
		  message:msg,
		  data:data
		}
	},
}