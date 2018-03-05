/*************************************************************
 *  mahjong_match_result_cell.js
 *  mahjong
    比赛结算奖励格子
 *
 *  Created by xujing on 17-11-14
 *  特殊说明：

    使用方法:
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS  = GLOBAL_OBJ.businesses.functions;

	GLOBAL_OBJ.businesses.scenes.Match.ResultCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"table.scenes.RoomList.ResultCell",
		ctor: function(resultInfo) {
			this._super();
			this._info = resultInfo;
            this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_RESULT_REWARD_CELL_CCBI);


			// {"name":"金币", "count":1000, "icon":"user:chip", "iconPath":"http://........png"}
		},

		onLoad: function() {
			this._super();

			var self = this;
			var savepath = 'games/sichuan/img/nopack/matchAward/';
			GLOBAL_FUNCS.asyncDownload(this._info.iconPath, savepath, {'node':this['nodeIcon']}, function(success, params, path){
				if (success) {
					var spr = new cc.Sprite(path);
					var s = params['node'].getContentSize();
					spr.setPosition(cc.p(s.width/2, s.height/2));
					self._setImgWithSize(spr, s.width, s.height);
					params['node'].addChild(spr);
				}
			}, this['nodeIcon']);

			this['txtName'].setString(this._info.name);
			var countStr =  this._info.count;
			if (this._info.icon == 'user:coupon'){
				//奖券要转换为红包券
				countStr = GLOBAL_FUNCS.formatQuang(this._info.count);
			}
			else{
				if (this._info.count >= 10000){
					countStr =  parseInt(this._info.count/10000) + "万";
				}
			}

			this['txtCount'].setString("x" + countStr);
		},
		// 按照规定大小设置图片
		_setImgWithSize : function (sprite, w, h) {
			var s = sprite.getContentSize();
			sprite.setScale(Math.min(w/s.width, h/s.height));
		},
		onCleanup:function() {
			this._super();
			this._info = null;
		}

	});

})();