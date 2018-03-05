/*************************************************************
 *  mahjong_create_room_record_player_cell.js
    mahjong_create_room_record_player_cell
 *  mahjong
    自建桌 战绩 玩家信息 cell
 *
 *  Created by xujing on 2017-5-27
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;

    var GLOBAL_FUNCS = GLOBAL_OBJ.businesses.functions;
    var STATIC = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
    var RecordCell = GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordCell;
    
    GLOBAL_OBJ.businesses.scenes.CustomRoom.RecordPlayerCell = GLOBAL_OBJ.bkernel.base.BaseController.extend({
        _TAG:"businesses.scenes.CustomRoom.RecordPlayerCell",
        
        ctor: function(_data, _flag) {
            this._super();
            this.data = _data;
            this.showIcon = _flag;

            // GLOBAL_OBJ.LOGD("check_record_player_cell", JSON.stringify(_data));

            this.init(GLOBAL_OBJ.RES.CREATE_ROOM_RECORD_PLAYER_CELL_CCBI);
        },

        onLoad: function() {
            this._super();
            this.txtName.setString(GLOBAL_FUNCS.formatUserName(this.data['name']));

            var score = this.data['score'];
            this.txtScore.setString(score);

            if (this.showIcon && score > 0)
            {
                // 大赢家
                this.bigWiner.setVisible(true);
                this.txtScore.setColor(cc.color(177, 22, 22));
            }
            
            var that = this;
            ty.AsyncImgDownload.addAsyncImgDownloadObserver(
                hall.ImgDownloadType.HALL_DOWNLOAD_USERINFO_CUSERINFO_ROOMLIST
                , that
                , that.onFinishDownHead);

            this.addDownLoadHeadEvt();
        },
        
        setHostUid:function(_uid)
        {
            var myuid = this.data['uid'];
            if (this.showIcon && myuid == _uid)
            {
                this.imgFangZhu.setVisible(true);
            } 
        },
        
        setPaoUid:function(_uid)
        {
            var myuid = this.data['uid'];
            if (this.showIcon && myuid == _uid)
            {
                this.dianPao.setVisible(true);
            }
        },

        addDownLoadHeadEvt:function()
        {
            //若用户有自己的头像，则设置自己的头像
            var headUrl = this.data['purl'];//hall.ME.udataInfo.m_purl;//
            GLOBAL_OBJ.LOGD(this._TAG,"头像url是"+headUrl);
            if( headUrl != "" ){
                // 使用网络头像
                ty.AsyncImgDownload.downloadImgAsync(
                    hall.ImgDownloadType.HALL_DOWNLOAD_USERINFO_CUSERINFO_ROOMLIST
                    , headUrl
                    , hall.webPicCache
                    , {});
            }
        },
        
        onFinishDownHead:function (retObj) {
            GLOBAL_OBJ.LOGD(this._TAG,"run onFinishDownHead-----" + retObj.statusCode
                + "------" + retObj.path
                + "-------" + retObj.openErr
                + "-------" + retObj.writeErr);
            if(retObj.statusCode == 200 && retObj.openErr != 1 && retObj.writeErr != 1)
            {
                GLOBAL_OBJ.LOGD(this._TAG,'Download head ok!!!!!! Head image is ' + retObj.path);
                var size            = this.nodeTouXiang.getContentSize();
                var texture         = cc.TextureCache.getInstance().addImage(retObj.path);
                var contentSize     = texture.getContentSize();
                var frame           = cc.SpriteFrame.create(retObj.path, cc.rect(0, 0, contentSize.width, contentSize.height));
                //设置图片
                if (frame)
                {
                    this.sprTouXiang.setSpriteFrame(frame);
                    var scaleX = size.width / contentSize.width;
                    var scaleY = size.height / contentSize.height;
                    this.sprTouXiang.setScaleX(scaleX);
                    this.sprTouXiang.setScaleY(scaleY); //2560 * 1600
                }
                else
                {
                    GLOBAL_OBJ.LOGE(this._TAG,"头像生成frame 失败 ");
                }
            }
            else
            {
                GLOBAL_OBJ.LOGD(this._TAG,"头像下载失败，保持原样");
            }

            ty.AsyncImgDownload.removeAsyncImgDownloadObserver(
                hall.ImgDownloadType.HALL_DOWNLOAD_USERINFO_CUSERINFO_ROOMLIST
                , this
                , this.onFinishDownHead);
        },

        onCleanup:function() {
            this._super();
        },

        /*
        界面刷新
        */
        update:function(_index, _config) {
        }
    });


})();