/*************************************************************
 *  mahjong_room_list_cell.js
    mahjong_room_list_cell
 *  mahjong
 	房间列表 cell
 *
 *  Created by nick.kai.lee on 16-07-07
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS              = GLOBAL_OBJ.businesses.functions;
	var MODEL                     = GLOBAL_OBJ.businesses.scenes.RoomList.Model;

	GLOBAL_OBJ.businesses.scenes.RoomList.Cell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.RoomList.Cell",

		ctor: function(_index,_playMode) {
			this._super();

			this.index  = _index;
			this.playMode = _playMode;

			this.init(GLOBAL_OBJ.RES.ROOMLISTCELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that     = this;

			/*
			@bind_block_scrolling_touch扩展，可以扩展一个适用于tableview的按钮扩展，该api返回touch管理者，提供默认的几个api
			详情参考源码
			该模块将edgeNode设置的和touchNode一致，就是一个普通按钮，仅仅是滑动时不支持touch响应而已
			外部使用getTouchManager暴露出去的touch管理者，重新设置edgeNode，以便支持tableview边界时屏蔽touch
			*/

			var playMode = this.playMode;
			var roomId = MODEL.getRoomId(playMode, this.index);

			this.manager = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(
				this.bgNode,
				false,
				function(listener, touch, event){ /*touch began*/
					that.imgMask.setVisible(true);
					hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
					return true;
				},
				function(listener, touch, event){
					var point = that.bgNode.convertToNodeSpace(touch.getLocation());
					var rect  = GLOBAL_OBJ.bkernel.Functions.boundingBoxRefSelf(that.bgNode);
					that.imgMask.setVisible(cc.rectContainsPoint(rect, point));
				},
				function(listener, touch, event){
					/*touch ended*/
					that.imgMask.setVisible(false);
					GLOBAL_OBJ.businesses.network.C2S.requestGameStart( playMode, roomId , null ,GLOBAL_OBJ.QuickStartWhere.roomlist);
				},
				function(){ /*touch canceled*/
					that.imgMask.setVisible(false);
					return false;
				}
			);

			var roomModel = MODEL.getRoom(playMode, this.index);

			var coinStr = "";
			var is_1    = false;

			if (roomModel.minCoin < 0){//服务器配置的-1，这个时候显示免费
				is_1 = true;
			}
			else if (roomModel.minCoin < 10000 && roomModel.minCoin >= 0){
				coinStr = roomModel.minCoin + "";
			}
			else if (roomModel.minCoin >= 10000 && roomModel.minCoin < 100000000){
				coinStr = (roomModel.minCoin / 10000) + "万";
			}
			else{
				coinStr = (roomModel.minCoin / 100000000) + "亿";
			}

			if(is_1){
				this['txtTitle'].setString(roomModel.title + "");
			}else{
				this['txtTitle'].setString(roomModel.title + "("+ coinStr +"准入)");
			}
			this['txtOnLine'].setString( roomModel.onlines + "");

			var maiMaInfo = "";

			if (roomModel.maima > 0){
				maiMaInfo = roomModel.maima == 1 ? "四人买马" : "自摸买马";
				maiMaInfo += " ";
				// maiMaInfo += " 买" + roomModel.macount + "马 ";
				this['nodeMaCount'].setVisible(true);
				GLOBAL_FUNCS.textureChange(this['txtMaCount'], GLOBAL_OBJ.RES['GDMJ_MOMA_SZ0'+ roomModel.macount +'_PNG']);
			}

			var laiziInfo = "";
			if (roomModel.laizi > 0){
				// laiziInfo = "翻癞子 ";
			}

			this['txtTask'].setString(maiMaInfo + laiziInfo + roomModel.info);
		},

		onCleanup:function() {

			this.manager.unbind();
			this.manager = null;

			this._super();
		}
	});

})();