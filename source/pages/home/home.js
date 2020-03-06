// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { CityApi } from "../../apis/city.api.js";
import { MemberApi } from "../../apis/member.api.js";
import { LoupanApi } from "../../apis/loupan.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
   
    super.onLoad(options);
    this.Base.setMyData({
      // StatusBar: getApp().globalData.StatusBar,
      // CustomBar: getApp().globalData.CustomBar,
      // Custom: getApp().globalData.Custom,
      seq: 2,
      
      showcity:false,
      currentcity: {
        id: 1,
        name: "深圳",
      },
      
    })
  }
  onMyShow() {
    var that = this;
    this.Base.setMyData({
      shi: null,
      range:null
    })
    this.getloutype();
    this.getcity();
    this.gettypelist();
    this.getbanner();
    this.getlunbo();
    this.getprice();
   
  }
  getloutype(){
    var that = this;
    var api = new LoupanApi;
    api.loupantype({}, (loupantype)=>{
      for (var i = 0; i < loupantype.length;i++){
        loupantype[i].loulist=[];
      }
      that.Base.setMyData({ loupantype})
      that.getloupan();
    })
  }
  getcity(){
    var currentcity = this.Base.getMyData().currentcity;
    var cityapi = new CityApi;
    cityapi.citylist({ }, (citylist)=>{
      console.log(citylist);
      
      this.Base.setMyData({ citylist, currentcity:citylist[2]})
    })
  }
  getbanner(){
    var instapi = new InstApi;
    instapi.indexbanner({ orderby: 'r_main.seq'}, (indexbanner)=>{
      this.Base.setMyData({ indexbanner})
    })
  }
  getlunbo(){
    var instapi = new InstApi;
    instapi.lunbo({ orderby: 'r_main.seq' }, (lunbo) => {
      this.Base.setMyData({ lunbo })
    })
  }
  gettypelist(){
    var memberapi = new MemberApi;
    memberapi.typeslist({ orderby: 'r_main.seq'}, (typeslist)=>{
      this.Base.setMyData({ typeslist})
    })
  }
  getprice(){
    var loupanapi = new LoupanApi;
    loupanapi.pricerange({orderby:'r_main.seq'}, (pricerange)=>{
      this.Base.setMyData({
        shax:pricerange
      })
    })
  }
  getloupan(){
    var loupantyped = this.Base.getMyData().loupantype;
    var currentcity = this.Base.getMyData().currentcity;
    var loupanapi = new LoupanApi;
    var pqlist=[];
    var rmlist=[];
    var whlist=[];
    var that = this;
    loupanapi.loupanlist({ city_id: currentcity.id}, (loupanlist)=>{
      console.log(loupanlist,'lou')
      for(var i=0;i<loupanlist.length;i++){
        for(var k=0;k<loupanlist[i].types.length;k++){
          for (var j = 0; j < loupantyped.length; j++) {
            if (loupanlist[i].types[k].id == loupantyped[j].id) {
              loupantyped[j].loulist.push(loupanlist[i]);
            }
          }
        }
       
      }
      that.Base.setMyData({
        loupanlists: loupantyped,
        temp: loupanlist
      })
    })
  }
  qiehuan(){
    var showcity = this.Base.getMyData().showcity;
    showcity = !showcity;
    this.Base.setMyData({
      showcity,
    })
  }
  switchcity(e){
    console.log(e);
    var that = this;
    var cur = e.currentTarget.dataset.current;
    var idx = e.currentTarget.id;
    var seq = this.Base.getMyData().seq;
    
    this.Base.setMyData({
      currentcity:cur,
      showcity:false,
      seq: idx,
      shi: null,
      range:null
    })
    that.getloutype();
  }
  qubind(e){
    console.log(e);
    var id = e.currentTarget.dataset.currentid;
    var cur = e.currentTarget.id;
    var pqlist = this.Base.getMyData().temp;
    var loupanlist = this.Base.getMyData().loupanlists;
    var range = this.Base.getMyData().range;
    var rangeid = this.Base.getMyData().rangeid;

   
    console.log(pqlist, 'oo')
    console.log(loupanlist[0].loulist,'oo')
    var arr = [];
      
    if (range == null) {
      for (var j = 0; j < pqlist.length; j++) {
        for (var i = 0; i < pqlist[j].types.length; i++) {
          if (pqlist[j].types[i].id == loupanlist[0].id) {
            if (pqlist[j].qu_id == id) {
              arr.push(pqlist[j]);
            }
          }
        }
      }
    } else {
      for (var j = 0; j < pqlist.length; j++) {
        for (var i = 0; i < pqlist[j].types.length; i++) {
          if (pqlist[j].types[i].id == loupanlist[0].id) {
            if (pqlist[j].qu_id == id && pqlist[j].pricerange_id== rangeid) {
              arr.push(pqlist[j]);
            }
          }
        }
      }
    }

    loupanlist[0].loulist=arr;
    this.Base.setMyData({
      shi:cur,
      loupanlists: loupanlist,
      shiid:id
    })
  }
  todetails(e){
    var pqlist = this.Base.getMyData().loupanlists;
    var lujing = e.currentTarget.dataset.diwei;

    if (pqlist[1].loulist.length>3){
      var blen = 1391;
    }else {
      var blen = 1141;
    }
    if (pqlist[2].loulist.length > 3) {
      var clen = 1750;
    } else {
      var clen = 1391 + (118 * pqlist[2].loulist.length);
    }
    console.log(clen,'pp')
    console.log(e);
    
    if(lujing=='a'){
     wx.pageScrollTo({
       scrollTop: 661,
       duration: 300
     })
    } else if (lujing == 'b') {
      wx.pageScrollTo({
        scrollTop: blen,
        duration: 300,
      })
    } else if (lujing == 'c') {
      wx.pageScrollTo({
        scrollTop: clen,
        duration: 300,
      })
    }
  }
  xiangqin(e){
    console.log(e);
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/lpdetail/lpdetail?id='+id,
    })
  }
  huidao(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
  }
  xuanrange(e){
    console.log(e);
    var cur = e.currentTarget.id;
    var id = e.currentTarget.dataset.current;
    var templist = this.Base.getMyData().temp;
    var loupanlists = this.Base.getMyData().loupanlists;
    var arr = [];
    var shi = this.Base.getMyData().shi; 
    var shiid = this.Base.getMyData().shiid;
    if(shi==null){
      for (var i = 0; i < templist.length; i++) {
        for (var j = 0; j < templist[i].types.length; j++) {
          if (templist[i].types[j].id == loupanlists[0].id) {
            if (templist[i].pricerange_id == id) {
              arr.push(templist[i]);
            }
          }
        }
      }
    }else {
      for (var i = 0; i < templist.length; i++) {
        for (var j = 0; j < templist[i].types.length; j++) {
          if (templist[i].types[j].id == loupanlists[0].id) {
            if (templist[i].pricerange_id == id && templist[i].qu_id==shiid) {
              arr.push(templist[i]);
            }
          }
        }
      }
    }
    
    loupanlists[0].loulist=arr;
    this.Base.setMyData({
      range:cur,
      loupanlists,
      rangeid:id
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getcity = content.getcity;
body.qiehuan = content.qiehuan;
body.switchcity = content.switchcity;
body.gettypelist = content.gettypelist;
body.getbanner = content.getbanner;
body.getlunbo = content.getlunbo;
body.qubind = content.qubind;
body.getloupan = content.getloupan;
body.getprice = content.getprice;
body.todetails = content.todetails;
body.xiangqin = content.xiangqin;
body.huidao = content.huidao;
body.getloutype = content.getloutype;
body.xuanrange = content.xuanrange;
Page(body)