/*****************************************
 *  mahjong_table_trustee_proxy.js
    初始化麻将 托管 代理
 *  mahjong
 *  提供“托管”的代理接口封装
 *  Created by zengxx on 16-07-05
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.proxy.Trustee = {
		produce:function(){
			var obj 		= null;

			return {
				_TAG:"table.proxy.Trustee",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				*/
				boot:function( _parent ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理");
					var that = this;
					obj      = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TABLE_TRUSTEE,
				    	{}, _parent);

					/*
					@玩家 手动点击 取消托管 按钮 取消托管*/
					obj.addEventListener("CANCEL", function(_event){
						GLOBAL_OBJ.table.network.C2S.requestTableRemoveTrustee();
					});

                    // GLOBAL_OBJ.bkernel.extend.Node.bind_prototype_function(obj.getRootNode(), "onCleanup",  function(){
                    // 	obj = null;
                    // });
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj = null;
					}
				}
			};//end

		},

	};
})();