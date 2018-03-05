/*************************************************************
 *  mahjong_gdmj_budgets_task_cell.js
 	广东麻将-鸡平胡 结算面板，任务格子
 *
 *  Created by xujing on 17-11-07
 *  特殊说明：
 	
    使用方法:
 */
(function(){
	var GLOBAL_OBJ         = guiyang;
	var GLOBAL_FUNCS       = GLOBAL_OBJ.businesses.functions;
    var MODEL_TASK_WINSTREAK	  = GLOBAL_OBJ.table.models.winstreaktask;

    var __relativeos__ = function(_ani){
        var c_size = _ani['coupon_tip'].getContentSize();
        var c_lenth = 254;
        var bg_size = _ani['task_bg'].getContentSize();
        if (c_size.width > c_lenth * 0.71) {
            _ani['panelNode'].setContentSize(c_size.width*1.4,bg_size.height + 20);
            _ani['task_bg'].setContentSize(c_size.width*1.4,bg_size.height);
            _ani['task_bg'].setPositionX(c_size.width*1.4);
            _ani['coupon_tip'].setPositionX(c_size.width*1.4 * 0.633);
        }else {
            _ani['panelNode'].setContentSize(c_lenth,bg_size.height + 20);
            _ani['task_bg'].setContentSize(c_lenth,bg_size.height);
            // _ani['task_bg'].setPositionX(c_lenth);
            _ani['coupon_tip'].setPositionX(c_lenth * 0.633);
        }
    };

    GLOBAL_OBJ.table.windows.gymj.result.Budgets.TaskStreakCell = cc.Class.extend({
		_TAG:"table.windows.gymj.result.Budgets.TaskStreakCell",
		ctor: function() {
			this.init(GLOBAL_OBJ.RES.GYMJ_BUDGETS_TASK_CELL_CCBI);
		},

		init:function(_ccbi){
			this.rootNode = cc.BuilderReader.loadWithController(_ccbi, this, this);
		},

        getRootNode:function () {
		    return this.rootNode;
        },

        updateTaskCell:function () {
            this.winCount = MODEL_TASK_WINSTREAK.getWinStreakCount();
            this.desc = MODEL_TASK_WINSTREAK.getWinStreakDesc();
            this.awardItems = MODEL_TASK_WINSTREAK.getCurStreakawardItems(this.winCount) || [];
            if (MODEL_TASK_WINSTREAK.getWinStreaks()) {
                this.isStreaks();
            }else {
               this.notStreaks();
            }
        },

        // 任务中断
        notStreaks:function () {
            GLOBAL_OBJ.LOGD(this._TAG, "notStreaks ...");
            var that = this;
            GLOBAL_OBJ.bkernel.utils.Animation.play(
                that['tesk_node'],
                GLOBAL_OBJ.RES.GYMJ_TASK_YIFAFANG_STREAK_CCBI,
                cc.p(0,0),
                function(_ani){
                    // var prize = MODEL_TASK_WINSTREAK.getCurStreakPrize(that.winCount);
                    _ani['coupon_tip'].setString("好可惜,再来一局");

                    _ani['curNum'].setVisible(false);
                    _ani['totalNum'].setVisible(false);
                    _ani['nextNum'].setVisible(false);
                    _ani['notStreak'].setVisible(true);

                    __relativeos__(_ani);
                    var img = "";
                    var type = "";
                    if (that.awardItems[0] && that.awardItems[0].itemId) {
                        type = that.awardItems[0].itemId;
                    }
                    if(type == "user:coupon"){//奖券
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_QUAN_PNG;
                    }else if(type == "user:chip"){//金币
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_CHIP_PNG;
                    }else{
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_CHIP_PNG;
                    }

                    GLOBAL_FUNCS.textureChange(_ani['task_icon'], img);
                },
                function(_ani){
                },
                true,1,"popup"
            );
        },
        
        //连胜
        isStreaks:function() {
            GLOBAL_OBJ.LOGD(this._TAG, "isStreaks ...");
            var that = this;
            GLOBAL_OBJ.bkernel.utils.Animation.play(
                that['tesk_node'],
                GLOBAL_OBJ.RES.GYMJ_TASK_YIFAFANG_STREAK_CCBI,
                cc.p(0,0),
                function(_ani){
                    var prize = MODEL_TASK_WINSTREAK.getCurStreakPrize(that.winCount);
                    GLOBAL_OBJ.LOGD(that._TAG, "isStreaks ...prize = " + prize);
                    _ani['coupon_tip'].setString(prize);

                    var data = MODEL_TASK_WINSTREAK.loopAcviveTransition();
                    _ani['curNum'].setVisible(true);
                    _ani['totalNum'].setVisible(true);
                    _ani['nextNum'].setVisible(true);
                    _ani['curNum'].setString(data.current);
                    _ani['nextNum'].setString(data.nextNum);

                    _ani['notStreak'].setVisible(false);

                    __relativeos__(_ani);
                    var img = "";
                    var type = "";
                    if (that.awardItems[0] && that.awardItems[0].itemId) {
                        type = that.awardItems[0].itemId;
                    }
                    if(type == "user:coupon"){//奖券
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_QUAN_PNG;
                    }else if(type == "user:chip"){//金币
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_CHIP_PNG;
                    }else{
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_CHIP_PNG;
                    }
                    GLOBAL_FUNCS.textureChange(_ani['task_icon'], img);
                },
                function(_ani){
                    _ani.playAnim( "add",
                        cc.p(0,0),
                        function(_ani_1){
                            _ani_1.playAnim( "yifafang",
                                cc.p(0,0),
                                function(_ani_2){
                                },
                                true );
                        },
                        true );
                },
                true,1,"popup"
            );
        }

	});

})();