/*****************************************
 *  mahjong_table_ting_proxy.js
 *  初始化麻将 听牌提示信息 代理
 *  提供“听牌页面”的代理接口封装
 *  Created by simon on 17-12-14
 */

(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;
	
	GLOBAL_OBJ.table.proxy.Ting = {
		produce:function(){
			var obj 		= null;
			var isReadyHand = false;
			var mode = "";

			return {
				_TAG:"table.proxy.Ting",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				*/
				boot:function( _parent, _mode, _data ){
					mode = _mode;
					GLOBAL_OBJ.LOGD(this._TAG, "上听启动代理, mode="+_mode);
                    var windowType = GLOBAL_OBJ.table.windows.consts.C_TING_WINDOW;
					obj = GLOBAL_OBJ.bkernel.windows.Factory.produce(windowType, {}, _parent);
					obj.data = _data;
					isReadyHand = true;
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj = null;
					}

					isReadyHand = false;
				},

				IsReadyHand:function () {
					return isReadyHand;
				},

				getMode:function(){
					return mode;
				},

				// 刷新听胡详情数据
				update:function(_data){
					if (obj){
						obj.update(_data);
					}
				},

				isAlive:function(){
					return obj != null;
				},
			};

		}

	};
})();