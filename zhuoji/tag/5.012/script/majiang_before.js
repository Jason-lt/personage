/**
 * Author  WYF
 * Date    14-4-22
 * Desc    第一个JS文件，定义mj、log接口等
 */

/*
 * @新麻将全局环境
 */

//ADDNEW
var guiyang = guiyang || {};

// 名字空间
guiyang.GAMENAME = 'guiyang';
guiyang.GAMEID = 720;

// 麻将日志全局函数
guiyang.LOGD = function(tag, msg){
    ty.LOGD(guiyang.GAMENAME + '/' + tag, msg);
};

guiyang.LOGI = function(tag, msg){
    ty.LOGI(guiyang.GAMENAME + '/' + tag, msg);
};

guiyang.LOGW = function(tag, msg){
    ty.LOGW(guiyang.GAMENAME + '/' + tag, msg);
};

guiyang.LOGE = function(tag, msg){
    ty.LOGE(guiyang.GAMENAME + '/' + tag, msg);
};

guiyang.LOGF = function(tag, msg){
    ty.LOGF(guiyang.GAMENAME + '/' + tag, msg);
};

guiyang.FUNCIN = function(tag, msg){
	guiyang.LOGD(guiyang.GAMENAME + '/' + tag, '>>>>>>>>>>> ' + msg + '>>>>>>>>>>>');
};

guiyang.FUNCOUT = function(tag, msg){
	guiyang.LOGD(guiyang.GAMENAME + '/' + tag, '<<<<<<<<<<< ' + msg + '<<<<<<<<<<<');
};

guiyang.LOGI('guiyang:', JSON.stringify(guiyang))