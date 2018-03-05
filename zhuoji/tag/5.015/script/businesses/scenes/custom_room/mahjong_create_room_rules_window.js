/*************************************************************
 *  mahjong_create_room_rules_window.js
    mahjong_create_room_rules_window
 *  mahjong
 	自建桌 玩法介绍 window
 *
 *  Created by nick.kai.lee on 16-06-24
 *  特殊说明：

    使用方法:
 */
(function(){
	var GLOBAL_OBJ = guiyang;
	var C2S 								         = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_FUNCS							     = GLOBAL_OBJ.businesses.functions;
	var MODEL 										 = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	var STATIC 										 = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.RulesWindow",
		ctor: function(_params) {
			this._super();
			this.params = _params;
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that            = this;
			
			/*
			@玩法详情 右边*/
			var detailTableView;  
			var details         = { data:[] };
            var detailTableView = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :this.detailNode.getContentSize(),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                // cellSize   :cc.size(size.width, 100),
                controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesCell,
                container  :this.detailNode,
                data       :details
            });
            this.detailNode.addChild(detailTableView);

        	details.data = [];
			for(var i in STATIC.TEXTS[ STATIC.BUTTONS[this.params.play_mode] ]){
				details.data.push( STATIC.TEXTS[ STATIC.BUTTONS[this.params.play_mode] ][i] );
			};

            if(this.params.play_mode == "nanchang")
            {
                for(var i in STATIC.TEXTS.nanChangbasic){
                    details.data.push( STATIC.TEXTS.nanChangbasic[i] );
                }
            }
            else
            {
                for(var i in STATIC.TEXTS.basic){
                    details.data.push( STATIC.TEXTS.basic[i] );
                }
            }

			detailTableView.reloadData( details.data.length );
		},

		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
		},

		onClose:function(){
			this.windowClose();
		},

		onCleanup:function(){
			this._super();
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return true;
		},

	});
	//end
})();

