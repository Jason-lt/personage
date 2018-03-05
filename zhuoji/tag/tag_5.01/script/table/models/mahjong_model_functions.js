/*************************************************************
 *  mahjong_funtions.js
        mahjong_funtions
 *  mahjong
    麻将model层使用全局函数
 *
 *  Created by nick.kai.lee on 16-06-13
 *  特殊说明：
    
        使用方法:

 */
(function(){
    var GLOBAL_OBJ = guiyang;
    
    GLOBAL_OBJ.table.models.Functions = {

        /*
        @麻将牌碰牌协议翻译
        将协议中碰牌数据翻译成客户端使用数据
        params _tile:牌面
                        比如 有人打 3
                        当前手上有 3，A，B 的话，下发的 pattern,A,B为可以用来碰的花牌
                        params _patternArry:吃牌位置数组 [3,A,3][3,B,3]
                params _mode:返回值模式 1：返回_tile，2：返回非_tile的剩下两枚，3：完整返回
        返回值中缺省只包含玩家准备要用来碰的牌，不包含碰牌本身，碰牌本身从弃牌中获取
        */
        pongTranslation:function( _tile, _patternArry, _mode ){
            var pong = [];
            var patternArry=_patternArry||[];
            var mode  = _mode || 2;
            var tile = _tile||0;

            if (patternArry.length>0 && ( tile>0 || (_mode==3)&&(tile==0)))
            {
                for(var i in patternArry){
                    var _pattern = patternArry[i];
                    switch(mode){
                        case 1:
                            pong.push([ tile ] );
                        break;
                        case 2:
                            var _tilesInHad=[];
                            for(var j in _pattern){
                                    var _tileInHand=_pattern[j];
                                    _tilesInHad.push(_tileInHand);
                            }
                            _tilesInHad.splice(_tilesInHad.indexOf(tile),1);
                            pong.push(_tilesInHad);
                        break;
                        case 3:
                            pong.push(_pattern);
                        break;
                    };
                }
            };
            return pong;
        },

        /*
        @麻将牌吃牌协议翻译
        将协议中吃牌数据翻译成客户端使用数据
        params _tile:牌面  
                        比如 有人打 3
                        当前手上有 1，2，4 的话，下发的 pattern
                params _patternArry:吃牌位置数组 [1,2,3][2,3,4]
                params _mode:返回值模式 1：返回_tile，2：返回非_tile的剩下两枚，3：完整返回
        返回值（二维数组）中缺省只包含玩家准备要用来吃的牌，不包含吃牌本身，吃牌本身从弃牌中获取
        */
        chowTranslation:function( _tile, _patternArry, _mode ){
            var chow = [];
            var patternArry=_patternArry||[];
            var mode = _mode || 2;
            var tile = _tile||0;
            if (patternArry.length>0 && ( tile > 0 || (_mode==3)&&(tile==0)) )
            {
                //完整返回的时候，不需要打的那张牌
                for(var i in patternArry){
                    var _pattern = patternArry[i];
                    switch(mode){
                        case 1:
                            chow.push([ tile ] );
                        break;
                        case 2:
                            var _tilesInHad=[];
                            for(var j in _pattern){
                                var _tileInHand=_pattern[j];
                                if(_tileInHand!=tile){
                                    _tilesInHad.push(_tileInHand);
                                }
                            }
                            chow.push(_tilesInHad);
                        break;
                        case 3:
                            //把别人打的牌，也放进去，放到最后，用来进行比较
                            _pattern.push(_tile);
                            chow.push(_pattern);
                        break;
                    }
                }
            }
            return chow;
        },

        kongTranslation:function( _kongArr, _style, _mode , _drop){
            GLOBAL_OBJ.LOGD("mahjong_funtions.js","kongTranslation start;");
            var kongArr = _kongArr || [];
            var kongs = [];
            var mode  = _mode || 4;
            for(var i in kongArr){
                var _currentKong=kongArr[i];
                if(_style==GLOBAL_OBJ.table.global.METHODS.EXPOSED_KONG){
                    if(_currentKong.tile!=null&&_currentKong.pattern.indexOf(_currentKong.tile)<0){
                        // hall.assert.true(false,"明杠时，获得的牌不在杠牌牌型中"+"\n"
                        //     +" tile : "+_currentKong.tile+"\n"
                        //     +" pattern : "+JSON.stringify(_currentKong.pattern)+"\n"
                        //     +" tile!=null : "+(_currentKong.tile!=null)+"\n"
                        //     +" pattern.indexOf(_currentKong.tile)<0 : "+(_currentKong.pattern.indexOf(_currentKong.tile)<0)
                        // );
                    }
                }
                switch(mode){
                    case 1:
                        hall.assert.true(false,"杠牌时，不会调用返回1张的方法");
                        //返回一张，就是
                        kongs.push( { style: _style, pattern: [ _currentKong.tile ] } );
                    break;
                    case 3:
                        if(_style==GLOBAL_OBJ.table.global.METHODS.CONCEALED_KONG){
                            //暗杠，用的是自己的手牌，没有用到当前抓的那张牌，就报错
                            hall.assert.true(false,"杠牌时，不会进入这里 mode 不可能为 3");
                        }
                        if(null==_drop){
                            hall.assert.true(false,"杠牌时，取三张牌的时候，必须传入一张别人打得牌");
                        }

                        //复制出一个牌型数组，然后删掉，获得的那张牌
                        var _tempPattern=[];
                        var j;
                        for (j = 0; j <_currentKong.pattern.length; j++) {
                            _tempPattern.push(_currentKong.pattern[j]);
                        }
                        //去掉非手牌的入牌，就是手中有的三张牌 
                        _tempPattern.splice(_tempPattern.indexOf(_drop),1);
                        //返回三张
                        kongs.push( {  style: _style, pattern: [ _tempPattern[0], _tempPattern[1], _tempPattern[2] ] } );
                    break;
                    case 4:
                        //返回四张
                        //最后一个相当于，原样返回
                        kongs.push( { style: _style, pattern: [ _currentKong.pattern[0], _currentKong.pattern[1], _currentKong.pattern[2], _currentKong.pattern[3] ] } );
                    break;
                }
            }

            GLOBAL_OBJ.LOGD("mahjong_funtions.js","kongTranslation end;");
            return kongs;
        },

        askTingTranslation:function (_allWinTiles) {
            GLOBAL_OBJ.LOGD("mahjong_funtions.js", "check_ting_array length = "+_allWinTiles.length);

            /*_allWinTiles = [[ 1, [[2, 64, 1], [3, 16, 2]], false ], [ 11, [[12, 64, 1], [13, 16, 2]], false ],
                [ 21, [[22, 64, 1], [23, 16, 2]], false ], [ 4, [[5, 64, 1], [6, 16, 2]], false ],
                [ 17, [[15, 64, 1], [19, 16, 2]], false ], [ 7, [[8, 64, 1], [9, 16, 2]], false ]];
                */

            var array = {};
            var subArr;
            var tileArr;
            var tileKey;
            var huAllTag;

            for (var i = 0; i < _allWinTiles.length; ++i){

                tileKey  = _allWinTiles[i][0];
                subArr   = _allWinTiles[i][1];
                huAllTag = _allWinTiles[i][2];

                array[tileKey] = [];               // 以听胡的牌为key 结构为readyHand:{key:[{},{}]}
                array['_' + tileKey] = huAllTag;   // 是否可以胡任意牌的标记，1：可以胡任意，0：只能胡给出的

                for (var j = 0; j < subArr.length; ++j){
                    tileArr = subArr[j];
                    array[tileKey].push({
                        tile    : tileArr[0],   // 要听的牌
                        scoring : tileArr[1],   // 番数
                        lastCnt : tileArr[2]    // 剩余张数
                    });
                }
            }
            return array;
        },

        /*
        @麻将托管协议翻译
        params _value 是否托管的数值，取值0，1
        */
        trusteeTranslation:function(_value){
                return _value == 1;
        },

        /*
        @吃碰杠主动操作按钮面板协议翻译
        将调用者传递过来的与操作面板相关数据翻译成客户端使用数据
        params _dataObj:数据对象 key为操作，value为相关数据

        返回值为一个数组，表示操作面板上按钮的数量
        */
        optionPanelTranslation:function (_param){
            var data   = [];
            
            //胡牌 的提示
            var points = _param.points;
            if (points) {
                data.push({
                    type: GLOBAL_OBJ.table.global.METHODS.WIN,
                    points: points,
                })
            }

            //明杠的提示
            var exposed_kongs = _param.exposed_kongs;
            if (exposed_kongs&&exposed_kongs.length>0) { 
                for(var i in exposed_kongs){
                    data.push({
                        type: exposed_kongs[i].style,
                        tiles: exposed_kongs[i].pattern
                    });
                };
            };

            //暗杠的提示
            var concealed_kongs = _param.concealed_kongs;
            if (concealed_kongs&&concealed_kongs.length>0) { 
                for(var i in concealed_kongs){
                    data.push({
                        type: concealed_kongs[i].style,
                        tiles: concealed_kongs[i].pattern
                    });
                };
            };

            //吃牌提示
            var chows = _param.chows;
            if (chows&&chows.length>0) {
                for(var i in chows){
                    data.push({
                        type: GLOBAL_OBJ.table.global.METHODS.CHOW,
                        tiles: chows[i]
                    });
                };
            };
            
            //碰牌提示
            var pongs = _param.pongs;
            if (pongs&&pongs.length>0) {
                for(var i in pongs){
                    data.push({
                        type: GLOBAL_OBJ.table.global.METHODS.PONG,
                        tiles: pongs[i]
                    }); 
                };
            };

            var tingData = _param.ting;
            if (GLOBAL_OBJ.bkernel.Functions.isEmptyObject(tingData) == false)
            {
                data.push({
                    type : GLOBAL_OBJ.table.global.METHODS.TING,
                    tingArray : tingData,
                });
            }

            //抢杠 胡牌 的提示
            var grabPoints = _param.grabPoints;
            if (grabPoints) {
                data.push({
                    type: GLOBAL_OBJ.table.global.METHODS.GRAB_HU_KONG,
                    points: grabPoints,
                })
            }

            //抢听 杠
            var _grab_kongs = _param.grab_kongs;
            if (_grab_kongs&&_grab_kongs.length>0) { 
                for(var i in _grab_kongs){
                    data.push({
                        //杠（抢听）
                        type: GLOBAL_OBJ.table.global.METHODS.GRAB_KONG,
                        tiles: _grab_kongs[i]
                    }); 
                }
            }

            var _grab_pongs = _param.grab_pongs;
            if (_grab_pongs&&_grab_pongs.length>0) {
                for(var i in _grab_pongs){
                    data.push({
                        type: GLOBAL_OBJ.table.global.METHODS.GRAB_PONG,
                        tiles: _grab_pongs[i]
                    });
                }
            }

            if (!points || points.length == 0)
            {
                data.sort(function(data1, data2){
                    return data1.type > data2.type;
                });
            }

            return data;
        },

    };
    //end
})();

