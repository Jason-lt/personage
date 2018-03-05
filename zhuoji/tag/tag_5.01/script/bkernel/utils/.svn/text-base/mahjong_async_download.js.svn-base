/*****************************************
 *  mahjong_async_download.js
    异步http下载（目前只支持png和jpg）
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-06-25
 *  特殊说明：
    对接ty框架里的异步下载模块，目前只支持png和jpg，
    
    使用说明:
    1.注册监听
    GLOBAL_OBJ.bkernel.utils.AsyncDownload.listen("event", function(_object, _params){
        // _object.path  下载存放路径
        // _params 执行doDownload传递的参数
    }, this);
    
    2.下载请求
    GLOBAL_OBJ.bkernel.utils.AsyncDownload.doDownload("event", "http://ddz.image.tuyoo.com/avatar/head_china.png", 
        'games/' + GLOBAL_OBJ.GAMENAME + "/img/heads/", {});
    
    3.注销监听
    GLOBAL_OBJ.bkernel.utils.AsyncDownload.ignoreAll(this);
    GLOBAL_OBJ.bkernel.utils.AsyncDownload.ignore("event", this);
 */

(function () {
    var GLOBAL_OBJ = guiyang;
    GLOBAL_OBJ.bkernel.utils.AsyncDownload = (function(){


        var maps = [];
        return {
            _TAG: "GLOBAL_OBJ.bkernel.utils.AsyncDownload",

            boot:function(){
                GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
                maps = [];
            },

            shut:function(){
                GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
                for(var i in maps){
                    ty.AsyncImgDownload.removeAsyncImgDownloadObserver( maps[i].key,  maps[i].scope, maps[i].callback);
                };
                maps = [];
            },

            /*
             @监听下载通知
             param _key: 字符串型 key名
             param _callFunc: 下载完毕回调函数
             param _object: 下载绑定的对象
             */
            listen:function(_key, _callFunc, _object){
                var callback = _callFunc || function(){};
                var map      = {
                    scope: _object,
                    key: _key,
                    // path: null,
                    callback: function(_object, _params){
                        var path = _object.path;
                        // if (path && this.path != path) { //路径里的文件名是MD5，MD5值相同的情况下不再次回调
                        // this.path = path;
                        //有可能不是200，下载可能出错,openErr和writeErr都非0
                        if ( 200 == _object.statusCode && 0 == _object.openErr && 0 == _object.writeErr ) { callback(_object, _params);  };

                        // }else{
                        // GLOBAL_OBJ.LOGD(this._TAG," 不需要更新图片资源！image:"+this.path);
                        // };
                    },
                };
                ty.AsyncImgDownload.addAsyncImgDownloadObserver(
                    map.key, map.scope, map.callback);

                maps.push(map);
            },

            /*
             @注销下载绑定的对象指定的下载通知
             param _key: 字符串型 key名
             param _object: 下载绑定的对象
             */
            ignore:function(_key, _object){
                maps = maps.filter(function(map){
                    var ret = (map.scope!=_object&&map.key!=_key);
                    if (false == ret) {
                        ty.AsyncImgDownload.removeAsyncImgDownloadObserver( _key, _object, map.callback);
                    };
                    return ret
                });
            },

            /*
             @注销载绑定的对象注册的全部下载通知
             param _object: 下载绑定的对象
             */
            ignoreAll:function(_object){
                maps = maps.filter(function(map){
                    var ret = map.scope !=_object;
                    ty.AsyncImgDownload.removeAsyncImgDownloadObserver( map.key, _object, map.callback);
                    return ret
                });
            },

            /*
             @执行下载命令
             param _key: 字符串型 key名
             param _url: 下载地址
             param _path: 下载存放路径
             param _params: 下载完毕回调传递参数
             */
            doDownload:function(_key, _url, _path, _params){
                ty.AsyncImgDownload.downloadImgAsync(_key, _url, _path, _params);
            },
        };
    })();
})();


