/*************************************************************
 *  mahjong_create_room_rules_cell.js
    mahjong_create_room_rules_cell
 *  mahjong
 	自建桌 玩法介绍 cell
 *
 *  Created by nick.kai.lee on 16-06-24
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS					           = GLOBAL_OBJ.businesses.functions;
	var STATIC                                     = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
	var MODEL 								       = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:"businesses.scenes.CustomRoom.RulesCell",
		ctor: function(_index,_config) {
			this._super();
			this.config = _config;
			this.index  = _index;//第几页

			this.init(GLOBAL_OBJ.RES.CREATE_ROOM_RULES_CELL_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var size          = this.view.ccbRootNode.getContentSize();
			this._desLabelttf = cc.LabelTTF.create("", "Arial", 30);
            this._desLabelttf.setAnchorPoint(cc.p(0, 0.5));
            this._desLabelttf.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this._desLabelttf.setDimensions(cc.size(size.width*0.95,0));
            this.view.ccbRootNode.addChild(this._desLabelttf);
		},

		onCleanup:function() {
			this._super();
		},

		/*
		界面刷新
		*/
		update:function(_index, _config){
			var data = this.config.data.data;
			this._desLabelttf.setFontName(data[_index].font||"Arial");
			this._desLabelttf.setFontSize(data[_index].size||30);
			this._desLabelttf.setString(data[_index].content);
			this._desLabelttf.setColor(data[_index].color||cc.color(195,135,77));

			var size0 = this.view.ccbRootNode.getContentSize();
			var size1 = this._desLabelttf.getContentSize();
			this.view.ccbRootNode.setContentSize(cc.size(size0.width,size1.height+10));
			this._desLabelttf.setPosition( cc.p( 10, (size1.height+10)*0.5) );
		},
	});
	//end
})();

