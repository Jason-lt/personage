/*****************************************
 *  mahjong_table_charge_preview_proxy.js
    初始化麻将 本家充值 代理
 *  mahjong
 *  提供“本家充值”的代理接口封装
 *  Created by lcr 17-06-30
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.table.proxy.ChargePreview = {
		produce:function(){
			var obj 		= null;
			var data		= null;
			return {
				_TAG:"table.proxy.ChargePreview",
				/*
				@创建 本家充值提示信息面板窗口
				params _parent:父节点
				params _data:充值数据
				params _cancelCallFunc:点击"取消按钮"时的回调函数
				*/
				boot:function( _parent, _data ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理");
					var that 		= this;

					data            = _data;
					obj      		= GLOBAL_OBJ.bkernel.windows.Factory.produce(
						GLOBAL_OBJ.table.windows.consts.C_TABLE_ASK_CHARGE,
						{ chargeData:data },
						_parent
					);
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj  = null;
						data = null;
					}
				},

			};//end

		},

	};

})();