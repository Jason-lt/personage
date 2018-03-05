/*************************************************************
 *  mahjong_table_audio.js
    mahjong_table_audio
 *  mahjong
 	
 *
 *  Created by nick.kai.lee on 16-09-18
 *  特殊说明：
    牌桌音效分性别
    使用方法:
 */
(function (){
    var GLOBAL_OBJ = guiyang;
    var GLOBAL_T = GLOBAL_OBJ.table.global;
    var MODEL_USER = GLOBAL_OBJ.businesses.modules.User.Model;
    GLOBAL_OBJ.table.utils.Audio = {
        _TAG:"table.utils.Audio",

        methodMap : {
            "chow" : "chi",
            "exposed_kong" : "gang_ming",
            "concealed_kong" : "gang_an",
            "win" : "hu",
            "grab_chow_ting" : "chi",
            "grab_pong_ting" : "peng",
            "gangkai" : "mgangshanghua",
            "ready_hand" : "ting",
            "pong" : "peng"
        },

        /*
        吃碰杠听胡的音效选择
        params: _methods */
        audioMethods:function(sex_,_methods ){
            var playMode = GLOBAL_OBJ.table.models.TableInfo.getPlayMode();
            var sex_Str = sex_ == 0 ? "man" : "woman";

            var playModeMap = GLOBAL_OBJ.RES.SOUND[playMode];

            if (!playModeMap){
                return '';
            }

            //有的操作与文件名相同，有的不同，不同的要进行转换
            var fileKey;
            var fileKeyVal = this.methodMap[_methods];
            if (!fileKeyVal){
                fileKey = _methods;
            }
            else{
                fileKey = fileKeyVal;
            }

            var sexAudioMap = playModeMap[sex_Str];
            var audioFileList = sexAudioMap[fileKey];

            if (!audioFileList)
            {
                cc.log(_methods+" sound not find");
                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                    text: _methods+" sound not find",
                    duration: 10
                });
            }

            var aidx = Math.floor(Math.random() * audioFileList.length); //随机取一个
            var chatAudioFileName = audioFileList[aidx];

            var chatAudioFileKey = chatAudioFileName.replace(".","_").toUpperCase();

            return GLOBAL_OBJ.RES[ playMode.toUpperCase() + "_" + sex_Str.toUpperCase() + "_" + chatAudioFileKey ];
        },

        /*
        花色音效选择*/
        audioTile:function(sex_,_tile){

            var playMode = GLOBAL_OBJ.table.models.TableInfo.getPlayMode();
            var tileId = _tile >= 31  ? _tile : _tile % 10;
            var tiles = ["wan","tong","tiao",""];
            var tileStr = tiles[Math.floor(_tile / 10)];
            var sex_Str = sex_ == 0 ? "man" : "woman";

            var playModeMap = GLOBAL_OBJ.RES.SOUND[playMode];

            if (!playModeMap){
                return;
            }

            var sexAudioMap = playModeMap[sex_Str];
            var audioFileList = sexAudioMap[tileId + tileStr];

            var aidx = Math.floor(Math.random() * audioFileList.length); //随机取一个
            var chatAudioFileName = audioFileList[aidx];

            var chatAudioFileKey = chatAudioFileName.replace(".","_").toUpperCase();

            return GLOBAL_OBJ.RES[ playMode.toUpperCase() + "_" + sex_Str.toUpperCase() + "_" + chatAudioFileKey ];
        },

        /*聊天音效选择*/
        audioChat:function(sex_,_index){

            if (_index < 0) { return; }

            var playMode = GLOBAL_OBJ.table.models.TableInfo.getPlayMode();
            var sex_Str = sex_ == 0 ? "man" : "woman";

            var playModeMap = GLOBAL_OBJ.RES.SOUND[playMode];

            if (!playModeMap){
                return '';
            }

            var sexAudioMap = playModeMap[sex_Str];
            var audioFileList = sexAudioMap["chat" + _index];
            var chatAudioFileName = audioFileList[0];
            var chatAudioFileKey = chatAudioFileName.replace(".","_").toUpperCase();

            return GLOBAL_OBJ.RES[ playMode.toUpperCase() + "_" + sex_Str.toUpperCase() + "_" + chatAudioFileKey ];
        },

        uncacheEffects:function () {//从hubei.RES中过滤出牌桌音效
            // var Effects     = [];
            // var playMode    = GLOBAL_OBJ.table.models.TableInfo.getPlayMode();
            // cc.log( "playMode=" + playMode );
            // var pMode       = playMode.toUpperCase();//变成大写
            // for(i in GLOBAL_OBJ.RES){
            //     var playmode    = i.substr(0,i.indexOf("_"));//返回截止到第一个_前的字母
            //     var styles      = i.substr(-3);//返回最后三个字符（MP3或者WAV）
            //     if( pMode == playmode && ( styles == "WAV" || styles == "MP3" ) ){
            //         Effects.push(i);
            //     }
            // }

            // cc.log("uncacheEffects_Effects=" + JSON.stringify(Effects));
            // for(var j = 0; j < Effects.length; j++){
            //     var filePath = GLOBAL_OBJ.RES[Effects[j]];
            //     cc.log("filePath=====" + filePath);
            //     hall.AudioHelper.uncache(filePath);//通过uncache方法释放缓存
            // }
        },

        shut:function () {
            cc.log("这里通过playMode来释放播放后加载到内存里的音乐资源");
            hall.AudioHelper.resetSoundPlayer();
            //按音效配置，重新设置音量，因为resetSoundPlayer()会把音效音量改到1
            hall.AudioHelper.setEffectsVolume(GLOBAL_OBJ.UserDefault.shareUserDefault().getEffectStatus());
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
        }
    };
})();