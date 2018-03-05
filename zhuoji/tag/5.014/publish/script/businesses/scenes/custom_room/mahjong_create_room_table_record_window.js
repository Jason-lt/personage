/*************************************************************
 *  mahjong_create_room_table_record_window.js
    mahjong_create_room_table_record_window
 *  mahjong
 	牌局回放 window
 *
 *  Created by zengxx on 16-08-01
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
	var TABLE_RECORD_KEY     = "mahjong_create_room_table_record_window";
	var AUDIO           	 = GLOBAL_OBJ.bkernel.utils.Audio;

	GLOBAL_OBJ.businesses.scenes.CustomRoom.TableRecordWindow = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.TableRecordWindow",
		ctor: function(_params) {
			this._super();
			this.params = _params;
			this.tab = 0;
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that      = this;

            if (this.params.from == "game")
            {
                this.gameWanFa();
                return;
            }

			/*
			@牌局回放 */
			this.data     = {
				data:{},
				key:"",
				callFunc:function(_index){
					if (this.data['record_download_info'] && this.data['record_download_info'].length > 0){
						//pk modify: 参数
						var params = {cardCount:_index, record_download_info : this.data['record_download_info']};
						params.record_data = this.data['record_data'];

						GLOBAL_OBJ.bkernel.windows.Factory.produce(
							GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_TABLE_RECORD_MANAGE,
							params,
							that.getRootNode()
						);

					}else{
						GLOBAL_OBJ.LOGD(" record log "," record already delete ");
						ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
							text:"您的牌局信息已被删除！",
							duration:3
						});
					}
				}
			};

			var size      = this.viewNode.getContentSize();
            var tableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :size,
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                bounce     :true,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   :cc.size(size.width, 113),
                controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.TableRecordCell,
                container  :this.viewNode,
                data       :this.data,
                //pk modify:添加顺序! 倒叙
                sortType   : GLOBAL_OBJ.bkernel.utils.TableView.SortType.Inverted
            });
            this.viewNode.addChild(tableview);

            // 刷新tableview
            if (this.params['users_info'] && this.params['users_info'][0]){
            	var cardCount  = this.params['users_info'][0]['deltaScore']?this.params['users_info'][0]['deltaScore'].length:0;
            	this.data.key  = this.params['table_record_key'];
            	this.data.data = {};
            	this.data.data.users_info = this.params['users_info'];
            	this.data.data.tableId    = this.params["tableId"];
            	this.data.data.playMode   = this.params["playMode"];
            	this.data.data.record_download_info  = this.params['record_download_info'];

            	tableview.reloadData(cardCount);
            }

            //刷新玩法类型
            if (this.params["playMode"]) {
                var playMode = this.params["playMode"];
                var str = playMode.replace("-", "");
                var pmStr = GLOBAL_OBJ.businesses.scenes.CustomRoom.static.NAMES[str];
                if(pmStr){
                    this.txtWanFa.setString(pmStr);
                }
            }
            
            if (typeof(this.params["record_data"]["playDesc"]) != "undefined")
            {
            	var playDesc = this.params["record_data"]["playDesc"];
                if (playDesc.length ==0)
                {
                    this.moshi.setVisible(false);
                    return;
                }

                var str = playDesc[0];
                for (var i = 1; i < playDesc.length; ++i)
                {
                    str = str + "、" + playDesc[i];
                }
            	this.txtMoShi.setString(str);
            }

            this.onTab0();
		},

		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
		},

		onClose:function(){
			AUDIO.audio(GLOBAL_OBJ.RES.UI_CLOSEBUTTON_MP3);
			this.windowClose();
		},

		onCleanup:function(){
			this._super();

			GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return true;
		},
        
        onTab0:function()
        {
        	this.tab0_select.setVisible(true);
        	this.tab0.setVisible(false);

        	this.nodeList.setVisible(true);
        	this.nodeDetails.setVisible(false);

            this.tab1_select.setVisible(false);
        	this.tab1.setVisible(true);
        },

        onTab1:function()
        {
        	this.tab1_select.setVisible(true);
        	this.tab1.setVisible(false);

        	this.nodeList.setVisible(false);
        	this.nodeDetails.setVisible(true);

            this.tab0_select.setVisible(false);
        	this.tab0.setVisible(true);
        },

        gameWanFa:function()
        {
            var mode = this.params.playMode;
            var wanFaStr = "";
            if (mode == GLOBAL_OBJ.table.global.PLAYMODE.JiPingHu)
			{
				wanFaStr = "鸡平胡";
			}
            
            this.txtWanFa.setString(wanFaStr);
            this.playModeBtnTxt.setString(wanFaStr);

            var moshi = this.params.moshi;
			// GLOBAL_OBJ.LOGD("moshi ========== ", JSON.stringify(moshi));
            //["换三张","呼叫转移","自摸不加倍","全幺九x4","断幺九(关)","将对x8","门清x2","天地胡x32","海底捞月x2","8倍封顶"]
            var moshiStr = "";
            for (var i = 0; i < moshi.length; i++)
            {
                moshiStr = moshiStr + moshi[i] + "  ";
            }
            this.txtMoShi.setString(moshiStr);
        },

    });
	//end
})();

