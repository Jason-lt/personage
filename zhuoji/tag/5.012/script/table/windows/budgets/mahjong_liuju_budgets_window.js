/*************************************************************
 *  mahjong_poyang_budgets_window.js
    mahjong_poyang_budgets_window
 *  mahjong
 	麻将鄱阳牌桌结算
 *
 *  Created by nick.kai.lee on 16-09-29
 *  特殊说明：
 	
    使用方法:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
	var GLOBAL_T                = GLOBAL_OBJ.table.global;
	var MODEL_TABLEINFO         = GLOBAL_OBJ.table.models.TableInfo;
	var C2S                     = GLOBAL_OBJ.table.network.C2S;
    var MODEL_LEAVE             = GLOBAL_OBJ.table.models.Leave;
    var MODEL_ROUND_RESULT      = GLOBAL_OBJ.table.models.roundresult;
    var MODEL_TASK_WINSTREAK    = GLOBAL_OBJ.table.models.winstreaktask;
    var MODEL_BUDGETS      = GLOBAL_OBJ.table.models.Budget;

    GLOBAL_OBJ.table.windows.LiuJu.Budgets = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.LiuJu.Budgets",
		ctor: function(_params) {
			this._super();
			this.params = _params;
            this.liuJuAni = null;
            this.isHaveWinStreak = false;//是否配置了连胜任务
            this.myhead = null;
		},

		onLoad: function() {
			this._super();
			var that                = this;
            this.isCreate 			= MODEL_TABLEINFO.getTableType() == GLOBAL_OBJ.TableType.Create;
            this.isHaveWinStreak    = MODEL_TASK_WINSTREAK.getIsHaveWinStreak();
            this.doPlayLiuJuTX();

            var uid = MODEL_BUDGETS.getUserId(GLOBAL_T.MYSEAT);
            if (this["portraitNode_my"].getChildrenCount() == 0 && uid>0) {
                this.myhead = GLOBAL_OBJ.businesses.modules.User.Portrait.produce( uid,
                    GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, this["portraitNode_my"]);
                this["portraitNode_my"].setScale(1.5);
            }

            this.rootNode.scheduleOnce(function () {
                that.onBackFlowBtn();
            },1.5);
		},

        doPlayLiuJuTX:function () {
		    var that = this;
            this.liuJuAni = GLOBAL_OBJ.tableEffectPlayer.play( that.liujuNode,
                GLOBAL_OBJ.RES.MJ_ZM_TX_LIUJU_CCBI, cc.p(0, 0),
                function(_animate){},
                function(){
                    that.doShowWhat();
                }, true );
        },

		onCleanup:function() {
            this.onRemoveEffects();
			this._super();
		},

		onEase:function(){
			this._super();
		},
		
        onRemoveEffects:function()
        {
            GLOBAL_OBJ.tableEffectPlayer.removeEffect(this.liuJuAni);
            this.liuJuAni = null;
        },

        windowClose:function()
        {
            this.onRemoveEffects();
            this._super();
        },

		/*
		@是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

        doShowWhat:function () {//流局动画播放完毕，显示哪个按钮
            if(this.isCreate) {//如果是一个自建桌
                if (MODEL_ROUND_RESULT.getSiChuanFinal(GLOBAL_T.MYSEAT) == 1) {
                    this.chakanjiesuan_node.setVisible(true);
                    this.game_began_node.setVisible(false);
                }else {
                    this.chakanjiesuan_node.setVisible(false);
                    this.game_began_node.setVisible(true);
                }
            }else{
                this.chakanjiesuan_node.setVisible(false);
                this.game_began_node.setVisible(true);
            }
        },

        onBackFlowBtn:function () {
            // var that = this;

            // if(this.isCreate) {//如果是一个自建桌
            //     this.back_flow_btn.setVisible(false);
            //     this.liujuNode.setVisible(false);
            //     this.liujuwindowbg.setVisible(false);
            //     this.setSwallowTouches(false);
            //
            // } else{
                // if(this.isHaveWinStreak){//任务界面
                //     //this.task_node.setVisible(true);//任务面板
                //     that.tasklayer = new GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.Tasklayer({
                //         backBtn:function() {
                //             that.onBackTask();
                //         },
                //         continueBtn:function() {
                //             that.onContinue();
                //         },
                //         myhead:that.myhead
                //     });
                //     //this.task_node_child_layer.addChild(that.tasklayer.getRootNode());
                //     this.liujuNode.setVisible(false);
                //     this.back_flow_btn.setVisible(false);
                //     this.chakanjiesuan_node.setVisible(false);
                //     this.game_began_node.setVisible(false);
                //
                // }else {
                //     this.chakanjiesuan_node.setVisible(false);
                //     this.game_began_node.setVisible(true);
                //     this.back_flow_btn.setVisible(false);
                //     this.liujuNode.setVisible(false);
                //     this.liujuwindowbg.setVisible(false);
                //     this.setSwallowTouches(false);
                // }
                this.params.scene.menu.setMenuState("table_end");
                this.params.closeCallBackFun();
                this.windowClose();
            // }
        },

        onBackTask:function () {
            //this.task_node.setVisible(false);//任务面板
            this.chakanjiesuan_node.setVisible(false);
            this.game_began_node.setVisible(true);
            this.back_flow_btn.setVisible(false);
            this.liujuNode.setVisible(false);
            this.liujuwindowbg.setVisible(false);
            this.setSwallowTouches(false);
        },

        onFinalView:function () {
            this.onContinue();
        },

        onContinue:function(){
            //判断桌子类型
            /*if(this.isCreate){//如果是一个自建桌
                if (MODEL_ROUND_RESULT.getSiChuanFinal( GLOBAL_T.MYSEAT ) == 1) {//自建桌最后一局
                    var parent = this.getRootNode().getParent();
                    this.windowClose();
                    GLOBAL_OBJ.bkernel.windows.Factory.produce(
                        GLOBAL_OBJ.table.windows.consts.C_TABLE_BUDGET_FINAL,
                        { scene: this.params.scene},
                        parent
                    );
                }else{
                    C2S.requestNextRound(
                        MODEL_TABLEINFO.getRoomId(),
                        MODEL_TABLEINFO.getTableId(),
                        MODEL_TABLEINFO.getActiveServerSeatId()
                    );
                }
            }else{
                GLOBAL_OBJ.businesses.functions.coinTableDoNext();
            }*/
            GLOBAL_OBJ.businesses.functions.coinTableDoNext();
        },

				/*
		@touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            // if(cc.rectContainsPoint(rect, point)) {
            // 	// this.windowClose();
            // }
            return true;
        }

	});
	//end
})();