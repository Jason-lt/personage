(function(){
    var GLOBAL_OBJ = guiyang;
    /**
     * 任务分享类
     */
    var MODEL_TASK_WINSTREAK = GLOBAL_OBJ.table.models.winstreaktask;
    var GLOBAL_T             = GLOBAL_OBJ.table.global;
    var MODEL_ROUND_RESULT   = GLOBAL_OBJ.table.models.roundresult;
    var GLOBAL_FUNCS 		 = GLOBAL_OBJ.businesses.functions;
    var MODEL_USER           = GLOBAL_OBJ.businesses.modules.User.Model;

    GLOBAL_OBJ.table.windows.gdmj.jipinghu.Budgets.Task_Share = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
        _TAG: 'table.windows.gdmj.jipinghu.Budgets.Task_Share',
        ctor: function() {
            this._super();
            this.init(GLOBAL_OBJ.RES.GDMJ_BUDGET_TASK_SHARE_CCBI);
        },

        onLoad: function() {
            this._super();
            var that = this;
            this.setSwallowTouches(false);

            var size  = cc.director.getWinSize();
            var bgSize = this['task_share_bg'].getContentSize();
            var scal = Math.max(size.width/bgSize.width, size.height/bgSize.height);
            this['task_share_bg'].setScale(scal);

            var lianshengcount = MODEL_TASK_WINSTREAK.getWinStreakCount();//连胜次数
            var maxcount = MODEL_TASK_WINSTREAK.getMaxWinCount();//最大连胜次数

            this.womanAnimal = new sp.SkeletonAnimation(GLOBAL_OBJ.RES.SPINE_FIGURES_JSON, GLOBAL_OBJ.RES.SPINE_FIGURES_ATLAS);
            this.dahu_woman_node.addChild(this.womanAnimal);
            this.womanAnimal.setAnimation(0, "animation", false);
            this.womanAnimal.setPosition(cc.p(0,0));

            var gewei = lianshengcount % 10;
            var shiwei = Math.floor(lianshengcount / 10);
            var geImg = GLOBAL_OBJ.RES["BUDGETS_SICHUAN_TASK_NUM" + gewei + "_PNG"];
            var shiImg = GLOBAL_OBJ.RES["BUDGETS_SICHUAN_TASK_NUM" + shiwei + "_PNG"];
            GLOBAL_FUNCS.textureChange(that.task_share_ge, geImg);
            that.task_share_ge.setVisible(true);
            if (shiwei != 0) {
                GLOBAL_FUNCS.textureChange(that.task_share_shi, shiImg);
                that.task_share_shi.setVisible(true);
            }

            var shengnum;
            if(lianshengcount <= 1){
                shengnum = 1;
            }else if(lianshengcount >= 10){
                shengnum = 10;
            }else{
                shengnum = lianshengcount;
            }
            var lsname = GLOBAL_OBJ.RES["BUDGETS_SICHUAN_TASK_SHARE_SHENG" + shengnum + "_PNG"];
            GLOBAL_FUNCS.textureChange(that.task_share_lsname, lsname);
            if(lianshengcount <= 0){
                that.task_share_lsname.setVisible(false);
            }

            this.task_share_txt.setString("历史最佳：" + maxcount + "连胜");

            //刷新 手牌模块
            this.unseenSlots   = [
                this.unseenSlot_1,  this.unseenSlot_2,  this.unseenSlot_3,  this.unseenSlot_4,
                this.unseenSlot_5,  this.unseenSlot_6,  this.unseenSlot_7,  this.unseenSlot_8,
                this.unseenSlot_9,  this.unseenSlot_10, this.unseenSlot_11, this.unseenSlot_12,
                this.unseenSlot_13, this.unseenSlot_14, this.unseenSlot_15
            ];

            //吃碰杠节点组
            this.methodSlots   = [
                this.cpgNode_1,  this.cpgNode_2,  this.cpgNode_3,  this.cpgNode_4
            ];

            /*
             大胡界面数据
             刷新 本家手牌信息 */
            var totalnum = GLOBAL_OBJ.table.scenes.Table.Functions.dahu_recovery_tiles(MODEL_TASK_WINSTREAK,
                GLOBAL_T.MYSEAT, GLOBAL_T.SEATS.N2, this.unseenSlots, this.methodSlots, true);
            var dhcpgPos = this.dahu_cpg_node.getPosition();
            var offX 	 = 24 * totalnum;
            dhcpgPos.x   = dhcpgPos.x + offX;
            this.dahu_cpg_node.setPosition(dhcpgPos);

            // 胡的牌
            this.share_dahu_node.setVisible(true);
            var tile     = MODEL_TASK_WINSTREAK.getWinTile(GLOBAL_T.MYSEAT);
            var k_index = 0;
            for(var key in tile){
                k_index = k_index + 1;
            }
            var size2 = this["sharehu_" + 0].getBoundingBox();
            for(var i = 0; i < 5; i++){
                if(i < k_index){
                    var huMj = new GLOBAL_OBJ.table.windows.SiChuan.XueZhan.Budgets.XZDHCell();
                    huMj.update(i,"share");
                    this["sharehu_" + i].addChild(huMj.getRootNode());
                    this["sharehu_" + i].setVisible(true);
                    huMj.getRootNode().setPosition(cc.p(size2.width/2.0, size2.height/2.0));
                }
            }


            // 头像
            var uid = MODEL_ROUND_RESULT.getUserIdByLocalId(GLOBAL_T.MYSEAT);
            if (this.task_share_tou.getChildrenCount() == 0 && uid>0) {
                GLOBAL_OBJ.businesses.modules.User.Portrait.produce( uid,
                    GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW, this['task_share_tou']);
                this.task_share_tou.setScale(1.5);
            }

            var userName = MODEL_USER.getName(uid);
            this.task_username.setString(userName.toString());
        },

    });
})();