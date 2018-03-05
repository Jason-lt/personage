/*****************************************
 *  mahjong_table_methods_proxy.js
    初始化麻将 吃碰杠听胡 操作面板 代理
 *  mahjong
 *  
 *  Created by nick.kai.lee on 16-07-21
 *  特殊说明：

    使用说明:
 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.proxy.Methods = {
		produce:function(){
			var methodsWin 		= null;
			var isShowMethodButtons = false;

			return {
				_TAG:"table.proxy.Methods",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				*/
				boot:function(_parent){
					GLOBAL_OBJ.LOGD(this._TAG, "启动methods_proxy代理");
					methodsWin = new GLOBAL_OBJ.table.windows.Methods.Window();
					_parent.addChild(methodsWin.getRootNode());
					GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.table.Events.SHUT_METHODS_BTN_WINDOW, this.shut, this);
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "关闭methods_proxy代理窗口");
					if (methodsWin) {
						methodsWin.shut();
						isShowMethodButtons = false;
						GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOICE_TALKING_METHOD, isShowMethodButtons);
					}
				},

                hide:function () {
                    GLOBAL_OBJ.LOGD(this._TAG, "隐藏methods_proxy代理");
                    if (methodsWin) {
						methodsWin.hide();
                    }
                },

                show:function () {
                    GLOBAL_OBJ.LOGD(this._TAG, "显示methods_proxy操作按钮代理");
                    if (methodsWin) {
						methodsWin.show();
						isShowMethodButtons = true;
						GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOICE_TALKING_METHOD, isShowMethodButtons);
                    }
                },

				// 刷新听胡详情数据
				update:function(_data, _model, isFromPlay){
					if (methodsWin){
						methodsWin.doUpdate(_data, _model);
						if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == false) {
							isShowMethodButtons = true;
							GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.table.Events.UPDATE_TABLE_VOICE_TALKING_METHOD, isShowMethodButtons);
						}
						if (isFromPlay){
                            //不要立即显示，等待飞牌动画播放完成后，通知显示，再显示
                            this.hide();
						}
						else{
                            this.show();
						}
					}
				},

				destroy:function () {
					GLOBAL_OBJ.LOGD(this._TAG, "卸载methods_proxy代理");
					GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
					if (methodsWin) {
						methodsWin.destroy();
						methodsWin = null;
						isShowMethodButtons = false;
					}
				}
			};
		}
	};

})();