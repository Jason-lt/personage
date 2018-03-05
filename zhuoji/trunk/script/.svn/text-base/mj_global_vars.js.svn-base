/**
 * Author   WYF
 * Date     14-4-22
 * Time     下午8:47
 * Desc     全局变量
 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;

    GLOBAL_OBJ.GlobalVars = {
        /**
         * 成员变量
         */
        _systemStaticInfo           : null,                 // 系统静态信息
        _clientId                   : null,                 // CLIENT ID
        _appName                    : null,                 // 游戏名字
        _resRootPath                : null,                 // 资源根目录
        _imgRootPath                : null,                 // 贴图的根目录
        _htmlPath                   : "",                   //html路径
        _designResolutionScaleX     : 1,                    // 相对缩放
        _designResolutionScaleY     : 1,                    // 相对缩放
        _isAsPlugin                 : false,                // 是否以麻将插件的身份启动游戏，即麻将大厅的话为false，麻将插件为true
        _hallImgRootParh            : "",                   //大厅的img资源路径
        _enterType                  : null,                 // 进入方式，roomlist, quickstart, ...
        _pluginGameType             : null,                 // modify by zengxx 大厅进入插件的位置
        _createPlayMode             : null,                 // 记录自建桌通过哪种玩法进入的
        _createPlayModes            : [],                   // modify by zengxx 点击大厅入口，决定能够创建哪些玩法桌子
        _isTableRecord              : false,                // add 4 record, by simon, 查看是否是牌局回放
        _checkOtherRecord           : false,
        _checkOtherRecordUserID     : null,
        _chareIsShowedTips          : false,                //这个字段是用来记录牌局结束，提示用户菜单按钮中有对局详情按钮的气泡提示，打开插件后只提示一次
        /**
         * 初始化
         */
        init:function(isDebug)
        {
            // 系统静态信息
            var strInfo = ty.SystemInfo.getAllStaticInfo();
            GLOBAL_OBJ.LOGD(this._TAG, 'SystemInfoStatic:' + strInfo);
            this._systemStaticInfo = JSON.parse(strInfo);
            if(this._systemStaticInfo)
            {
                this._clientId      = this._systemStaticInfo['clientId'];
                this._appName       = this._systemStaticInfo['app_name'];
            }
            
            // 资源根目录
            this._resRootPath   = 'games/' + GLOBAL_OBJ.GAMENAME;
            this._imgRootPath   = this._resRootPath + '/img';
            this._htmlPath      = this._resRootPath + '/html/';

            // 相对缩放
            var realDesignResolution = ty.Util.getDesignResolutionSize();
            GLOBAL_OBJ.LOGD(this._TAG, 'DesignResolutionSize - '+JSON.stringify(realDesignResolution));
            this._designResolutionScaleX = realDesignResolution.width / GLOBAL_OBJ.DesignResolutionSize.width;
            this._designResolutionScaleY = realDesignResolution.height / GLOBAL_OBJ.DesignResolutionSize.height;
            GLOBAL_OBJ.LOGD(this._TAG, 'DesignResolutionScaleX － ' + this._designResolutionScaleX);
            GLOBAL_OBJ.LOGD(this._TAG, 'DesignResolutionScaleY － ' + this._designResolutionScaleY);
        },

        /**
         * getters
         * @returns {*}
         */
        getClientId:function()                      { return this._clientId; },
        getGameType:function()                      { return "guobiao"; },
        getResRootPath:function()                   { return this._resRootPath; },
        setHtmlPath:function(_path)                 { this._htmlPath = _path;},
        getHtmlPath:function()                      { return this._htmlPath;},
        getImgRootPath:function()                   { return this._imgRootPath; },
        getDesignResolutionScaleX:function()        { return this._designResolutionScaleX; },
        getDesignResolutionScaleY:function()        { return this._designResolutionScaleY; },
        getAppName:function()                       { return this._appName; },
        setAsPlugin:function(_asPlugin)             { this._isAsPlugin = _asPlugin},
        isAsPlugin:function()                       { return this._isAsPlugin},
        setEnterType: function(enterType) {this._enterType = enterType;},
        getEnterType: function() {return this._enterType;},
        setCreatePlayMode:function(_createPlayMode) { this._createPlayMode = _createPlayMode; },
        getCreatePlayMode:function() { return this._createPlayMode; },
        // add 4 record
        setIsTableRecord:function(_boolean) { this._isTableRecord = _boolean; },
        getIsTableRecord:function() {return this._isTableRecord; },

        // modify by zengxx
        setCreatePlayModes:function(_createPlayModes) { this._createPlayModes = _createPlayModes || []; },
        getCreatePlayModes:function() { return this._createPlayModes; },
        // add 4 record
        setCheckOtherRecordType:function(recordType) { this._checkOtherRecord = recordType; },
        getCheckOtherRecordType:function() { return this._checkOtherRecord; },
        setCheckOtherRecordUserID:function(userID) { this._checkOtherRecordUserID = userID; },
        getCheckOtherRecordUserID:function(userID) { return this._checkOtherRecordUserID; },

        setIsShowedTips:function(param) { this._chareIsShowedTips = param},
        getIsShowedTips:function() { return this._chareIsShowedTips || false; }
    };
})();
