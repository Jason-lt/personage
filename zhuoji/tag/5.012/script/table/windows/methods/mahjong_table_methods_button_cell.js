/*************************************************************
 *  mahjong_table_methods_button_cell.js
    mahjong_table_methods_button_cell
 *  mahjong
 	麻将牌 吃碰杠主动操作按钮CELL
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：
    使用方法:

 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var GLOBAL_T = GLOBAL_OBJ.table.global;
 
	GLOBAL_OBJ.table.windows.Methods.Cell = cc.Class.extend({
		_TAG:'table.windows.Methods.Cell',
		ctor:function(_index, _data, _model){

			this.btnDataList = _data;
			this.index  = _index;

			this._contentSize = cc.size(852, 120);

			this.rootNode = cc.Node.create();
			this.rootNode.setContentSize(this._contentSize);
			this.rootNode.setAnchorPoint(0,0);

			this.buttons = [];

			var methodBtn,methodBtnNode;
			for(var i = 0 ; i < 3 ; ++i ){
				var data   = this.btnDataList[ this.index * 3 +  i ];
				if (!data) { break; }

				// if (data.type == 16){
				// 	GLOBAL_OBJ.LOGD(this._TAG, "AI");
				// }
				methodBtn = GLOBAL_OBJ.table.windows.Methods.Buttons.produce( data.type, _model);
				// cc.log(" "+i+" onLoad -> "+JSON.stringify( data ));

				if (data.tiles)
				{
					GLOBAL_OBJ.LOGD(this._TAG, "method.getRootNode() : 1");
					methodBtn.setTiles( data.tiles );
				}

				// if (data.points)
				// {
				// 	GLOBAL_OBJ.LOGD(this._TAG, "method.getRootNode() : 2");
				// 	method.setPoints( data.points );
				// }

				//右对齐
				methodBtnNode = methodBtn.getRootNode();
				methodBtnNode.setPosition(this._contentSize.width - (i * methodBtn._contentSize.width), 0);

				this.rootNode.addChild(methodBtnNode);
				this.buttons.push(methodBtn);
			}

			var that = this;
			this.rootNode.onCleanup = function () {
				that.rootNode.onCleanup = null;
				that.onCleanup();
			}
		},

		getRootNode:function () {
			return this.rootNode;
		},

		removeAllBtns:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "removeAllBtns");
			var btn;
			for (var i in this.buttons){
				btn = this.buttons[i];
				btn.destroy();
			}
			if(this.buttons){
				this.buttons.length = 0;
			}
		},

		destroy:function () {
			GLOBAL_OBJ.LOGD(this._TAG, "destroy");
			this.removeAllBtns();
			if(this.rootNode){
				this.rootNode.removeFromParent();
			}
		},

		onCleanup:function(){
			GLOBAL_OBJ.LOGD(this._TAG, "onCleanup");
			this.buttons = null;
			this.rootNode = null;
			this.btnDataList = null;
			if (this.btnNodes){
				this.btnNodes.length = 0;
				this.btnNodes = null;
			}
		}
	});
})();