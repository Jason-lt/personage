/*****************************************
 *  mahjong_table_ting_preview_proxy.js
    初始化麻将 听牌预览信息 代理
 *  mahjong
 *  提供“听牌预览信息”的代理接口封装
 *  Created by simon on 17-12-13
 *  特殊说明：
	1. 预览窗体关闭 分手动点取消关闭， 玩家出牌时关闭，倒计时到了自动关闭三种情况
 */
(function(){
	var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.table.proxy.TingPreview = {
		produce:function(){
			var obj 		= null;
			var isReadyHand = false;
			var data        = null;
			var mode        = "normal";
			return {
				_TAG:"table.proxy.TingPreview",
				/*
				@创建 听牌提示信息面板窗口
				params _parent:父节点
				params _data:听牌数据
				params _cancelCallFunc:点击"取消按钮"时的回调函数
				*/
				boot:function( _parent, _data, _mode, _cancelCallFunc ){
					GLOBAL_OBJ.LOGD(this._TAG, "启动代理, mode = "+_mode);
					var that 		= this;
					var cancel_func = _cancelCallFunc || function(){};

					isReadyHand = true;
					data = _data;
					mode = _mode;
					obj = GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.table.windows.consts.C_TING_PREVIEW_WINDOW,
						//玩家 手动点击 取消预览 按钮点击回调
				    	{ mode: mode, onClose:function(){
							//that.setModeVisible(false);
							//that.shut();
							//cancel_func();//通知外部，取消听牌了
				    	} }, _parent);
				},

				shut:function(){
					GLOBAL_OBJ.LOGD(this._TAG, "卸载代理");
					if (obj) {
						obj.windowClose();
						obj  = null;
						data = null;
						mode = "normal";
					}
					isReadyHand = false; //标记取消
				},

				/*
				@更新数据，动态改变panel size
				params _tile:听牌的花色
				params _slotPositon:操作区域里牌槽的坐标
				*/
				update:function( _tile, _slotPositon ){
					if (null != obj && null != data && null != data[_tile]) {
						obj.update(data[_tile], _slotPositon, data['_'+_tile]);
					}
				},

				/*
				@是否是听牌状态*/
				didDoReadyHand:function(){
					return isReadyHand;
				},

				/*
				检查花色是否是听牌的花色一种
				*/
				doTileReadyHandCheck:function(_tile){
					var d 		 = data || {};
					return null != d[_tile];
				},

				// 获取报听可胡牌数据
				getResultByTile:function (_tile) {
					return data[_tile] || [];
                },

				getMode:function(){
					return mode;
				},

				setModeVisible:function( isvisible ){
					if(obj){
						obj.getRootNode().setVisible(isvisible);
					}
				},

				setPreviewTipsVisible:function (_visible) {
					if (obj) {
                        obj.setTipsVisible(_visible);
					}
                },

			};//end
		},
	};

})();