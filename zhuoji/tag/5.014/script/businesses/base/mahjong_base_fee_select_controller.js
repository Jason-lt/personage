/*************************************************************
 *  mahjong_base_fee_select_controller.js
 *  mahjong
 下拉框控件
 *
 *  Created by nick.kai.lee on 16-07-14
 *  特殊说明：

 使用方法:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.base.FeeSelect = GLOBAL_OBJ.bkernel.base.BaseController.extend({
        _TAG:"GLOBAL_OBJ.businesses.base.FeeSelect",
        ctor:function () {
            this._super();
            GLOBAL_OBJ.LOGD(this._TAG, " ctor new");
            // 费用选择框是否打开
            this._isOn = false;
            // 费用cell控制器列表
            this._feeCellControllers = [];
            // 每个cell的高度
            this._feeCellHeight = 60; // 常量
            this._feeCellWidth = 272; // 常量

            this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_REGISTRATION_FEE_SELECT_CCBI);
        },

        onLoad:function () {
            this._super();

            GLOBAL_OBJ.LOGD(this._TAG, " _load");
            this["switch_btn"].setVisible(false);
            this["effect_button"].setVisible(false);
            this["s9s_select_frame"].setContentSize(cc.size(this._feeCellWidth - 50, this._feeCellHeight));

            /* 对选择框范围外的点击处理回调 */
            var that = this;
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) {
                    var target = that["s9s_select_frame"];
                    var touchPosInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);

                    return !cc.rectContainsPoint(rect, touchPosInNode);
                },
                onTouchMoved: function (touch, event) {
                    //this.setPosition(this.getPosition() + touch.getDelta());
                },
                onTouchEnded: function (touch, event) {
                    if (that._isOn) {
                        that._isOn = false;
                        that._closeSelectFrame();
                    }
                }
            });
            cc.eventManager.addListener(listener, -999);
            this._listener = listener;
        },

        onCleanup:function () {
            GLOBAL_OBJ.LOGD(this._TAG, " onCleanup");
            this._listener && cc.eventManager.removeListener(this._listener);
            this._listener = null;

            // 费用cell控制器列表
            for (var i = 0; i < this._feeCellControllers.length; i++) {
                this._feeCellControllers[i].destroy();
            }
            this._feeCellControllers = null;
        },

        // 改变按钮图片
        _changeControlButtonImg:function (btn, sprite_name) {
            btn.setBackgroundSpriteForState(cc.Scale9Sprite.createWithSpriteFrameName(sprite_name), cc.CONTROL_STATE_NORMAL);
            btn.setBackgroundSpriteForState(cc.Scale9Sprite.createWithSpriteFrameName(sprite_name), cc.CONTROL_STATE_HIGHLIGHTED);
            btn.setBackgroundSpriteForState(cc.Scale9Sprite.createWithSpriteFrameName(sprite_name), cc.CONTROL_STATE_DISABLED);
        },

        // 展开按钮回调
        onSwitch:function () {
            cc.log(this._TAG + " onSwitch");

            hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);

            this._isOn = !this._isOn;
            if (this._isOn) {
                cc.log(this._TAG + " switch_on");
                this._openSelectFrame();
            } else {
                cc.log(this._TAG + " switch_off");
                this._closeSelectFrame();
            }
        },

        // 展开报名费选择框
        _openSelectFrame:function () {
            this._changeControlButtonImg(this["switch_btn"], GLOBAL_OBJ.RES.MATCH_DETAILS_BAOMINGFEI_BTN_UP_PNG);
            var feeNum = this._feeCellControllers.length;
            this["s9s_select_frame"].setContentSize(cc.size(this._feeCellWidth, this._feeCellHeight * feeNum));
            this._feeCellControllers[0].rootNode.setPositionY(this._feeCellHeight * (feeNum - 1));
            for (var i = 1; i < feeNum; i++) {
                var feeController = this._feeCellControllers[i];
                feeController.rootNode.setPositionY(this._feeCellHeight * (feeNum - i - 1));
                feeController.rootNode.setVisible(true);
            }
            this["effect_button"].setVisible(false);
        },
        // 关闭报名费选择框
        _closeSelectFrame:function () {
            this._changeControlButtonImg(this["switch_btn"], GLOBAL_OBJ.RES.MATCH_DETAILS_BAOMINGFEI_BTN_DOWN_PNG);
            this["s9s_select_frame"].setContentSize(cc.size(this._feeCellWidth, this._feeCellHeight));
            this._feeCellControllers[0].rootNode.setPositionY(0);
            var feeNum = this._feeCellControllers.length;
            for (var i = feeNum - 1; i > 0; i--) {
                this._feeCellControllers[i].rootNode.setVisible(false);
            }
            this["effect_button"].setVisible(true);
        },

        // 创建一项报名费
        _createFeeCellController:function (feeInfo) {
            var controller = new GLOBAL_OBJ.businesses.base.FeeSelectCell(this);
            controller.refreshWithFeeInfo(feeInfo);
            if (this._lineName) {
                controller.setLine(this._lineName);
            }
            return controller;
        },

        // 将选中的付费方式的cell移动到最顶部
        _cellMoveTop:function (cell_no) {
            var feeNum = this._feeCellControllers.length;
            var controller = this._feeCellControllers[cell_no];
            for (var j = cell_no; j > 0; j--) {
                this._feeCellControllers[j] = this._feeCellControllers[j-1];
                this._feeCellControllers[j].rootNode.setPositionY(this._feeCellHeight * (feeNum - j - 1));
                this._feeCellControllers[j].setNo(j);
            }
            this._feeCellControllers[0] = controller;
            controller.setNo(0);
            controller.rootNode.setPositionY(0);
        },

        // 选中了付报名费的方式
        selectFeeCellController:function (cell_no) {
            var feeNum = this._feeCellControllers.length;
            if (this._isOn && cell_no > 0 && cell_no < feeNum) { // 选择框打开状态 而且用户点击的不是第一个付费方式
                hall.AudioHelper.playEffect(hall.EffectPath.button_click_sound, false);
                this._isOn = false;
                this._cellMoveTop(cell_no);
                this._closeSelectFrame();
            } else {
                this.onSwitch();
            }
        },

        // 设置选择框的背景图片
        setBackground:function (s9sName) {
            this["s9s_select_frame"].setSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrame(s9sName));
        },

        // 设置报名费之间的分割线图片
        setLine:function (lineName) {
            this._lineName = lineName;
            for (var i = 0; i < this._feeCellControllers.length; i++) {
                this._feeCellControllers[i].setLine(lineName);
            }
        },

        // 检查付费信息，如果已经报名只显示报名的费用，其他的删掉
        _checkFeesInfo:function (info) {
            var feesInfo = info || [];
            if (feesInfo.length == 0) {
                return [{desc:"  免费"}];
            }
            var retInfo = [];
            for (var i = 0; i < feesInfo.length; i++) {
                if (feesInfo[i].selected) {
                    retInfo.push(feesInfo[i]);
                    return retInfo;
                }
            }

            return feesInfo;
        },

        // 检查费用controllers 只有一个就不用显示下拉按钮
        _checkFeeCellController:function () {
            var controllerNum = this._feeCellControllers.length;

            if (controllerNum == 1) {
                this["s9s_select_frame"].setContentSize(cc.size(this._feeCellWidth - 50, this._feeCellHeight));
                this["switch_btn"].setVisible(false);
                this._feeCellControllers[0].setTouchEnabled(false);
                this["effect_button"].setVisible(false);
            } else {
                this["s9s_select_frame"].setContentSize(cc.size(this._feeCellWidth, this._feeCellHeight));
                this["switch_btn"].setVisible(true);
                this._feeCellControllers[0].setTouchEnabled(true);
                this["effect_button"].setVisible(true);
            }
        },

        // 刷新报名费列表 info:列表信息
        refreshFeesList:function (info) {
            // var _info = [
            // 	{desc:"1000金币", img:"http", selected:false, type:"user:free", fulfilled: 1},
            // 	{desc:"1张参赛券", img:"", selected:false, type:"user:free"},
            // 	{desc:"1张报名券", img:"", selected:false, type:"user:free"}
            // ];
            // var feesInfo = this._checkFeesInfo(info.concat(_info));
            var feesInfo = this._checkFeesInfo(info);

            var feeNum = feesInfo.length;
            var controllerNum = this._feeCellControllers.length;

            // 整理报名费列表，生成报名费CellController的参数列表（排序）
            var cellArgv = [];
            var j = 0,i = 0, arg;
            for (i = 0; i < feeNum; i++) {
                if (feesInfo[i].fulfilled == 1) {
                    arg = {no:j, max:feeNum, index:i, fee:feesInfo[i]};
                    cellArgv.push(arg);
                    j++;
                }
            }

            for (i = 0; i < feeNum; i++) {
                if (feesInfo[i].fulfilled != 1) {
                    arg = {no:j, max:feeNum, index:i, fee:feesInfo[i]};
                    cellArgv.push(arg);
                    j++;
                }
            }

            // 更新报名费列表
            for (i = 0; i < feeNum; i++) {
                if (i >= controllerNum) {
                    // {no:i, max:feeNum, index:i, fee:feesInfo[i]}
                    // no显示顺序编号 max当前总付费种类数 index对应后端付费索引 fee付费信息
                    var feeController = this._createFeeCellController(cellArgv[i]);
                    this["s9s_select_frame"].addChild(feeController.rootNode);
                    this._feeCellControllers.push(feeController);
                    if (i > 0) {
                        feeController.rootNode.setVisible(false);
                    }
                } else {
                    this._feeCellControllers[i].refreshWithFeeInfo(cellArgv[i]);
                }
            }

            // 删掉列表中多余的报名费
            if (feeNum < controllerNum) {
                for (j = controllerNum - 1; j >= feeNum; j--) {
                    this._feeCellControllers[j].destroy();
                    this._feeCellControllers[j].rootNode.removeFromParent(true);
                    this._feeCellControllers.pop();
                }
            }

            this._checkFeeCellController();
        },

        // 获取选中的报名费信息
        getSelectedFee:function () {
            if (this._feeCellControllers.length > 0) {
                return this._feeCellControllers[0].getFeeInfo();
            }
            return {type:"user:free"};
        },

        // 获取选中的报名费信息索引
        getSelectedFeeIndex:function () {
            if (this._feeCellControllers.length > 0) {
                return this._feeCellControllers[0].getFeeIndex();
            }
            return 0;
        }
    });

    GLOBAL_OBJ.businesses.base.FeeSelectCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
        _TAG:"businesses.base.FeeSelectCell",
        ctor:function (selectController) {

            this._super();
            GLOBAL_OBJ.LOGD(this._TAG, " ctor new");

            // 费用文本框最大长度
            this._labelMaxWidth = 256;

            this._selectController = selectController;
            this._feeInfo = {};
            this._no = 0;	  // 当前fee的编号
            this._max = 3;    // fee的总个数
            this._index = -1; // 付费索引

            this.init(GLOBAL_OBJ.RES.MAHJ_MATCH_REGISTRATION_FEE_CELL_CCBI);
        },

        onLoad:function () {
            this._super();
            GLOBAL_OBJ.LOGD(this._TAG, " _load");
        },

        destroy:function () {
            GLOBAL_OBJ.LOGD(this._TAG, " destroy");
            this._selectController = null;
        },

        onSelected:function () {
            cc.log(this._TAG + " onSelected");
            this._selectController.selectFeeCellController(this._no);
        },

        getViewHeight:function () {
            return this.rootNode.getContentSize().height;
        },

        _setLineVisible:function (b) {
            this["img_line"].setVisible(b);
        },

        _selected:function (s) {
            if (s) {
                this["label_fee"].setColor(cc.color(254,245,86));
            } else {
                this["label_fee"].setColor(cc.color(211,211,211));
            }
            this._feeInfo.selected = s;
        },

        setNo:function (no) {
            this._no = no;
            this._setLineVisible(no != 0);
            this._selected(no == 0);
        },

        setLine:function (lineName) {
            this["img_line"].setSpriteFrame(cc.SpriteFrameCache.getInstance().getSpriteFrame(lineName));
        },

        setTouchEnabled:function (b) {
            this["btn_select"].setEnabled(b);
        },

        refreshWithFeeInfo:function (info) {
            this._feeInfo = info.fee;
            this._max = info.max; // fee的总个数
            this._index = info.index;
            this.setNo(info.no);

            this["label_fee"].setString(this._feeInfo.desc);
            var label_w = this["label_fee"].getContentSize().width;
            if (label_w > this._labelMaxWidth) {
                this["label_fee"].setScale(this._labelMaxWidth/label_w);
            } else {
                this["label_fee"].setScale(1);
            }
        },

        getFeeInfo:function () {
            return this._feeInfo;
        },

        getFeeIndex:function () {
            return this._index;
        }
    });

})();