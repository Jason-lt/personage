// File: hall_test_tool.js
// Date: 2014-12-20 10:32:47
// Author: kink.han
// Company: Copyright (c) 2014 Tuyoo Co.,Ltd. All rights reserved.
/* Description:
    测试用的工具类,客户端有很多功能依赖服务器消息或特殊流程才可以运行到,测试时过于耗时.
    如:牌桌改名弹窗需要玩到3级时才可以测试一次.线上测一次要半小时.
    本类用于解决以上问题,为各种测试提供测试流程入口和mock对象.
    实现:
        场景基类BaseSceneController的onLoad内判断:
            ty.SystemInfo.getConfig().debug
            ty.SystemInfo.getConfig().testTool
        以上同时为true时会创建一个置顶精灵(点击优先级和显示优先级都最高).
        精灵可以拖动,点击后显示测试用例列表.
    管理:
        必须避免本类污染正式代码,所以正式代码除[实现]描述的实现外,正式代码不应再依赖本类任何代码.
        写测试时可通过事件和消息来实现.
        初步所有先关代码都写在这个js文件内,如果以后太大了再说.
        本类纯属提高效率的小工具,所以实现上能凑合就凑合,不需要搞太复杂.
    资源:
        hall/img/nopack/w_tmp.png

PS:
该段代码直接从大厅里挪过来了，因为大厅我们没有svn提交权限，所以方便大家共享一些比较好的testtool功能        
*/
(function(){
    var gg;//会重构,先这么处理一下
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.bkernel.utils.TestTool = hall.BaseController.extend({
        _TAG:"bkernel.utils.TestTool",
        _visable:false,
        _items:null,
        ctor:function(){
            this._super();
            this.init(hall.RES.HALL_COMMON_TMP_CCBI);
            this._visable = true;
            gg = this;
        },

        onLoad:function(){
            this._super();
            //TODO 拆分测试case到map中,不同场景有不同case,另外有个各场景通用case集合
            var data = {
                cases:[  
                    {
                        text:"启动",
                        desc:"newer",
                        code:function(){
                            
                            // 注意前后的顺序,注意文件名中不能有大写字母，否则在android中会有问题
                            var PATH        = "/Volumes/Nick.kai.lee/cocos2dx/tuyoo_global/mahjong/trunk/script/newer/";
                            var MJJSONFILE  = PATH+"include.json";
                            cc.log("NEW json path:"+MJJSONFILE);
                            
                            var requireScripts = function()
                            {
                                var arrScripts = JSON.parse(ty.FileManager.readFile(MJJSONFILE));
                                for(var nScript = 0, numScript = arrScripts.length; nScript < numScript; ++nScript)
                                {   
                                    arrScripts[nScript] = PATH+arrScripts[nScript];
                                    cc.sys.cleanScript(arrScripts[nScript]);
                                    require(arrScripts[nScript]);
                                }
                            };
                            requireScripts();

                            // if ("undefined" != typeof(Game)) {
                            //     Game.shut();
                            // };
                        },
                    },
                    {
                        text:"关闭",
                        desc:"拜雀神",
                        code:function(){
                            Game.shut();
                        },
                    },

                    {
                        text:"拜雀神",
                        desc:"拜雀神",
                        code:function(){
                            // var data = {"action": "pop_active_wnd", "params": {"right": {"pic_url": "http://42.62.53.180:50200/6/huodong_3_0_right_140821.jpg", "sub_action": {"action": "pop_lottery_wnd", "params": {"item_des": "\u5b9d\u7bb1\u62bd\u5956", "gold_des": "60000\u91d1\u5e01", "warning": "\u62bd\u5956\u5c06\u82b1\u8d396\u5143", "des": "\u8d60\u9001\u7b49\u503c\u91d1\u5e01\uff0c\u5b9d\u7bb1\u62bd\u5956\u66f4\u6709\u673a\u4f1a\u83b7\u5f97\n\u4e30\u5bcc\u5956\u52b1\u53ca\u9053\u5177\u54e6~", "sub_action": {"action": "pop_pay_order", "params": {"name": "\u8d85\u503c\u793c\u5305", "price": "6", "des": "\u8d85\u503c\u793c\u5305", "tip": "\u8d85\u503c\u793c\u5305", "price_diamond": "60", "addchip": 60000, "picurl": "http://42.62.53.180:50200/6/goods_t50k.png", "buy_type": "consume", "type": 1, "id": "TY9999D0006004"}}}}}, "left": {"pic_url": "http://42.62.53.180:50200/6/huodong_3_0_left_20141203.jpg", "sub_action": {"action": "rep_sence_activity", "params": {"url": "http://42.62.53.180:50200/dizhu2/activities/34.html"}}}}};
                            // hall.ToDoTask.runOneTask(data);
                            var wnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                                GLOBAL_OBJ.businesses.windows.consts.C_GODRAFFLE,{roomId:7004,index:2},hall.SceneManager.getCurrentController().getRootNode());
                        },
                    },
                    {
                        text:"每日特惠",
                        desc:"拜雀神",
                        code:function(){
                            // GLOBAL_OBJ.bkernel.network.C2SFrequency.reset({cmd:GLOBAL_OBJ.businesses.network.EventType.USER,
                                // action:"table_raffle",time:0},null);
                            var wnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                                GLOBAL_OBJ.businesses.windows.consts.C_DAILY_DISCOUT,{},hall.SceneManager.getCurrentController().getRootNode());
                        },
                    },
                    {
                        text:"热加载麻将",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            GLOBAL_OBJ.bkernel.utils.ReloadScript.extend();
                        },
                    },
                    {
                        text:"计费点",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var cmds = {"cmd":"todo_tasks","result":{"gameId":7,"userId":10010,"tasks":[{"action":"pop_order_info","params":{"allow_close":true,"des":"您的钻石不够哦~\n现在8元立得80钻石！","note":"fuck ...","price":"8","detail":"80钻石","sub_action":{"action":"pop_pay_order","params":{"id":"TY9999R0008005","name":"80钻石","price":"8","desc":"80钻石","type":1,"addchip":0,"buy_type":"charge","picurl":"http://111.203.187.165:8010/hall/pdt/imgs/goods_diamond.png","tip":"80钻石","price_diamond":"80"}}}}]}}
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"拜雀神存钱",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            GLOBAL_OBJ.businesses.network.C2S.requestRaffleTableSave(7001,10000);//普通
                            GLOBAL_OBJ.businesses.network.C2S.requestRaffleTableSave(7003,50000);//疯狂
                            GLOBAL_OBJ.businesses.network.C2S.requestRaffleTableSave(7004,500000);//至尊
                        },
                    },
                    {
                        text:"拜雀神入口",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var wnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                                GLOBAL_OBJ.businesses.windows.consts.C_GODRAFFLEENTRY,{},hall.SceneManager.getCurrentController().getRootNode());
                        },
                    },
                    {
                        text:"幸运转盘",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var wnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                                GLOBAL_OBJ.businesses.windows.consts.C_LUCKYWHEEL,{index:0},hall.SceneManager.getCurrentController().getRootNode());
                        },
                    },
                    {
                        text:"话费兑换",
                        desc:"",
                        code:function(){
                            var wnd = GLOBAL_OBJ.bkernel.windows.Factory.produce(
                                GLOBAL_OBJ.businesses.windows.consts.C_CALL_EXCHANGE,{"innerClose":true,"title":"04Huafdh_title_word_hfdh"},hall.SceneManager.getCurrentController().getRootNode());
                        }
                    },
                    {
                        "text":"话费兑换数据",
                        "desc":"",
                        code:function(){
                            var cmds = {
                              "cmd": "user",
                              "result": {
                                "action": "conpon_exchange_infos",
                                "gameId": 7,
                                "userId": 10001,
                                "name": "玩家昵称",
                                "phonenumber": "12345678901",
                                "isbind": 1,
                                "coupon": 123456,
                                "items": [
                                  {
                                    "id": 4,
                                    "coupon": 1180,
                                    "name": "10元",
                                    "pic": "http://111.203.187.157:8010/hall/exch/imgs/phone_10.png"
                                  },
                                  {
                                    "id": 5,
                                    "coupon": 3450,
                                    "name": "30元",
                                    "pic": "http://111.203.187.157:8010/hall/exch/imgs/phone_30.png"
                                  },
                                  {
                                    "id": 6,
                                    "coupon": 5500,
                                    "name": "50元",
                                    "pic": "http://111.203.187.157:8010/hall/exch/imgs/phone_50.png"
                                  },
                                  {
                                    "id": 7,
                                    "coupon": 10000,
                                    "name": "100元",
                                    "pic": "http://111.203.187.157:8010/hall/exch/imgs/phone_100.png"
                                  }
                                ],
                                "pathway": [
                                  {
                                    "action": "send_msg",
                                    "params": {
                                      "msg": {
                                        "cmd": "quick_start",
                                        "params": {
                                          "play_mode": "guobiao"
                                        }
                                      }
                                    },
                                    "desc": "拜雀神 quick_start进入到一个桌面"
                                  },
                                  {
                                    "action": "code_injection",
                                    "params": {
                                        "code":"ty.NotificationCenter.trigger(hall.EventType.HALL_COMMAND_SLOT_EXCUTE_DATA,{\"type\":\"roomlist\",\"nodes\":[],\"tasks\":[],\"gameId\":7,\"gameName\":\"雀神场\",\"version\":\"3.701\",\"gameType\":0,\"iconUrl\":\"\",\"nameUrl\":\"\",\"defaultRes\":\"MaJiangMatch\",\"isOffline\":0,\"quickstart\":{},\"pluginParams\":{\"gameType\":3},\"quitAlert\":1,\"quitAlertName\":\"去比赛\"});"
                                    },
                                    "desc": "进入比赛界面"
                                  }
                                ]
                              }
                            };
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        }
                    },
                    {
                        text:"绑定账号成功",
                        desc:"",
                        code:function(){
                            var cmds = {"cmd": "upgrade_account_success_ret"};
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        }
                    },
                    {
                        text:"进入准备牌桌",
                        desc:"",
                        code:function(){
                            var cmds = {"cmd":"m_start_wait","result":{"matchType":3, "gameId":7}};
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        }
                    },
                    {
                        text:"模拟物理返回键",
                        desc:"这个mj_scene_manager里面也需要改下",
                        code:function(){
                            var cmds = {"cmd": "keyback_test","result": {}};
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        }
                    },
                    {
                        text:"进入牌桌",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var cmds = {"cmd":"table_info","result":{"table_raffle":1,"tableId":710210010200,"roomId":71021001,"seatId":0,"userId":3,"table_state":"play","quan_men_feng":0,"play_timeout":9,"base_chip":100,"service_fee":60,"good_tile_chance":1.2,"maxSeatN":4,"big_degree_fee":[30,0.1,200],"room_coefficient":2,"play_mode":"guobiao","min_coin":3000,"max_coin":50000,"tableType":"normal","room_name":"\u4e2d\u7ea7\u573a","current_player_seat_id":0,"header_seat_id":0,"players":[{"name":"iPhone Simulator","sex":0,"userId":3,"pic":"http://ddz.image.tuyoo.com/avatar/head_piano.png","coin":27660,"max_win_sequence_count":8,"win_sequence_count":0,"max_degree":95,"master_point":79,"master_point_level":4,"master_point_level_diff":[29,50],"week_master_point":79,"charm":0,"seatId":0,"stat":"playing","ting":0,"member":{"flag":0},"vipInfo":{"vipExp":0,"vipLevel":{"level":0}}},{"name":"\u4eba\u6e23","sex":0,"userId":1112,"pic":"","coin":694070,"seatId":1,"stat":"playing","ting":0,"vipInfo":{"vipExp":0,"vipLevel":{"level":0}}},{"name":"PeggyCheng_fb","sex":0,"userId":1199,"pic":"","coin":726510,"seatId":2,"stat":"playing","ting":0,"vipInfo":{"vipExp":0,"vipLevel":{"level":0}}},{"name":"\u5076\u4e00\u5b9a\u8d0f","sex":1,"userId":1116,"pic":"","coin":709920,"seatId":3,"stat":"playing","ting":0,"vipInfo":{"vipExp":0,"vipLevel":{"level":0}}}],"table_product":[{"id":"TY9999D0006003","price":"6","needChip":0,"addchip":90000,"name":"60000\u91d1\u5e01","picurl":"http://111.203.187.148:8040/hall/pdt/imgs/goods_t50k.png","type":1,"desc":"1\u5143=15000\u91d1\u5e01","tip":"9\u4e07\u91d1\u5e01","buy_type":"direct","price_diamond":"60"}],"interactive_expression_config":{"0":{"chip_limit":110,"cost":2,"charm":0,"ta_charm":0},"1":{"chip_limit":110,"cost":2,"charm":0,"ta_charm":0},"2":{"chip_limit":110,"cost":1,"charm":0,"ta_charm":0},"3":{"chip_limit":110,"cost":1,"charm":0,"ta_charm":0}},"gameId":7}}
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"进入哈尔滨牌桌",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){

                        },
                    },
                    {
                        text:"进入比赛牌桌",
                        desc:"",
                        code:function(){
                            var cmds = {"cmd":"table_info","result":{"tableId":735110010188,"roomId":73511001,"seatId":2,"userId":10009,"table_state":"play","quan_men_feng":0,"match_type":3,"matchInst_Id":"7351.243","play_timeout":10,"base_chip":1000,"service_fee":0,"good_tile_chance":1.3,"maxSeatN":4,"big_degree_fee":[30,0.1,200],"room_coefficient":4,"play_mode":"guobiao","min_coin":10000,"max_coin":-1,"tableType":"normal","room_name":"\u514d\u8d39\u8bdd\u8d39\u8d5b","current_player_seat_id":0,"header_seat_id":0,"players":[{"name":"\u8f69\u8f95\u65e0\u9053","sex":0,"userId":5,"pic":"http://ddz.image.tuyoo.com/avatar/head_female_2.png","coin":1200,"max_win_sequence_count":9,"win_sequence_count":1,"max_degree":62,"master_point":0,"master_point_level":1,"master_point_level_diff":[0,5],"week_master_point":0,"charm":0,"seatId":0,"stat":"playing","ting":0,"member":{"flag":0},"vipInfo":{"vipExp":0,"vipLevel":{"level":0}},"match_rank":3,"match_score":100000},{"name":"\u6211\u662f\u5c06\u795e","sex":0,"userId":8,"pic":"http://ddz.image.tuyoo.com/avatar/head_male_1.png","coin":3400,"max_win_sequence_count":7,"win_sequence_count":1,"max_degree":35,"master_point":0,"master_point_level":1,"master_point_level_diff":[0,5],"week_master_point":0,"charm":0,"seatId":1,"stat":"playing","ting":0,"member":{"flag":0},"vipInfo":{"vipExp":0,"vipLevel":{"level":0}},"match_rank":6,"match_score":100000},{"name":"iPhone Simulator","sex":0,"userId":10009,"pic":"http://ddz.image.tuyoo.com/avatar/head_piano.png","coin":1255497,"max_win_sequence_count":10,"win_sequence_count":4,"max_degree":131,"master_point":756,"master_point_level":11,"master_point_level_diff":[56,100],"week_master_point":551,"charm":0,"seatId":2,"stat":"playing","ting":0,"member":{"flag":0},"vipInfo":{"vipExp":0,"vipLevel":{"level":0}},"match_rank":4,"match_score":100000},{"name":"MI 4LTE","sex":1,"userId":10015,"pic":"http://ddz.image.tuyoo.com/avatar/head_female_2.png","coin":375600,"max_win_sequence_count":10,"win_sequence_count":6,"max_degree":134,"master_point":26,"master_point_level":3,"master_point_level_diff":[6,30],"week_master_point":26,"charm":40,"seatId":3,"stat":"playing","ting":0,"member":{"flag":0},"vipInfo":{"vipExp":0,"vipLevel":{"level":0}},"match_rank":1,"match_score":100000}],"table_raffle":0,"interactive_expression_config":{"0":{"chip_limit":1100,"cost":1000,"charm":100,"ta_charm":-100},"1":{"chip_limit":1100,"cost":1000,"charm":200,"ta_charm":200},"2":{"chip_limit":1100,"cost":500,"charm":50,"ta_charm":-50},"3":{"chip_limit":1100,"cost":500,"charm":100,"ta_charm":100}},"gameId":7}};
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        }
                    },
                    {
                        text:"动画播放",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){                    
                            GLOBAL_OBJ.bkernel.utils.Animation.play( hall.SceneManager.getCurrentController().getRootNode(), GLOBAL_OBJ.RES.EFFECTS_ITEM_DISPLAY_00_CCBI, null, 
                            function(_animate){
                                _animate.nameLabel.setString("5000元");
                            }, 
                            function(_animate){

                            }, false );
                        },
                    },
                    {
                        text:"结算胜利",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var cmds = {"cmd":"win","result":{"winner_seat_id":0,"current_seat_id":3,"loser_seat_ids":[3],"win_coin":500,"win_master_point":2,"tile":3,"win_sequence_count":1,"grab_gang":0,"wx_share_base_point":1,"base_master_point":1,"room_coefficient":2,"member_coefficient":1,"master_point_level":4,"win_sequence_effect":0,"hu_infos":{"3":{"win":{"type":1,"tile":3,"win_coin":500,"degree":5,"loser_uids":[1116],"loser_coins":[500]}}},"budgets":{"iPhone Simulator":{"coin":-100,"max_win_sequence_count":8,"win_sequence_count":1,"standup_tiles":[1,2,3,4,5,14,14,22,23,24],"gang_tiles":[],"peng_tiles":[36],"chi_tiles":[],"win_tile":3,"win":[[500,5,[["\u7bad\u523b","2\u756a"],["\u542c\u724c","2\u756a"],["\u8fb9\u5f20","1\u756a"]],["\u5076\u4e00\u5b9a\u8d0f"],[1116],[500],2,[""],[false],false,1]],"lose":[[-600,6,[["\u53cc\u6697\u523b","2\u756a"],["\u5e7a\u4e5d\u523b","1\u756a"],["\u5e7a\u4e5d\u523b","1\u756a"],["\u81ea\u6478","1\u756a"],["\u4e8c\u4e94\u516b\u5c06","1\u756a"]],"PeggyCheng_fb",1199,"",0]],"seat_id":0}},"gameId":7,"other_player_tiles":{"1199":{"coin":1800,"standup_tiles":[5,5,11,11,11,15,16,17,32,32],"gang_tiles":[],"peng_tiles":[],"chi_tiles":[24],"win_tile":32,"win":[[1800,6,[["\u53cc\u6697\u523b","2\u756a"],["\u5e7a\u4e5d\u523b","1\u756a"],["\u5e7a\u4e5d\u523b","1\u756a"],["\u81ea\u6478","1\u756a"],["\u4e8c\u4e94\u516b\u5c06","1\u756a"]],["iPhone Simulator","\u4eba\u6e23","\u5076\u4e00\u5b9a\u8d0f"],[3,1112,1116],[600,600,600],2,["","",""],[false,false,false],false,0]],"seat_id":2}}}}
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"结算输",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var cmds = {"cmd":"third_win","result":{"winner_seat_id":3,"current_seat_id":0,"loser_seat_ids":[0],"win_coin":42000,"win_master_point":6,"tile":17,"win_sequence_count":1,"grab_gang":0,"wx_share_base_point":1,"base_master_point":1,"room_coefficient":6,"member_coefficient":1,"hu_infos":{"1047":{"win":{"type":1,"tile":17,"win_coin":42000,"degree":6,"loser_uids":[3],"loser_coins":[42000]}}},"budgets":{"\u5efa\u9020\u8005":{"coin":7000,"standup_tiles":[16,16,18,19,22,22,22],"gang_tiles":[],"peng_tiles":[7],"chi_tiles":[2],"win_tile":17,"win":[[42000,6,[["\u548c\u7edd\u5f20","4\u756a"],["\u65e0\u5b57","1\u756a"],["\u8fb9\u5f20","1\u756a"]],["iPhone Simulator"],[3],[42000],6,[""],[false],false,1]],"lose":[[-35000,5,[["\u542c\u724c","2\u756a"],["\u5e7a\u4e5d\u523b","1\u756a"],["\u7f3a\u4e00\u95e8","1\u756a"],["\u574e\u5f20","1\u756a"]],"\u8e3d\u8e3d\u72ec\u884c",1128,"",1]],"seat_id":3}},"gameId":7}}
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"幸运转盘信息",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            GLOBAL_OBJ.businesses.network.C2S.requestLuckyWheelDetailInfo();
                        },
                    },
                    {
                        text:"幸运转盘抽奖",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            GLOBAL_OBJ.businesses.network.C2S.requestLuckyWheelRaffle("0",0);
                        },
                    }, 
                    {
                        text:"幸运转盘抽奖成功",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                             var cmds =  {
                                   "cmd":  "user",
                                   "result":  {
                                    "action": "do_lucky_raffle_success",
                                    "gameId":  7,
                                    "userId":  10001,
                                    "do_free_raffle_remain_time": 0,
                                    "item_id":  "3",      
                                    "tab_id":  "0",       
                                    "reward":  ["chip", 200]
                                   }
                                  };
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"幸运转盘抽奖失败",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                             var cmds =  {
                                   "cmd":  "user",
                                   "result": {
                                    "action":  "do_lucky_raffle_fail",
                                    "gameId":  7,
                                    "userId":  10001,
                                    "info":   "抽奖失败原因"
                                   }
                                  };
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"每日特惠Response",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                             var cmds =  {
                               "cmd":  "user",
                               "result":  {
                                    "action": "daily_discout",
                                    "pic": "http://111.203.187.157:8010/majiang/images/raffle/bqs_interface_icon_jinbi.png",      
                                    "rewards":  [["chip",200000],["coupon",200]],
                                    "origin_price":200,
                                    "current_price":160,
                                    "tasks":[
                                        {
                                            "action":"",
                                            "params":"",
                                        }
                                    ]
                                }
                            };
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },

                    {
                        text:"加入自建桌",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            GLOBAL_OBJ.businesses.network.C2S.requestJoinCustomRoom(636863);
                        },
                    },

                    {
                        text:"聊天消息",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            GLOBAL_OBJ.table.models.Chat.test();
                        },
                    },

                    {
                        text:"自建桌结算",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var cmds = {"cmd":"create_table","result":{"action":"display_budget","liuju":0,"budgets":{"10020":{"coin":0,"max_win_sequence_count":2,"win_sequence_count":2,"standup_tiles":[31,31,33,33,36,37,37],"gang_tiles":[],"peng_tiles":[34],"chi_tiles":[22],"seat_id":0},"10014":{"coin":0,"max_win_sequence_count":4,"win_sequence_count":0,"standup_tiles":[31,31,35,35],"gang_tiles":[],"peng_tiles":[32],"chi_tiles":[24,27],"win_tile":35,"seat_id":1}},"roomId":78051001,"allPlayersBudgets":[{"name":"百变人生","deltaScore":0,"score":1000},{"name":"地狱流星","deltaScore":0,"score":1000}],"gameId":7}}
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"房间列表",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            GLOBAL_OBJ.businesses.utils.Scene.jumpToRoomList();
                        },
                    },
                    {
                        text:"更新VIP房间列表",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            // GLOBAL_OBJ.businesses.network.C2S.requestVipRoomListUpdate();
                            // GLOBAL_OBJ.businesses.scenes.RoomList.Vip.Model.test("vipTableList");
                        },
                    },
                    {
                        text:"更新VIP房间列表111",
                        desc:"text为temp的不会显示(粘贴代码模板)",
                        code:function(){
                            var cmds;
                            cmds = {"cmd":"hall","result":{"action":"vipTableListUpdate","gameId":7,"userId":10001,"tables":[{"now_num":0,"tableId":790110010200,"roomId":79011001,
                                "users":[{"uid":10002,"purl":"http://ddz.image.tuyoo.com/avatar/head_china.png"},
                                    null]},{"now_num":0,"tableId":790210010199,"roomId":79021001,"users":[{},{}]},{"now_num":0,"tableId":790310010200,"roomId":79031001,"users":[{},{}]},{"now_num":0,"tableId":790410010200,"roomId":79041001,"users":[{},{},{},{}]},{"now_num":0,"tableId":790510010200,"roomId":79051001,"users":[{},{"uid":10003,"purl":"http://ddz.image.tuyoo.com/avatar/head_china.png"},{},{}]},{"now_num":0,"tableId":790610010199,"roomId":79061001,"users":[{},{},{},{}]}]}}
                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                        },
                    },
                    {
                        text:"新牌桌",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.modules.Table.test();
                        }
                    },
                    {
                        text:"第一次发牌",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.models.Deal.test();
                        }
                    },
                    {
                        text:"摸牌",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.models.Draw.test();
                        }
                    },
                    {
                        text:"打牌",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.models.Discard.test(1);
                        }
                    },
                    {
                        text:"互动表情",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.models.Chat.test(1);
                            // GLOBAL_OBJ.table.models.Budget.doClean();
                            // cc.log("dfjlsdflkjsdklfjklsdjfl:"+GLOBAL_OBJ.table.models.Budget.getActiveLocalSeatId(0))
                        }
                    },
                    {
                        text:"XXXXXXXX",
                        desc:"",
                        code:function(){
                                // hall.SceneManager.getCurrentController().getRootNode(),{});
                            // proxy.update([[5,33,0,0],[6,32,1,1],[5,16,1,1]], cc.p(100,100));
                            var cmds = {
                                "cmd": "display_budget",
                                "result": {
                                    "liuju": 0,
                                    "budgets": {
                                        "10014": {
                                            "coin": 0,
                                            "max_win_sequence_count": 4,
                                            "win_sequence_count": 1,
                                            "standup_tiles": [
                                              22,
                                              27,
                                              28,
                                              29,
                                              31,
                                              33,
                                              34,
                                              34,
                                              35,
                                              36
                                            ],
                                            "gang_tiles": [
                                              
                                            ],
                                            "peng_tiles": [
                                              23
                                            ],
                                            "chi_tiles": [
                                              
                                            ],
                                            "seat_id": 0
                                        },
                                        "10022": {
                                            "coin": 0,
                                            "max_win_sequence_count": 2,
                                            "win_sequence_count": 0,
                                            "standup_tiles": [
                                              21,
                                              21,
                                              22,
                                              23,
                                              24,
                                              24,
                                              25,
                                              26,
                                              28,
                                              28
                                            ],
                                            "gang_tiles": [
                                              
                                            ],
                                            "peng_tiles": [
                                              
                                            ],
                                            "chi_tiles": [
                                              27
                                            ],
                                            "win_tile": 21,
                                            "seat_id": 1
                                          }
                                    },
                                    "create_table_extend_info": {
                                        "create_table_no": 401974,
                                        "create_now_cardcount": 0,
                                        "create_total_cardcount": 8,
                                        'show_zhaniao': 1,
                                        'zhaniao_info': {
                                           'zhaniao_all_tiles': [
                                             27,
                                             27,
                                             2,
                                             2
                                           ],
                                           'select_zhaniao_tiles': [
                                             2
                                           ]
                                        }
                                    },
                                    "roomId": 78051001,
                                    "allPlayersBudgets": [
                                        {
                                            "name": "\u8001\u7239",
                                            "deltaScore": 0,
                                            "score": 1000
                                        },
                                        {
                                            "name": "\u767e\u53d8\u4eba\u751f",
                                            "deltaScore": 0,
                                            "score": 1000
                                        }
                                    ],
                                    "gameId": 7
                                }
                            };

                            ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
                            GLOBAL_OBJ.bkernel.windows.Factory.produce(GLOBAL_OBJ.businesses.windows.consts.C_CREATE_ROOM_ZHANIAO_EFFECT, {zhaniao_info:GLOBAL_OBJ.model.gTable.getResult().getCreateZhaniaoInfo(),
                                callFunc:function(){}}, cc.Director.getInstance().getRunningScene() );
                        }
                    },
                    {
                        text:"牌局回放",
                        desc:"",
                        code:function(){
                            var file = "/Users/likai/Desktop/2016_9_28_14_48_0763.js";
                            cc.sys.cleanScript(file);
                            require(file);
                            for(var i = 0 ; i < STEPS.length; ++i){
                                ty.netMsgDispatcher.processMsg(STEPS[i].cmd, [STEPS[i]]);
                            };
                            // ty.netMsgDispatcher.processMsg(STEPS[1].cmd, [STEPS[1]]);
                        }
                    },
                    {
                        text:"牌桌测试用例",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.Test.TEST_CUSTOM_TEST_001();
                            
                        }
                    },
                    {
                        text:"释放牌资源",
                        desc:"",
                        code:function(){
                            var path = hall.searchPach + GLOBAL_OBJ.GAMENAME + "/img/mahj_multi_table_001_001.plist";
                            path = jsb.fileUtils.fullPathForFilename(path);
                            // cc.log("path:"+path);
                            cc.SpriteFrameCache.getInstance().removeSpriteFramesFromFile( path );

                            cc.SpriteFrameCache.getInstance().removeUnusedSpriteFrames();
                        }
                    },
                    {
                        text:"加载牌资源",
                        desc:"",
                        code:function(){
                            var path = hall.searchPach + GLOBAL_OBJ.GAMENAME + "/img/mahj_multi_table_001_001.plist";
                            path = jsb.fileUtils.fullPathForFilename(path);
                            // cc.log("path:"+path);
                            cc.SpriteFrameCache.getInstance().addSpriteFrames( path );
                        }
                    },
                    {
                        text:"牌桌特效",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.windows.Animations.Score.test();
                        }
                    },
                    {
                        text:"流程测试",
                        desc:"",
                        code:function(){
                            
                            // GLOBAL_OBJ.table.Test.TEST_GAME_000();
                            // tiles = [1,5,5,6,4,6,9]
                            // b = [1,3,5,2,4,6,9,7]
                            // var source = {};
                            // var dst
                            // for(var i  = 0; i < tiles.length; ++i){
                            //     source[ tiles[i] ] = ++source[ tiles[i] ] || 1;
                            // };

                            // for(var i  = 0; i < b.length; ++i){
                            //     var tile = b[i];
                            //     if ( source[tile] && source[tile] > 0 ) {
                            //         --source[tile];
                            //     }else{
                            //         cc.log("sdfjklsjdklfjskldf:"+b[i])
                            //         // errors.push( b[i] );
                            //     };
                            // };
                        }
                    },
                    {
                        text:"解除托管",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.table.models.Trustee.test(0);
                        }
                    },
                    {
                        text:"特效",
                        desc:"",
                        code:function(){
                            GLOBAL_OBJ.bkernel.utils.Animation.play( cc.Director.getInstance().getRunningScene(),
                                GLOBAL_OBJ.RES.MJ_ZM_TX_CHI_CCBI, null,
                                function(_animate){}, 
                                function(_animate){}, false );
                        }
                    },
                     {
                        text:"麻将牌管理",
                        desc:"",
                        code:function(){
                            // var m = GLOBAL_OBJ.table.modules.Mahjong.produce(1);
                            // cc.Director.getInstance().getRunningScene().addChild(m.getRootNode());
                        }
                    },
                     {
                        text:"麻将牌管理1",
                        desc:"",
                        code:function(){
                            // var m = GLOBAL_OBJ.table.modules.Mahjong.produce(1);
                            // m.getRootNode().release();
                            // cc.Director.getInstance().getRunningScene().addChild(m.getRootNode());
                        }
                    },

                ]
            }
            this.createNodes(data);
        },

        show:function(){
            // if(hall.SceneManager.getCurrentController().addDebugView){
            //     hall.SceneManager.getCurrentController().addDebugView(this);
            // } else {
            //     hall.SceneManager.getCurrentController().addChildController(this);
            // }
            var scene = cc.Director.getInstance().getRunningScene();
            var child = scene.getChildByTag(13800138000);
            if (child) {
                child.removeFromParent();
            };
            scene.addChild(this.view.ccbRootNode,13800138000)
        },
        //创建按钮并解析代码
        createNodes:function(data){
            this._items = [];
            GLOBAL_OBJ.LOGD(this._TAG, 'createNodes');

            var sprite1;
            var sprite2;
            var label1;
            var label2;
            var x,y,index,caseItem;
            var menu = cc.Menu.create();
            // menu.setTouchPriority(-999999);

            data.cases.unshift({
                text:"X",
                code:this.onMenuClicked,
            })
            GLOBAL_OBJ.LOGD(this._TAG, data);
     
            for(var i = 0; i < data.cases.length;i++){
                caseItem = data.cases[i];
                if(caseItem.text == "temp")
                    continue;
                x = i%8;
                y = parseInt(i/8);

                sprite1 = new cc.Sprite("games/hall/img/nopack/hall_roulette_mask_extends.png");
                sprite2 = new cc.Sprite("games/hall/img/nopack/hall_roulette_mask_extends.png");
                sprite3 = new cc.Sprite("games/hall/img/nopack/hall_roulette_mask_extends.png");
                label1 = cc.LabelTTF.create(caseItem.text.replace(" ","\n"),"Marker Felt",15);
                label2 = cc.LabelTTF.create(caseItem.text.replace(" ","\n"),"Marker Felt",15);
                var centerPos =cc.p(sprite1.getContentSize().width*1.5,sprite1.getContentSize().height*1.5);
                label1.setPosition(centerPos);
                label2.setPosition(centerPos);
                label2.setScale(1.2);
                sprite1.addChild(label1);
                sprite2.addChild(label2);
                menuItem = new cc.MenuItemSprite(sprite1,sprite2,sprite3,caseItem.code);
                menu.addChild(menuItem);

                menuItem.setPosition(cc.p(x*100-350,(3-y)*100 - 30));

                if(i>0){
                    this._items.push(menuItem);
                }
            }
            GLOBAL_OBJ.LOGD(this._TAG, this._items.length);
            cc.Director.getInstance().getRunningScene().addChild(menu);
            menu.setLocalZOrder(100)
        },

        //开关按钮的回调
        onMenuClicked:function(){
            GLOBAL_OBJ.LOGD(this._TAG, gg._items.length);
            gg._visable = !gg._visable;
            gg.getRootNode().setVisible(gg._visable); //控制自己是否可见
            for(var i = 0 ; i < gg._items.length;i++){
                gg._items[i].setVisible(gg._visable);
            }
        },
    });
    
    GLOBAL_OBJ.bkernel.utils.TestTool.create = function(_parent){
        if (ty.SystemInfo.getConfig().debug) {
            // 依次加载每个模块
            var winSize  = cc.Director.getInstance().getWinSize();
            cc.MenuItemFont.setFontSize(65);
            var decrease = new cc.MenuItemFont("TEST", function(){
                var testTool = new GLOBAL_OBJ.bkernel.utils.TestTool()
                testTool.show()
            }, this);
            decrease.color = cc.color(0, 200, 200);
            var menu = new cc.Menu(decrease);
            menu.alignItemsHorizontally();
            menu.x = winSize.width*0.3;
            menu.y = winSize.height*0.95;
            var parent = _parent||cc.Director.getInstance().getRunningScene();
            parent.addChild(menu, 99999999);
        };
    };
    GLOBAL_OBJ.bkernel.utils.TestTool.create();
})();
