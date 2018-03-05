/*****************************************
 *  mahjong_room_list_model.js
    房间列表model
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-07
 *  
    协议说明：

    使用说明:

 */
(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.businesses.scenes.RoomList.Model = (function(){
        /*
         私有数据+接口
         TODO:
         数据的原型，存储以及通知的抛出
         */

        /* @数据缓存*/
        var CACHE = {
        };

        var SELECT_INDEX = {};

        /* @数据通知*/
        var ___f_notificate = function(_object, _data, _slient){
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(_data) == true){
                return _slient;
            }

            var rooms = _data.rooms || [];

            //目前只取前4个，服务端数据已经排序好
            for(var i in rooms){
                CACHE[ rooms[i][5].play_mode ] = CACHE[ rooms[i][5].play_mode ] || [];

                var room        = CACHE[ rooms[i][5].play_mode ];
                var curRoom     = rooms[i] || {};
                room[i]         = room[i] || {};

                room[i].id      = curRoom[0];
                room[i].onlines = curRoom[1] || 0;
                room[i].title   = curRoom[2] || "";
                room[i].info    = curRoom[3] || "";
                room[i].minCoin = curRoom[5].min_coin || 0;
                room[i].maxCoin = curRoom[5].max_coin || 0;
                room[i].ante    = curRoom[5].base_chip || 0;
                room[i].fee     = curRoom[5].service_fee || 0;

                room[i].maima   = curRoom[5].maima || 0; //买马类型 0：不买马；1：四人买马；2：自摸
                room[i].macount = curRoom[5].macount || 0; //买马的数量
                room[i].laizi   = curRoom[5].laizi || 0;  //0：没有癞子，1：有癞子

            }

            CACHE.matchs = _data.match || [];
            CACHE.matchs =[
                {"roomId":74011000,"name":"比赛场测试1","play_mode":"kawuxing","min_coin":400,  "max_coin":12000,"base_chip":20,  "service_fee":10},
                {"roomId":74011001,"name":"比赛场测试2","play_mode":"kawuxing","min_coin":400,  "max_coin":12000,"base_chip":20,  "service_fee":10},
                {"roomId":74011002,"name":"比赛场测试3","play_mode":"kawuxing","min_coin":400,  "max_coin":12000,"base_chip":20,  "service_fee":10},
            ];

            if (!_slient){
                GLOBAL_OBJ.bkernel.utils.Notification.trigger( GLOBAL_OBJ.businesses.Events.UPDATE_ROOM_LIST, {});
            }
            return _slient
        };

        return {
            _TAG:"businesses.scenes.RoomList.Model",

            /*
             公有数据+接口
             TODO:
             外部调用
             */
            /* 协议解析*/
            parse:function(_data, _slient){
                var data = _data;
                if (!data){
                    return;
                }
                return ___f_notificate(this, data, _slient);
            },

            /*
             激活model，发送一次数据
             返回值：false数据为空 */
            activate:function(){
                return false;
            },

            /*  获取房间id*/
            getRoomId:function( _playmode, _index ){
                var rooms  = CACHE[ _playmode ] || [];
                var room   = rooms[_index] || {};
                return room.id || 0;
            },

            /*  获取房间*/
            getRoom:function( _playmode, _index ){
                var rooms  = CACHE[ _playmode ] || [];
                var room   = rooms[_index] || {};
                return room;
            },

            /**
             * 获取比赛场房间列表
             * @param _index 列表的索引
             * @returns {*}
             */
            getMatchRoom:function(_index ){
                return CACHE.matchs[_index];
            },

            /**
             * 获取所有房间
             * @param _playmode
             * @returns {*|Array}
             */
            getRooms:function( _playmode ){
                var rooms  = CACHE[ _playmode ] || [];
                return rooms;
            },

            /**
             * 获取房间个数
             * @param _playmode
             * @returns {*}
             */
            getRoomCount:function (_playmode) {
                return this.getRooms(_playmode).length;
            },


            /**
             * 获取比赛个数
             * @param _playmode
             * @returns {*}
             */
            getMatchCount:function () {
                return CACHE.matchs.length;
            },

            /*  获取在线人数*/
            getOnlines:function( _playmode, _index ){
                var rooms  = CACHE[ _playmode ] || [];
                var room   = rooms[_index] || {};
                return room.onlines || "0";
            },

            /*  获取准入金币数*/
            getMinBrings:function( _playmode, _index ){
                var rooms  = CACHE[ _playmode ] || [];
                var room   = rooms[_index] || {};
                return room.minCoin || "";
            },

            /*  获取底柱*/
            getAnte:function( _playmode, _index ){
                var rooms  = CACHE[ _playmode ] || [];
                var room   = rooms[_index] || {};
                return room.ante || "";
            },

            setSelectRoomIndex:function (_playmode, idx) {
                SELECT_INDEX[ _playmode ] = idx;
            },

            getSelectRoomIndex:function (_playmode) {
                return SELECT_INDEX[ _playmode ];
            },


            /*
             测试用例
             TODO:
             model测试用例
             */
            test:function(){
                var cmds = {"cmd":"room_list",
                    "result":{"play_mode":"kawuxing","gameId":715,"baseUrl":"http://www.tuyoo.com/","rooms":[
                        [74011000,0,"","","",{"play_mode":"kawuxing","min_coin":400,  "max_coin":12000,"base_chip":20,  "service_fee":10}],
                        [74021000,0,"","","",{"play_mode":"kawuxing","min_coin":2000, "max_coin":45000,"base_chip":150, "service_fee":60}],
                        [74031000,0,"","","",{"play_mode":"kawuxing","min_coin":10000,"max_coin":-1,   "base_chip":600, "service_fee":450}],
                        [74041000,0,"","","",{"play_mode":"kawuxing","min_coin":30000,"max_coin":-1,   "base_chip":3000,"service_fee":2400}],
                        [78031000,0,"","","",{"play_mode":"kawuxing","min_coin":0,    "max_coin":-1,   "base_chip":1,   "service_fee":0}]
                    ]}
                };
                ty.netMsgDispatcher.processMsg(cmds.cmd, [cmds]);
            }
        }
    })();
})();
