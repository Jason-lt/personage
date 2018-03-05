/*****************************************
 *  mahjong_table_vip_room_waiting_proxy.js
    初始化麻将 贵宾厅候场区 代理
 *  mahjong
 
 *  Created by nick.kai.lee on 16-08-24
 *  特殊说明：

    使用说明:
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.proxy.VipRoomWaiting = {
		produce:function(){
			var obj 		= null;

			return {
				_TAG:"table.proxy.VipRoomWaiting",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				*/
				boot:function( _parent ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理");
					var that = this;
					obj      = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_VIP_ROOM_WAITING,
				    	{}, _parent);
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj = null;
					};
				}
			};//end

		},

	};

})();