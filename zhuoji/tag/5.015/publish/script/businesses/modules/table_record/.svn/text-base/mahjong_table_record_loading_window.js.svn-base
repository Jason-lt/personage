/*************************************************************
 *  mahjong_table_record_loading_window.js
    mahjong_table_record_loading_window
 *  mahjong
 	loading界面
 *
 *  Created by zengxx on 16-11-02
 *  特殊说明：
	下载牌局回放加载

    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.modules.TableRecord.LoadingWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG: 'GLOBAL_OBJ.businesses.modules.TableRecord.LoadingWindow',

		ctor:function(_params){
			this._super();

			this.params = _params;
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
			var that = this;

			this.getRootNode().setLocalZOrder(99999999+1);

			// // 监听事件关闭loading
			// this.schedule("time_out",function(){
	  //           that.windowClose();
	  //       },10,1);
		},

		onCleanup:function(){
			this._super();
		}
	});
})();