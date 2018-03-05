/*************************************************************
 *  mahjong_match_center_detail_cell00.js
    mahjong_match_center_detail_cell00
 *  mahjong
 	赛事中心 详情 概况列表 cell
 *
 *  Created by nick.kai.lee on 16-09-09
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_B 			          	 		  = GLOBAL_OBJ.businesses.global;
	var GLOBAL_FUNCS					 		  = GLOBAL_OBJ.businesses.functions;
	var MODEL_LIST                       		  = GLOBAL_OBJ.businesses.scenes.Match.Models.List;
	var C2S								 		  = GLOBAL_OBJ.businesses.network.C2S;
	GLOBAL_OBJ.businesses.scenes.Match.Detail.Cell01 = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.Match.Detail.Cell01",
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;//第几页
			this.init(GLOBAL_OBJ.RES.MATCHCENTERDETAILCELL01_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
		},

		onCleanup:function() {
			this._super();
		},

		/*
		界面刷新 */
		update:function(_index, _config){
			this.index    = _index;
			this.config   = _config;
			var data 	  = this.config.data.data[ this.index ];
			if (data) {
				if (data.start < 5) {
					this.keyLabel.setString( "第"+data.start+"名：" );	
				}else{
					this.keyLabel.setString( "第"+data.start+"-"+data.end+"名：" );
				}

				var items = data.award_list || [];
				var text  = "";
				for(var i in items){
					text  = text + items[i].num + items[i].name + " "
				}
				this.valueLabel.setString( text );				
			}
		}

	});
	//end
})();

