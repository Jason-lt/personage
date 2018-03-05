/*************************************************************
 *  mahjong_create_gameplay_introduction_details.js
    mahjong_create_gameplay_introduction_details
 *  mahjong
 	玩法介绍 详细内容（基本规则，基本番型，特殊规则，结算，好友房）
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;

	GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetails = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.gameplayIntrDetails",
		ctor: function(params) {
			this._super();
            this.nowIndexName = params.rule_index;//当前选中的,默认
            this.params = params;
            // this.rule_index_oj = ["base_rule","base_sometype","special_rule","balance","friend_room"];

            this.init(GLOBAL_OBJ.RES.GDMJ_INTRODUCTION_DETAILS_CCBI);
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
            this.updateGPlayIntrDetailsViews( this.nowIndexName, "ctor");
            this.setSwallowTouches(false);
		},

        updateGPlayIntrDetailsViews:function( _nowIndexName, _ctor){
            if(this.nowIndexName == _nowIndexName && !_ctor){
                //除了初始化后，如果点击当前的，就不做处理
            }else{
                this.oldIndexName = this.nowIndexName;
                this.nowIndexName = _nowIndexName;

                this[this.oldIndexName + "_green"].setVisible(true);
                this[this.oldIndexName + "_yellow"].setVisible(false);
                this[this.oldIndexName + "_txt"].setColor(cc.color(11,117,10));

                this[_nowIndexName + "_green"].setVisible(false);
                this[_nowIndexName + "_yellow"].setVisible(true);
                this[_nowIndexName + "_txt"].setColor(cc.color(136,63,17));

                if(this[this.oldIndexName]){
                    this[this.oldIndexName].setVisible(false);
                }

                if(!this[_nowIndexName]){
                    GLOBAL_OBJ.LOGD(this._TAG,"this[_nowIndexName]  " + this[_nowIndexName]);
                    this.details         = { data:[] };
                    this[_nowIndexName] = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                        viewSize   :this.gid_details_node.getContentSize(),
                        direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                        fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                        bounce     :true,
                        cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Cache,
                        // cellSize   :cc.size(size.width, 100),
                        controller :GLOBAL_OBJ.businesses.scenes.CustomRoom.gameplayIntrDetailsCell,
                        container  :this.gid_details_node,
                        data       :this.details
                    });
                    this.gid_details_node.addChild(this[_nowIndexName]);

                    var parmData = this.params.data[_nowIndexName];
                    var temp = [];
                    if(parmData){
                        for(var k = 0;k < parmData.length;k ++){
                            temp.push(parmData[k]);
                        }
                    }
                    this.details.data = temp;
                    this[_nowIndexName].reloadData( this.details.data.length );
                }
                this[_nowIndexName].setVisible(true);
            }
        },

        onBaseRule:function () {//基本规则
            this.updateGPlayIntrDetailsViews("base_rule");
        },

        onBaseSomeType:function () {//基本番型
            this.updateGPlayIntrDetailsViews("base_sometype");
        },

        onSpecialRule:function () {//特殊规则
            this.updateGPlayIntrDetailsViews("special_rule");
        },

        onBalance:function () {//结算
            this.updateGPlayIntrDetailsViews("balance");
        },

        onFriendRoom:function () {//好友房
            this.updateGPlayIntrDetailsViews("friend_room");
        },

		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
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
})();