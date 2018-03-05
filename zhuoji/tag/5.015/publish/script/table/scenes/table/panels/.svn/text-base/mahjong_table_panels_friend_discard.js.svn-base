/*************************************************************
 *  mahjong_table_mahjong_mahj_friend_discard.js
    mahjong_table_mahjong_mahj_friend_discard
 *  mahjong
 	麻将牌是否可以出牌 （麻将牌的友元）
 *
 *  Created by nick.kai.lee on 16-08-20
 *  特殊说明：
	
	1.该友元类允许直接访问friend里的成员变量。
	2.检查是否可以出牌
    使用方法:
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T = GLOBAL_OBJ.table.global;
	// var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;
	var MODEL_LACKSUIT = GLOBAL_OBJ.table.models.LackSuit;

	GLOBAL_OBJ.table.scenes.Table.Panels.Friends.Discard = function( _friend ){
		var friend  = _friend;
		return {
			_TAG:"table.scenes.Table.Panels.Friends.Discard",

			/**
			 * 启动
			 * @returns {GLOBAL_OBJ.table.scenes.Table.Panels.Friends.Discard}
			 */
			boot:function(){
				GLOBAL_OBJ.LOGD(this._TAG, "OBJECT LOAD");
				var that 	 = this;

				return this;		
			},

			shut:function(){
				GLOBAL_OBJ.LOGD(this._TAG, "OBJECT UNLOAD");
			},


			/**
			 * 检查是否允许出这个花色的牌
			 * @param {int}_seatId 待检查的玩家的座位号
			 * @param {int}_tile 待检查的花色
			 * @returns {boolean}
			 */
			doEnabledCheck:function(_seatId, _tile){
				// GLOBAL_OBJ.LOGD(this._TAG,"doEnabledCheck:function(_seatId, _tile){");
				var ret = true;
				switch(MODEL_TABLEINFO.getPlayMode()){
					case GLOBAL_T.PLAYMODE.SiChuanDq:
						ret = this.onCheckSichuanLackSuit(_seatId, _tile);
						break;
					default:
					break;
				}
				
				return ret;
			},

			/**
			 * 四川定缺
			 * 有缺门必须线打缺门，没缺门随意
			 * @param {int}_seatId 待检查的玩家的座位号
			 * @param {int}_tile 待检查的花色
			 * @returns {boolean}
			 */
			onCheckSichuanLackSuit:function(_seatId, _tile){
				var lack  	= MODEL_LACKSUIT.getLackSuitByUid( MODEL_TABLEINFO.getPlayer(_seatId) );//0,1,2
				
				//检查是否有缺门牌
				var hasLack = false, isLack = false;
				for(var i in friend.mahjs){
					var tile    = friend.mahjs[i].getTile();
					if 	( (lack == 0 && tile < 10) || (lack == 1 && tile > 10 && tile < 20) || (lack == 2 && tile > 20 && tile < 30) ) {
						hasLack = true; //有缺门牌
					}

					if 	( (lack == 0 && _tile < 10) || (lack == 1 && _tile > 10 && _tile < 20) || (lack == 2 && _tile > 20 && _tile < 30) ) {
						isLack  = true; //是缺门牌
					}
				}
				return (true == hasLack && true == isLack) || (false == hasLack);
			},

		};
	};
	
	//end
})();

