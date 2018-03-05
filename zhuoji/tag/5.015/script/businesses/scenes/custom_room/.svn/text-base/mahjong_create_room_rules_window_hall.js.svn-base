/*************************************************************
 *  mahjong_create_room_rules_window_hall.js
    mahjong_create_room_rules_window_hall
 *  mahjong
 	自建桌 玩法介绍 window
 pk modify:大厅玩法说明弹窗
 *  特殊说明：

    使用方法:
    
    //显示玩法说明，参数：{playMode:"玩法"}：打开界面默认显示玩法
    var wnd  = GLOBAL_OBJ.bkernel.windows.Factory.produce(
        GLOBAL_OBJ.businesses.windows.consts.CREATE_ROOM_RULES_WND_HALL,
        {playMode:"玩法"}, this.getCurrentScene()
    );
 */
(function(){
    var GLOBAL_OBJ = guiyang;
	var C2S 								         = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_FUNCS							     = GLOBAL_OBJ.businesses.functions;
	var MODEL 										 = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	var STATIC 										 = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesWindowHall = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.RulesWindowHall",
		ctor: function(params) {
			this._super();
            this.nowIndex = 0;//当前选中的
            this.params = params;
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			this.updateViews()
		},
        updateViews:function(){
            var that   = this;
            /*
			@玩法类型 左边*/
			// var buttonTableView;
			this.button_details         = { data:[],callFunc:function(idx){
                //点击了idx
                that.refreshAll(idx);
            }};
            this.buttonTableView = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :this.typeNode.getContentSize(),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                // cellSize   :cc.size(size.width, 100),
                controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesButtonCell,
                container  :this.typeNode,
                data       :this.button_details
            });
            this.typeNode.addChild(this.buttonTableView);

            // this.buttonTableView = buttonTableView;
            // this.button_details = button_details;
            
			/*
			@玩法详情 右边*/
			// var detailTableView;
            this.details         = { data:[] };
            this.detailTableView = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :this.detailNode.getContentSize(),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                // cellSize   :cc.size(size.width, 100),
                controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.RulesCellHall,
                container  :this.detailNode,
                data       :this.details
            });
            this.detailNode.addChild(this.detailTableView);
            
            // this.detailTableView = detailTableView;
            // this.details = details;
            
            //刷新数据
            if(this.params && this.params.playMode){
                var idx = STATIC.tempRulesConfig.indexOf(this.params.playMode)||0;
                this.refreshAll(idx);
            }else{
                this.refreshAll(0);
            }
        },
        refreshAll:function(idx){
            this.nowIndex = idx || 0;
            
            // cc.log("this.nowIndex "+this.nowIndex + " "+idx);
            
            //读取数据
            this.params = [];
            for(var i = 0 ; i < STATIC.tempRulesConfig.length;i++){
                var playmode = STATIC.tempRulesConfig[i];
                var text = STATIC.TEXTS[playmode];
                var temp  = {
                    playmode:playmode,
                    texts:[],
                    title:STATIC.NAMES[playmode] || ""
                };
                if(text){
                    for(var k = 0;k < text.length;k ++){
                        temp.texts.push(text[k]);
                    }
                }
                /*
                for(var k = 0;k < STATIC.TEXTS.basic.length;k ++){
                    temp.texts.push(STATIC.TEXTS.basic[k]);
                }*/
                this.params.push(temp);
            }
            

            this.button_details.data = this.params;
            this.button_details.selectedIndex = this.nowIndex;
            this.buttonTableView.reloadData(this.button_details.data.length,"STOP");
            
            var param = this.params[this.nowIndex]||{texts:[]};
            this.details.data = param.texts;
            this.detailTableView.reloadData( this.details.data.length );
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
		}

	});
	//end
})();