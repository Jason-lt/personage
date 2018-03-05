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

    GLOBAL_OBJ.table.windows.gdmj.jipinghu.Budgets.TaskCell = cc.Class.extend({
		_TAG:"table.windows.gdmj.jipinghu.Budgets.TaskCell",
		ctor: function() {
			this.init(GLOBAL_OBJ.RES.GDMJ_BUDGETS_TASK_CELL_CCBI);
		},

		init:function(_ccbi){
			this.rootNode = cc.BuilderReader.loadWithController(_ccbi, this, this);
		},

        getRootNode:function () {
		    return this.rootNode;
        },

		update: function(cellData) {
		    this.nextData = cellData.nextData;
            this.updateTaskCell(cellData.scopeData);
		},

        updateTaskCell:function (data) {
            var scale = data.current / data.total;
            this['done_node'].setVisible(false);
            this['process_node'].setVisible(true);

            this['task_name'].setString(data.title);

            var img = "";
            if(data.type == "user:coupon"){//奖券
                img = GLOBAL_OBJ.RES.ICON_CREDIT_PNG;
            }else if(data.type == "user:chip"){//金币
                img = GLOBAL_OBJ.RES.GD_BUDGET_COIN_PNG;
            }else{
                img = GLOBAL_OBJ.RES.GD_BUDGET_COIN_PNG;
            }
            GLOBAL_FUNCS.textureChange(this['task_icon'], img);

            GLOBAL_OBJ.LOGD(this._TAG, "get_coupon_ = "+data.firstGetCoupon);
            this['coupon_tip'].setVisible(data.firstGetCoupon);

            var award = GLOBAL_FUNCS.formatGold(data.award);
            this['task_award'].setString(award);

            var awardText_width = this['task_award'].getContentSize().width;
            var awardIcon_width = this['task_icon'].getContentSize().width;

            this['task_award_adapt'].setContentSize(awardText_width + awardIcon_width, 50);

            var processStr = data.current + " / " + data.total;
            this['task_process'].setString(processStr);

            var bgWidth = this['task_process_back'].getContentSize().width;
            var pwidth = bgWidth * scale;
            pwidth = pwidth < 27 ? 27 : pwidth;
            var task_process_slide = this['task_process_slide'];
            if (scale > 0){
                task_process_slide.setVisible(true);
                if (data.progressTime)
                {
                    task_process_slide.setContentSize(cc.size(pwidth, 27));
                }
                else
                {
                    GLOBAL_OBJ.Util.playProgressAni(task_process_slide, 0, pwidth, 0, 1);
                }
            }
            else{
                task_process_slide.setVisible(false);
            }

            if (data.current == data.total && this.nextData) {
                var that = this;
                this.rootNode.scheduleOnce(function () {
                    that['done_node'].setVisible(true);
                    that['process_node'].setVisible(false);
                    GLOBAL_OBJ.bkernel.utils.Animation.play(
                        that['done_node'],
                        GLOBAL_OBJ.RES.WUHAN_YIFAFANG_CCBI,
                        cc.p(0, 0),
                        function (_ani) {},
                        function (_ani) {
                            that.runFlipAni(that.rootNode, _ani.getRootNode(), function () {
                                that.nextData.progressTime = 0;
                                that.updateTaskCell(that.nextData);
                            }, 1);
                        },
                        true);
                }, 1.5);
            }
        },

        runFlipAni: function( _sprite, _seenSprite, _callFunc, _times ) {
            var oc1     = cc.OrbitCamera.create(0.2, 1, 0, 0, 90, 0, 0);
            var scale1  = cc.ScaleTo.create(0.2, 0.9);

            var call    = cc.CallFunc.create(function () {
                if(_seenSprite){
                    _seenSprite.setVisible(false);
                }
                _callFunc(_times);
            });

            var oc2     = cc.OrbitCamera.create(0.2, 1, 0, 270, 90, 0, 0);
            var scale2  = cc.ScaleTo.create(0.2, 1.0);

            _sprite.runAction(cc.Sequence.create(cc.Spawn.create(oc1, scale1), call, cc.Spawn.create(oc2, scale2)));
        }

	});

})();