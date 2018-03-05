/*****************************************
 *  mahjong_table_offline_proxy.js
    初始化麻将 离线 面板 代理
 *  mahjong
 *  
 *  Created by nick.kai.lee on 17-01-16
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.proxy.Offline = {
		produce:function(){
			var obj 		= null;
			return {
				_TAG:"table.proxy.Offline",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				*/
				boot:function( _parent ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理");
					obj = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_OFFLINE,
				    	{}, _parent);
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj = null;
					};
				},
			};//end

		},

	};

})();