/**
 * 用户头像类
 * Created by 许敬 on 2017/6/23.
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    
    GLOBAL_OBJ.Avatar = cc.Class.extend({
        _TAG:'RoomController',
        /**
         * 头像初始化
         * @param headerUrl 图片地址
         * @param parentNode 目标Node（要把这个放到哪里）
         * @param size 头像尺寸
         * @param defaultImg 默认头像（可选）
         * @param bgImg 底图（可选）
         * @param coverImg 覆盖图（可选）
         */
        ctor:function (headerUrl, parentNode, size , defaultImg, bgImg ,coverImg) {

            this.avatarSize = size;
            // this.targetParent = parentNode;
            this.loadHeaderUrl = headerUrl;
            this.defaultImg = defaultImg || null;
            this.bgImg = bgImg || null;
            this.coverImg = coverImg || null;
            this.canTouch = false;

            this.isDefault = false;

            this.avatarNode = cc.Node.create();
            parentNode.addChild(this.avatarNode);

            if (this.bgImg){
                this.bgSprite = cc.Sprite.createWithSpriteFrameName(this.bgImg);
                this.avatarNode.addChild(this.bgSprite);
            }

            this.mask = this.getMask();
            this.avatarNode.addChild(this.mask);

            if (this.coverImg){
                this.coverSprite = cc.Sprite.createWithSpriteFrameName(this.coverImg);
                this.avatarNode.addChild(this.coverSprite);
            }

            this.createDefaultAvatar();

            ty.AsyncImgDownload.addAsyncImgDownloadObserver(
                GLOBAL_OBJ.businesses.scenes.PluginHall.Events.DOWNLOAD_PLAYER_CONTROLLER
                , this
                , this.onFinishDownHead
            );

            this.reloadAvatar();
        },

        createDefaultAvatar:function () {
            if (this.defaultImg){
                this.isDefault = true;
                if (!this.avatarSprite){
                    this.avatarSprite = cc.Sprite.createWithSpriteFrameName(this.defaultImg);
                    this.mask.addChild(this.avatarSprite);
                }
                else{
                    GLOBAL_OBJ.businesses.functions.textureChange(this.avatarSprite, this.defaultImg);
                }
            }
        },

        showDefaultAvatar:function () {
            if (this.isDefault) return;
            GLOBAL_OBJ.LOGD(this._TAG, "showDefaultAvatar 显示默认头像");
            this.createDefaultAvatar();
        },

        reloadAvatar:function () {
            this.loadImg(this.loadHeaderUrl);
        },


        //开始下载
        loadImg: function(imgUrl) {
            GLOBAL_OBJ.LOGD(this._TAG, "loadImg url 1:" + imgUrl);
            //玩家头像
            if(imgUrl){
                ty.AsyncImgDownload.downloadImgAsync(
                    GLOBAL_OBJ.businesses.scenes.PluginHall.Events.DOWNLOAD_PLAYER_CONTROLLER
                    , imgUrl
                    , 'games/hall/img/nopack/head/'
                    , {"owner":this}
                );
            }
            GLOBAL_OBJ.LOGD(this._TAG, "loadImg开始下载房间列表中的头像:");
        },

        //取消后获取头像对象地址
        onFinishDownHead:function (retObj, parameters) {
            // GLOBAL_OBJ.LOGD(this._TAG, "onFinishDownHead 1:" + JSON.stringify(retObj) + '\n2:' + JSON.stringify(parameters));
            if (parameters['owner'] != this) {
                return;
            }
            //网络请求是否正确
            if(retObj.statusCode == 200 && retObj.openErr != 1 && retObj.writeErr != 1)
            {
                this._headPicPath = retObj.path;
                this.setPlayerHead();
            }
        },

        getMask:function () {
            var maskFile;
            switch (this.avatarSize.width){
                case 65:
                    maskFile = GLOBAL_OBJ.RES.AVATAR_MASK_PNG;
                    break;
                case 136:
                    maskFile = GLOBAL_OBJ.RES.MENU_AVATAR_MASK_PNG;
                    break;
                default:
                    maskFile = GLOBAL_OBJ.RES.AVATAR_MASK_PNG;
                    break;
            }

            var stencil = cc.Sprite.createWithSpriteFrameName(maskFile);
            // var stencil = cc.DrawNode.create();
            // var radius = this.avatarSize.width / 2;
            // stencil.drawDot(cc.p(0,0), radius ,cc.color(255,255,255));

            var mask = cc.ClippingNode.create();
            mask.setStencil(stencil);
            mask.setAlphaThreshold(0.1);
            mask.setContentSize(stencil.getContentSize());

            return mask;
        },

        setPlayerHead:function(){

            GLOBAL_OBJ.LOGD(this._TAG, "setPalyerHead开始设置头像:");
            //设置头像

            if (this.avatarSprite){
                var sprite = cc.Sprite.create(this._headPicPath);
                var size = sprite.getContentSize();
                var rect = cc.rect(0, 0, size.width, size.height);
                var frame = cc.SpriteFrame.create(this._headPicPath, rect);
                if(frame){
                    // size = frame.getOriginalSizeInPixels();
                    this.avatarSprite.setSpriteFrame(frame);
                    this.avatarSprite.setContentSize(size);
                }
            }
            else{
                this.avatarSprite = cc.Sprite.create(this._headPicPath);
                this.mask.addChild(this.avatarSprite);
            }

            this.isDefault = false;
            if (!this.avatarSprite) {
                return;
            }
            var a = this.avatarSize;
            var b = this.avatarSprite.getContentSize();

            // var p = cc.p(a.width / 2, a.height / 2);

            this.avatarSprite.setScale(Math.min(a.width/b.width, a.height/b.height));
            var self = this;

            this.touchListener = GLOBAL_OBJ.bkernel.extend.Touch.bind_simple_touch(this.avatarSprite, false, null, null, function (listener, touch, event, inRect) {
                if (self.canTouch) {
                    ty.NotificationCenter.trigger(GLOBAL_OBJ.businesses.scenes.PluginHall.Events.SHOW_OR_HIDE_MENULIST, {"name":"touchLayer"});
                }
            }, null,this);
        },

        removeOldAvatar:function () {
            if (this.avatarSprite){
                GLOBAL_OBJ.LOGD(this._TAG, "removeOldAvatar 删除之前头像");
                if (this.avatarSprite.__nativeObj){
                    this.avatarSprite.removeFromParent();
                }
                this.avatarSprite = null;
            }
        },

        destroy:function () {

            ty.AsyncImgDownload.removeAsyncImgDownloadObserver(
                GLOBAL_OBJ.businesses.scenes.PluginHall.Events.DOWNLOAD_PLAYER_CONTROLLER
                , this
                , this.onFinishDownHead
            );

            if (this.touchListener && this.touchListener.__nativeObj){
                cc.eventManager.removeListener(this.touchListener);
            }
            this.touchListener = null;

            this.removeOldAvatar();

            if (this.bgSprite && this.bgSprite.__nativeObj){
                this.bgSprite.removeFromParent();
            }
            this.bgSprite = null;

            if (this.mask && this.mask.__nativeObj){
                this.mask.removeFromParent();
            }
            this.mask = null;

            if (this.coverSprite && this.coverSprite.__nativeObj){
                this.coverSprite.removeFromParent();
            }
            this.coverSprite = null;

            if (this.avatarNode && this.avatarNode.__nativeObj){
                this.avatarNode.removeFromParent();
            }
            this.avatarNode = null;

            this.avatarSize = null;
            // this.targetParent = null;
            // this.touchCallBackFun = null;
            this.defaultImg = null;
            this.bgImg = null;
            this.loadHeaderUrl = null;
        }
    });
//end
})();