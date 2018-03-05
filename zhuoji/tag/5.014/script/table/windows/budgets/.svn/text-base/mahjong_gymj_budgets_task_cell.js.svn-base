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
    GLOBAL_OBJ.table.windows.gymj.result.Budgets.TaskCell = cc.Class.extend({
		_TAG:"table.windows.gymj.result.Budgets.TaskCell",
		ctor: function() {
			this.init(GLOBAL_OBJ.RES.GYMJ_BUDGETS_TASK_CELL_CCBI);
		},

		init:function(_ccbi){
			this.rootNode = cc.BuilderReader.loadWithController(_ccbi, this, this);
		},

        getRootNode:function () {
		    return this.rootNode;
        },

        updateTaskCell:function (data) {
            GLOBAL_OBJ.LOGD(this._TAG, "updateTaskCell ...");
            var that = this;
            GLOBAL_OBJ.bkernel.utils.Animation.play(
                that['tesk_node'],
                GLOBAL_OBJ.RES.GYMJ_TASK_YIFAFANG_CCBI,
                cc.p(0,0),
                function(_ani){
                    var scale = data.current / data.total;
                    _ani['curNum'].setString(data.current);
                    _ani['nextNum'].setString(data.nextNum);
                    _ani['totalNum'].setString(data.total);
                    _ani['coupon_tip'].setString(data.prize);
                    var c_size = _ani['coupon_tip'].getContentSize();
                    var c_lenth = 254;
                    var icon_pox = 0.185;
                    var bg_size = _ani['task_bg'].getContentSize();
                    if (c_size.width > c_lenth * 0.7) {
                        _ani['task_bg'].setContentSize(c_size.width*1.4,bg_size.height);
                        _ani['task_icon'].setPositionX(c_size.width*1.1*icon_pox);
                    }else {
                        _ani['task_bg'].setContentSize(c_lenth,bg_size.height);
                        _ani['task_icon'].setPositionX(c_lenth*icon_pox);
                    }
                    var img = "";
                    if(data.type == "user:coupon"){//奖券
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_QUAN_PNG;
                    }else if(data.type == "user:chip"){//金币
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_CHIP_PNG;
                    }else{
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_CHIP_PNG;
                    }
                    GLOBAL_OBJ.LOGD(that._TAG, "updateTaskCell img = " + img);
                    GLOBAL_FUNCS.textureChange(_ani['task_icon'], img);
                },
                function(_ani){
                    _ani.playAnim( "add",
                        cc.p(0,0),
                        function(_ani_1){
                        },
                        true );
                },
                true,1,"popup"
            );

            // that['tesk_node'].scheduleOnce(function () {
            //
            // },0.5);
        },
        
        //完成开始下一轮
        newTaskCell:function(data) {
            GLOBAL_OBJ.LOGD(this._TAG, "newTaskCell ...");
            var that = this;
            GLOBAL_OBJ.bkernel.utils.Animation.play(
                that['tesk_node'],
                GLOBAL_OBJ.RES.GYMJ_TASK_YIFAFANG_CCBI,
                cc.p(0,0),
                function(_ani){
                    var scale = data.current / data.total;
                    _ani['curNum'].setString(data.current);
                    _ani['nextNum'].setString(data.nextNum);
                    _ani['totalNum'].setString(data.total);
                    _ani['coupon_tip'].setString(data.prize);
                    var c_size = _ani['coupon_tip'].getContentSize();
                    var c_lenth = 254;
                    var icon_pox = 0.185;
                    var bg_size = _ani['task_bg'].getContentSize();
                    if (c_size.width > c_lenth * 0.7) {
                        _ani['task_bg'].setContentSize(c_size.width*1.4,bg_size.height);
                        _ani['task_icon'].setPositionX(c_size.width*1.1*icon_pox);
                    }else {
                        _ani['task_bg'].setContentSize(c_lenth,bg_size.height);
                        _ani['task_icon'].setPositionX(c_lenth*icon_pox);
                    }
                    var img = "";
                    if(data.type == "user:coupon"){//奖券
                        img = GLOBAL_OBJ.RES.GYMJ_TASK_QUAN_PNG;
                    }else if(data.type == "user:chip"){//金币
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
                                    _ani['nextNum'].setString(0);
                                    _ani['curNum'].setString(0);
                                    _ani['totalNum'].setString(data.total);
                                    _ani_2.playAnim( "play",
                                        cc.p(0,0),
                                        function(_ani_3){
                                        },
                                        true );
                                },
                                true );
                        },
                        true );
                },
                true,1,"popup"
            );
            
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