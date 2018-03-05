/*****************************************
 *  mahjong_user_portrait_module.js
    麻将 用户头像模块
 *  mahjong

 *  Created by nick.kai.lee on 16-08-05
 *  特殊说明：
    1. 通过produce获得一个头像窗体（新建或者复用）
    2. 头像窗体新建时会触发UPDATE_USER_INFO通知更新该头像uid对应的所有头像。
    3. 该module收到UPDATE_USER_INFO通知后，通过visit接口来访问头像的图片下载资源。
    4. 图片下载完毕后通知头像的update接口，刷新头像图像和对象的数据。

    如果需要强刷某个uid对应的所有头像，使用visit接口即可

    使用说明:
    var a = GLOBAL_OBJ.businesses.modules.User.Portrait.produce(10001,
        GLOBAL_OBJ.businesses.windows.consts.C_PORTRAIT_BASIC_WINDOW,
        cc.Director.getInstance().getRunningScene());
 */

(function(){
    var GLOBAL_OBJ = guiyang;
    /*
    @MODEL_USER模块*/
    var ASYNC_IMAGE_KEY                      = "portrait";
    var recircle_pools                       = {};
    var MODEL_USER                           = GLOBAL_OBJ.businesses.modules.User.Model;
    var STATIC                               = GLOBAL_OBJ.businesses.modules.User.Static;
	GLOBAL_OBJ.businesses.modules.User.Portrait = {
        _TAG:"businesses.modules.User.Portrait",
        boot:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE LOAD");
            
            ty.extend.schedulerExtend(this);
            
            var that     = this;
            /*
            @ 注册通知*/    
            GLOBAL_OBJ.bkernel.utils.Notification.listen(GLOBAL_OBJ.businesses.Events.UPDATE_USER_INFO, function(_params){
                //异步操作，produce 的 push操作在头像发起本通知之后，如果图片下载过，发起本通知刷新头像是同步操作，
                //这样导致头像还来不及加进recircle_pools池，最后刷新不出来头像图片
                that.async(function(){
                    that.visit(_params.uid);
                }, 0);
            }, this);

            /*
            @注册头像图片下载监听*/
            GLOBAL_OBJ.bkernel.utils.AsyncDownload.listen(ASYNC_IMAGE_KEY, function(_object, _params){
                var uid    = _params.uid;
                var path   = _object.path;
                var object = null;
                for(var type  in recircle_pools){
                    if (path) { 
                        recircle_pools[type].update(uid, path); 
                    }
                }
            }, this);
        },

        shut:function(){
            GLOBAL_OBJ.LOGD(this._TAG,"MODULE UNLOAD");
            /*
            @注销监听*/
            GLOBAL_OBJ.bkernel.utils.Notification.ignoreAll(this);
            GLOBAL_OBJ.bkernel.utils.AsyncDownload.ignoreAll(this);

            if (this.unscheduleAll) {
                this.unscheduleAll();
            }
            
            //释放缓存池
            for(var type in recircle_pools){
                recircle_pools[type].shut();
            }
            recircle_pools = {};
        },

        /*
        @访问头像，其实就是刷新指定UID的头像*/
        visit:function( _uid ){
            var portraitUrl = MODEL_USER.getPortraitUrl( _uid );

            GLOBAL_OBJ.LOGD(this._TAG, "访问头像,UID:" + _uid + "; portraitUrl:" + portraitUrl);

            if (!portraitUrl) {
                return;
            }

            GLOBAL_OBJ.bkernel.utils.AsyncDownload.doDownload(
                ASYNC_IMAGE_KEY,
                portraitUrl,
                STATIC.PATH.HEAD,
                {uid: _uid}
            );
        },

        /*
        @创建头像
        param _uid: 用户id
        param _constType: 头像类型 eg: ....windows.consts.C_PORTRAIT_BASIC_WINDOW
        param _parent: 父节点
        */
        produce:function(_uid, _constType, _parent){
            //头像分类建池
            var that = this;
            recircle_pools[_constType] = recircle_pools[_constType] || GLOBAL_OBJ.bkernel.utils.Recircle.produce(_constType+"头像管理器",
                function(_params){
                    var head = new GLOBAL_OBJ.businesses.windows.Portraits.Basic({ uid: _params[1]});
                    head.init(GLOBAL_OBJ.RES.PORTRAITBASIC_CCBI);
                    return head;
                }, function(_target, _params){
                    _target.doClean();
                    _target.setUserId( _params[1] );
                    that.visit( _params[1] );//复用改变uid
                }, function(_target, _params){
                    if ( _target && _target.getUserId() == _params[0] ) {
                        // uid&path
                        _target.update(_params[0], _params[1]); //只通知uid一致的头像
                    }
                });

            var head = recircle_pools[_constType].produce(_constType, _uid, _parent);
            _parent.addChild(head.getRootNode());
            head.getRootNode().setPosition(_parent.width/2, _parent.height/2);
            return head;
        },

        test:function(){
            
        }
	};
})();
