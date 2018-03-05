/*****************************************
 *  mahjong_table_tips_preview_proxy.js
    牌桌提示 代理
 *  mahjong
 *  提供“牌桌文字提示”的代理接口封装
 *  Created by lcr 17-05-31
 *  特殊说明：
	1. 服务器推过来显示提示信息面板

    使用说明:
 */
(function(){
    "use strict";
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.proxy.TableTipsPreview = {
		produce:function(){
			var obj 		= null;
			var data        = null;
			return {
				_TAG:"table.proxy.TableTipsPreview",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				params _data:听牌数据
				*/
				boot:function( _parent, _data ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理");

					data = _data;
					obj  = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_ADD_TABLE_TIPS,
						_data, _parent);
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj  = null;
						data = null;
					}
				},

				/*
				@更新数据，动态改变提示信息内容
				*/
				update:function( ){
					if (null != obj && null != data) {
						obj.update(data);
					}
				},

				setTableTipsVisible:function( isvisible ){
					if(obj){
						obj.getRootNode().setVisible(isvisible);
					}
				}
			};//end

		},

	};

})();