/*************************************************************
 *  mahjong_create_room_info_cell.js
    mahjong_create_room_info_cell
 *  mahjong
 	自建桌的信息 cell
 *
 *  Created by nick.kai.lee on 16-07-05
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS					          = GLOBAL_OBJ.businesses.functions;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.InfoCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.InfoCell",
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;//第几页

			this.init(GLOBAL_OBJ.RES.CREATE_ROOM_INFO_CELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that          = this;
			var size          = this.view.ccbRootNode.getContentSize();
			this.contentLabel = cc.LabelTTF.create("", "Arial", 18);
            this.contentLabel.setAnchorPoint(cc.p(0, 0.5));
            this.contentLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this.contentLabel.setDimensions(cc.size(size.width*0.95,0));
            this.view.ccbRootNode.addChild(this.contentLabel);
		},

		onCleanup:function() {
			this._super();
		},

		/*
		界面刷新
		*/
		update:function(_index, _config){
			var index = _index;
			var data  = this.config.data.data;

			this.contentLabel.setString(data[_index] || "");

			var size0 = this.view.ccbRootNode.getContentSize();
			var size1 = this.contentLabel.getContentSize();
			this.view.ccbRootNode.setContentSize(cc.size(size0.width,size1.height+10));
			this.contentLabel.setPosition( cc.p( size0.width*0.05,(size1.height+10)*0.5) );
		},
	});
	//end
})();

