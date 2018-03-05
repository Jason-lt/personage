/*****************************************
 *  mahjong_table_vote_proxy.js
    初始化麻将 投票退出 代理
 *  mahjong
 *  提供“血流成河 赢牌记录”的代理接口封装
 *  Created by nick.kai.lee on 16-11-25
 *  特殊说明：

    使用说明:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	
	GLOBAL_OBJ.table.proxy.Vote = {
		produce:function(){
			var obj 		= null;
			return {
				_TAG:"table.proxy.Vote",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				params _data:听牌数据
				*/
				boot:function( _parent ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理");
					var that 		= this;
					obj             = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                        GLOBAL_OBJ.table.windows.consts.C_TABLE_VOTE, {}, _parent);
					return this;
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj  = null;
					};
				},
			};//end

		},

	};

})();