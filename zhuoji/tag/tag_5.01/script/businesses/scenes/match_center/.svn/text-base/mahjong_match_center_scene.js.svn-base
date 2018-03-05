/*************************************************************
 *  mahjong_room_list_scene.js
    mahjong_room_list_scene
 *  mahjong
    房间列表场景
 *
 *  Created by nick.kai.lee on 16-07-07
 *  特殊说明：
    
    使用方法:
 */

(function(){
    var GLOBAL_OBJ = guiyang;
	var GLOBAL_FUNCS                      = GLOBAL_OBJ.businesses.functions;
    var MODEL_LIST                        = GLOBAL_OBJ.businesses.scenes.Match.Models.List;
    var MATCH_TYPES                       = [ "all", "free", "hot" ];
    var C2S                               = GLOBAL_OBJ.businesses.network.C2S;
	GLOBAL_OBJ.businesses.scenes.Match.Scene = GLOBAL_OBJ.bkernel.base.BaseSceneController.extend({
		_TAG:"table.scenes.Match.Scene",
		ctor: function(_gameType,playMode) {
			this._super();
            this.matchType = 0;

            this.init(GLOBAL_OBJ.RES.MATCHCENTERSCENE_CCBI);
		},

		onLoad: function() {
			this._super();
            var that = this;
      		var size = cc.director.getWinSize();
            // var mode = GLOBAL_OBJ.businesses.global.PLAYMODEDICT[this.gameType];

            /*
            顶部金币数量*/
            this.coinLabel.setString( GLOBAL_FUNCS.currencyUnitFormat( hall.ME.udataInfo.m_chip ) );
            
            // 标签按钮
            GLOBAL_FUNCS.toggleButtonGroup(this.typeButton1, this.typeButton2, this.typeButton3);
            var tabs = GLOBAL_FUNCS.nodeGroup("setEnabled",[true,false],[this.typeButton1, this.typeButton2, this.typeButton3]);
            tabs.setEnabled( this.matchType );//默认跳转

            /*
            中部房间列表*/
            var size       = this.viewNode.getContentSize();
            this.data      = { type: MATCH_TYPES[ that.matchType ],  onDetail:function(_type, _index){
                GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_MATCH_CENTER_DETAIL,
                    { type: _type, index: _index }, that.getRootNode() );
            } };

            this.tableView = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :size,
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                cellSize   :cc.size(875, 134),
                controller :GLOBAL_OBJ.businesses.scenes.Match.Cell,
                container  :this.viewNode,
                data       :this.data
            });
            this.viewNode.addChild(this.tableView);

            /*
            @通知注册*/
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_MATCH_CENTER_LIST_INFO, function(){
                that.onUpdate();
                
                //最早开赛的一场比赛已经开始，请求新的比赛信息
                // var begin = MODEL_LIST.getMatchBeginTimestamp( MATCH_TYPES[ this.matchType ], 0 );//开赛最快的一场
                // GLOBAL_OBJ.bkernel.utils.GlobalTimer.clean(that);
                // GLOBAL_OBJ.bkernel.utils.GlobalTimer.set( begin - GLOBAL_OBJ.bkernel.utils.GlobalTimer.getTime(), function(){
                //     C2S.requestMatchCenterSingleInfo( MODEL_LIST.getMatchRoomId( MATCH_TYPES[ this.matchType ], 0 ) );
                // }, that);

            }, this);

            GLOBAL_OBJ.bkernel.utils.Notification.listen( GLOBAL_OBJ.bkernel.Events.TICK,   function(_params){
                that.timeLabel.setString( (new Date( _params.time*1000 )).toLocaleTimeString() );
            }, this);
		},

		onCleanup:function() {
			this._super();
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

        onEnterTransitionDidFinish:function(){
            GLOBAL_OBJ.businesses.network.C2S.requestMatchCenterInfo();
            // MODEL_LIST.test(0);
        },


        /*
        @返回大厅场景*/
        onBack:function(){
            GLOBAL_OBJ.businesses.utils.Scene.jumpToSecondHall(this.playMode);
        },

        onUpdate:function(){
            this.tableView.reloadData( MODEL_LIST.getMatchCountByType( MATCH_TYPES[ this.matchType ] ) );
        },

        /*
        @全部赛事*/
        onClickWhole:function(){
            this.matchType = 0;
            this.data.type = MATCH_TYPES[ this.matchType ];
            this.onUpdate();

            // C2S.requestMatchCenterUpdate(MODEL_LIST.getMatchRoomId( "all", 0 ),
            //     MODEL_LIST.getMatchInstance( "all", 0 ));
        },

        /*
        @免费赛事*/
        onClickFree:function(){
            this.matchType = 1;
            this.data.type = MATCH_TYPES[ this.matchType ];
            this.onUpdate();
        },

        /*
        @热门赛事*/
        onClickHot:function(){
            this.matchType = 2;
            this.data.type = MATCH_TYPES[ this.matchType ];
            this.onUpdate();
        }
	});
	//end

})();

