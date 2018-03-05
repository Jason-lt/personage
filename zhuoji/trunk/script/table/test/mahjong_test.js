/*****************************************
 *  mahjong_test.js
    测试用例
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-22
 *  特殊说明：

    使用说明:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    
    GLOBAL_OBJ.table.Test = {
        _TAG:"table.Test",

        boot:function(){
            ty.extend.schedulerExtend(this);
        },

        shut:function(){

        },

        /*          
                    入等待区测试用例           */
        TEST_LOCATION_000:function(){
            /*
            普通桌本家入等待区，然后其他玩家进场，最后玩家离开 */

            //本家等待区
            GLOBAL_OBJ.table.models.Location.test(0);

            this.async(function(){
                GLOBAL_OBJ.table.models.TableEvent.test(0);//#0本家入场
            },1);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.TableEvent.test(1);//#1入场
            },2);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.TableEvent.test(2);//#2入场
            },3);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.Leave.test(0);//#1离开
            },4);
        },

        TEST_LOCATION_001:function(){
            /*
            贵宾厅本家入等待区(已经有3人在等待)
            PS：贵宾厅的等待区和普通桌不一样，是一个layer不是场景，因为table_info一起来了
            */
            //本家等待区
            GLOBAL_OBJ.table.models.Location.test(1);
            GLOBAL_OBJ.table.models.TableInfo.test(0);
            GLOBAL_OBJ.table.models.CountDown.test(0);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.Ready.test(0);//#1准备
            },1);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.Ready.test(1);//#2准备
            },2);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.Ready.test(2);//#3准备
            },3);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.TableEvent.test(3);//#0本家入场
            },4);
            
            this.async(function(){
                GLOBAL_OBJ.table.models.Leave.test(1);//#0本家离开
            },5);
        },

        /*          
                    入桌测试用例           */
        TEST_TABLEINFO_000:function(){
            /*
            普通入桌 国标 4 人*/
            GLOBAL_OBJ.table.models.Location.test(2);
            GLOBAL_OBJ.table.models.TableEvent.test(4);//#0本家入场
            GLOBAL_OBJ.table.models.TableEvent.test(5);//#1入场
            GLOBAL_OBJ.table.models.TableEvent.test(6);//#2入场
            this.async(function(){
                GLOBAL_OBJ.table.models.TableInfo.test(1);
            },1);
        },

        TEST_TABLEINFO_001:function(){
            /*
            断线重连 普通入桌 国标 4 人*/
            GLOBAL_OBJ.table.models.TableInfo.test(2);
        },

        TEST_TABLEINFO_002:function(){
            /*
            断线重连 普通入桌 国标 4 人 （对家已经胡牌）*/
            GLOBAL_OBJ.table.models.TableInfo.test(3);
        },

        TEST_TABLEINFO_003:function(){
            /*
            断线重连 普通入桌 四川 4 人 （带定缺信息）*/
            GLOBAL_OBJ.table.models.TableInfo.test(4);
        },

        TEST_TABLEINFO_004:function(){
            /*
            断线重连 普通入桌 血流成河 4 人 （带本家胡牌信息）*/
            GLOBAL_OBJ.table.models.TableInfo.test(5);
        },

        TEST_TABLEINFO_005:function(){
             /*
            断线重连 普通入桌 国标 4 人 （带其他家胡牌信息）*/
            GLOBAL_OBJ.table.models.TableInfo.test(6);
        },

        TEST_TABLEINFO_006:function(){
            /*
            断线重连 普通入桌 哈尔滨 4 人 （带本家听牌+宝牌信息）*/
            GLOBAL_OBJ.table.models.TableInfo.test(7);
        },

        /*          
                    发牌测试用例             */
        TEST_DEAL_000:function(){
            /*
            普通入桌 二人 */
            GLOBAL_OBJ.table.models.TableInfo.test(8);
            GLOBAL_OBJ.table.models.Deal.test(0);
        },

        /*          
                    补花测试用例             */
        TEST_FLOWER_000:function(){
            /*
            普通入桌 4人 */
            GLOBAL_OBJ.table.models.TableInfo.test(0);
            GLOBAL_OBJ.table.models.Deal.test(6);
        },

        TEST_FLOWER_001:function(){
            /*
            普通入桌 4人 */
            GLOBAL_OBJ.table.models.TableInfo.test(0);
            GLOBAL_OBJ.table.models.Deal.test(6);
            this.async(function(){
                GLOBAL_OBJ.table.models.Draw.test(10);
            },4); //支持0s不丢数据
        },

        /*          
            摸牌测试用例             */
        TEST_DRAW_000:function(){
            /*
            普通入桌 国标 4人 玩家摸牌
            纯属检测摸牌流程，4个玩家都同时摸牌（实际中不可能出现这个状况）
            */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(0);
            GLOBAL_OBJ.table.models.Draw.test(0);//5万
            // GLOBAL_OBJ.table.models.Draw.test(1);
            // GLOBAL_OBJ.table.models.Draw.test(2);
            // GLOBAL_OBJ.table.models.Draw.test(3);
        },

        /*          
            打牌测试用例             */
        TEST_DISCARD_000:function(){
            /*
            普通入桌 国标 4人 玩家打牌 
            纯属检测打牌流程，4个玩家都同时打牌（实际中不可能出现这个状况）
            */
            this.TEST_DRAW_000();

            this.async(function(){
                GLOBAL_OBJ.table.models.Discard.test(0);
                GLOBAL_OBJ.table.models.Discard.test(1);
                GLOBAL_OBJ.table.models.Discard.test(2);
                GLOBAL_OBJ.table.models.Discard.test(3);
            },4); //支持0s不丢数据
        },

        /*          
            吃碰杠面板 暗杠            */
        TEST_CPG_000:function(){
            /*
            普通入桌 国标 4人 本人摸牌一万， 暗杠 一万 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(4);
        },

        /*          
            吃碰杠面板 暗杠            */
        TEST_CPG_001:function(){
            /*
            普通入桌 国标 4人 本人起手4个一万 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(2);
            GLOBAL_OBJ.table.models.Draw.test(5);
        },

        /*          
            吃碰杠面板 明杠            */
        TEST_CPG_002:function(){
            /*
            普通入桌 国标 4人 本人碰牌一万，打牌一条，摸牌一万， 明杠 一万 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(3);
            this.async(function(){
                GLOBAL_OBJ.table.models.Draw.test(3);
                GLOBAL_OBJ.table.models.Discard.test(3);
                GLOBAL_OBJ.table.models.Pong.test(0);
                GLOBAL_OBJ.table.models.Discard.test(4);
                GLOBAL_OBJ.table.models.Draw.test(4);
            },3);
        },

        /*          
            吃碰杠面板 明杠            */
        TEST_CPG_003:function(){
            /*
            普通入桌 国标 4人 本人手牌3张一万，其他玩家打牌一万，明杠 一万 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(3);
            GLOBAL_OBJ.table.models.Discard.test(5);
        },

        /*          
            吃碰杠面板 托管时快速关闭 */
        TEST_CPG_004:function(){
            /*
            普通入桌 国标 4人 本人手牌3张一万 其他玩家打牌一万
            摸牌时不可能有吃或者碰，但是有可能本家托管了，其他玩家打出一张牌，本家可以吃或者碰，但是托管时服务器代替本家立即做出选择
            不吃或碰（不通知客户端），且立即代替本家摸一张新牌，这个时候只要本家摸牌了，
            就代表不能出现吃碰杠面板了（其他玩家打牌时带来的信息），除非本协议还带了吃碰杠数据 */
            this.TEST_CPG_003();
            GLOBAL_OBJ.table.models.Draw.test(6);
        },

        /*          
            吃碰杠面板 明杠+暗杠 */
        TEST_CPG_005:function(){
            /*
            普通入桌 国标 4人 本人手牌3张一万 4张6条， 其他玩家打牌1万，本家明杠1万，暗杠6条*/
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(4);
            GLOBAL_OBJ.table.models.Draw.test(3);
            GLOBAL_OBJ.table.models.Discard.test(6);
        },

        /*          
            吃碰杠面板 听 */
        TEST_CPG_006:function(){
            /*
            普通入桌 国标 4人 本人手牌3张一万 4张6条， 其他玩家打牌1万，本家明杠1万，暗杠6条*/
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(4);
            GLOBAL_OBJ.table.models.Draw.test(9);
            // GLOBAL_OBJ.table.models.Discard.test(6);
        },

        /*          
            听牌操作             */
        TEST_READYHAND_000:function(){
            /*
            普通入桌 国标 4人 本家托管，出牌1万，进入听牌状态*/
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(4);
            GLOBAL_OBJ.table.models.Discard.test(7);        
        },


        /*          
            抢听牌操作             */
        TEST_GRABREADYHAND_000:function(){
            /*
            普通入桌 哈尔滨 4人 抢听携带吃牌协议*/
            GLOBAL_OBJ.table.models.TableInfo.test(10);
            GLOBAL_OBJ.table.models.Deal.test(5);
            GLOBAL_OBJ.table.models.Draw.test(2);
            GLOBAL_OBJ.table.models.Discard.test(8);   
            this.async(function(){
            },2);
        },

        /*
                    碰牌测试用例             */
        TEST_PONG_000:function(){
            /*
            普通入桌 国标 4人 其他玩家摸牌一张，打出6条，本家碰 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(1);
            GLOBAL_OBJ.table.models.Discard.test(9);
            GLOBAL_OBJ.table.models.Pong.test(1);
        },

        TEST_PONG_001:function(){
            /*
            普通入桌 国标 4人 #1玩家摸牌一张，打出6条，#2碰 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(1);
            GLOBAL_OBJ.table.models.Discard.test(9);
            GLOBAL_OBJ.table.models.Pong.test(2);
        },

        TEST_PONG_002:function(){
            /*
            普通入桌 国标 4人 其他玩家摸牌一张，打出6条，本家碰，本家出8条（步骤缺失），#2玩家碰8条（去本家手牌中搜8条）
            异常处理，连续两次碰牌，中间少一次打牌 */
            this.TEST_PONG_000();
            GLOBAL_OBJ.table.models.Pong.test(3);
        },

        TEST_PONG_003:function(){
            /*
            普通入桌 国标 4人 本家打出6条，#2碰，#2出8条（步骤缺失），#3玩家碰8条（去本家手牌中搜8条）
            异常处理，连续两次碰牌，中间少一次打牌 */
            this.TEST_PONG_001();
            GLOBAL_OBJ.table.models.Pong.test(4);
        },

        /*          
                    吃牌测试用例             */
        TEST_CHOW_000:function(){
            /*
            普通入桌 国标 4人 #1玩家摸牌一张，打出6条，本家吃 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(1);
            GLOBAL_OBJ.table.models.Discard.test(9);
            GLOBAL_OBJ.table.models.Chow.test(0);
        },

        TEST_CHOW_001:function(){
             /*
            普通入桌 国标 4人 #1玩家摸牌一张，打出6条，#2吃 */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(1);
            GLOBAL_OBJ.table.models.Discard.test(9);
            GLOBAL_OBJ.table.models.Chow.test(1);
        },

        TEST_CHOW_002:function(){
             /*
            普通入桌 国标 4人 #1玩家摸牌一张，打出6条，本家吃 ，本家出1条（步骤缺失），#1玩家吃1条（去本家手牌中搜1条）
            异常处理，连续两次吃牌，中间少一次打牌 */
            this.TEST_CHOW_000();
            GLOBAL_OBJ.table.models.Chow.test(2);
        },

        TEST_CHOW_003:function(){
            this.TEST_CHOW_001();
            GLOBAL_OBJ.table.models.Chow.test(3);
        },

        /*          
                    杠牌测试用例             */
        TEST_KONG_000:function(){
            /*
            普通入桌 血战 4人 本家杠#3玩家的牌1万，明杠 （刮风）*/
            GLOBAL_OBJ.table.models.TableInfo.test(9);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(3);
            GLOBAL_OBJ.table.models.Discard.test(3);
            this.async(function(){
                GLOBAL_OBJ.table.models.Kong.test(0);
            }, 1)
        },

        TEST_KONG_001:function(){
            /*
            普通入桌 血战 4人 本人碰牌一万，打牌一条，摸牌一万， 明杠 一万 */
            GLOBAL_OBJ.table.models.TableInfo.test(9);
            GLOBAL_OBJ.table.models.Deal.test(3);
            this.async(function(){
                GLOBAL_OBJ.table.models.Draw.test(3);
                GLOBAL_OBJ.table.models.Discard.test(3);
                GLOBAL_OBJ.table.models.Pong.test(0);
                GLOBAL_OBJ.table.models.Discard.test(4);
                GLOBAL_OBJ.table.models.Draw.test(4);
                GLOBAL_OBJ.table.models.Kong.test(1);
            },3);
        },

        TEST_KONG_002:function(){
            /*
            普通入桌 血战 4人 本家手牌3张1万，摸牌1万，暗杠 （下雨）*/
            GLOBAL_OBJ.table.models.TableInfo.test(9);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(7);
            GLOBAL_OBJ.table.models.Kong.test(2);
            GLOBAL_OBJ.table.models.Draw.test(8);
        },

        TEST_KONG_003:function(){
            /*
            普通入桌 血战 4人 本家手牌4张1万，摸牌1张，暗杠 （下雨）*/
            GLOBAL_OBJ.table.models.TableInfo.test(9);
            GLOBAL_OBJ.table.models.Deal.test(2);
            GLOBAL_OBJ.table.models.Draw.test(6);
            GLOBAL_OBJ.table.models.Kong.test(2);
        },

        TEST_KONG_004:function(){
            /*
            普通入桌 血战 4人 #2杠#3玩家的牌1万，明杠, 摸牌一桶 （刮风）*/
            GLOBAL_OBJ.table.models.TableInfo.test(9);
            GLOBAL_OBJ.table.models.Deal.test(1);
            GLOBAL_OBJ.table.models.Draw.test(3);
            GLOBAL_OBJ.table.models.Discard.test(3);
            GLOBAL_OBJ.table.models.Kong.test(3);
            GLOBAL_OBJ.table.models.Draw.test(2);
        },

        TEST_KONG_005:function(){
            /*
            普通入桌 血战 4人 #2碰牌#3一万，#2打牌5同，#2摸牌一张（其实是1万）， 明杠 一万 （刮风）*/
            GLOBAL_OBJ.table.models.TableInfo.test(9);
            GLOBAL_OBJ.table.models.Deal.test(3);
            this.async(function(){
                GLOBAL_OBJ.table.models.Draw.test(3);
                GLOBAL_OBJ.table.models.Discard.test(3);
                GLOBAL_OBJ.table.models.Pong.test(5);
                GLOBAL_OBJ.table.models.Discard.test(2);
                GLOBAL_OBJ.table.models.Draw.test(2);//#2摸牌一万
                GLOBAL_OBJ.table.models.Kong.test(4);
            },3);
        },

        TEST_KONG_006:function(){
                        /*
            普通入桌 血战 4人 #2摸牌一张（其实是1万），手牌有3张1万， 暗杠 一万 （下雨）*/
            GLOBAL_OBJ.table.models.TableInfo.test(9);
            GLOBAL_OBJ.table.models.Deal.test(3);
            this.async(function(){
                GLOBAL_OBJ.table.models.Draw.test(2);
                GLOBAL_OBJ.table.models.Kong.test(5);
            },3);
        },

        TEST_KONG_007:function(){
            /*
            普通入桌 血战 4人 #2手牌4张1万，摸牌1张，暗杠 （下雨）*/
            this.TEST_KONG_006();
        },

        TEST_KONG_008:function(){
             /*
            连续两次杠牌，本家杠其他玩家的牌，本家不出牌(漏)，其他玩家杠本家 */
            this.TEST_KONG_002();
            GLOBAL_OBJ.table.models.Kong.test(6);
        },

        TEST_KONG_009:function(){
            /*
            连续两次杠牌，其他玩家杠本家, #2玩家不出牌(漏), 本家杠#2玩家的牌, 本家摸2万 */
            this.TEST_KONG_004();
            this.async(function(){
                GLOBAL_OBJ.table.models.Kong.test(7);
                GLOBAL_OBJ.table.models.Draw.test(8);
            },2);
            
        },

        /*          
                    托管测试用例             */
        TEST_TRUSTEE_000:function(){
            /*
            普通入桌 国标 4人 本家托管
            */
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(0);
            GLOBAL_OBJ.table.models.Trustee.test(0);
            //本家解除托管
            this.async(function(){
                GLOBAL_OBJ.table.models.Trustee.test(1);
            },2);
        },

        /*          
                    结算测试用例             */
        TEST_POYANG_BUDGET_000:function(){
            GLOBAL_OBJ.table.models.TableInfo.test(1);
            GLOBAL_OBJ.table.models.Deal.test(0);
            GLOBAL_OBJ.table.models.Budget.test(0);
        },

        TEST_CUSTOM_TEST_001:function(){},

        /*          
                流程测试用例             */
        TEST_GAME_000:(function(){
            //二人场国标
            var records = [];
            var index = 0;
            return function(){
                if (records[index]) {
                    // for(var i in records){
                    //   ty.netMsgDispatcher.processMsg(records[i].cmd, [records[i]]);      
                    // };
                    ty.netMsgDispatcher.processMsg(records[index].cmd, [records[index]]);    
                    ++index;
                };
            };
        })(),
    };

    GLOBAL_OBJ.table.Test.boot();
})();