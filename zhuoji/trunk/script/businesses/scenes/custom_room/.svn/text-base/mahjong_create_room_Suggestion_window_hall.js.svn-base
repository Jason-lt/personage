/*************************************************************
 *  mahjong_create_room_Suggestion_window_hall.js
    mahjong_create_room_Suggestion_window_hall.js
 *  mahjong
 	自建桌 意见提交 window
 pk modify:大厅意见提交弹窗
 *  特殊说明：

    使用方法:
 */
(function(){
    var GLOBAL_OBJ = guiyang;

	var C2S 								         = GLOBAL_OBJ.businesses.network.C2S;
	var GLOBAL_FUNCS							     = GLOBAL_OBJ.businesses.functions;
	var MODEL 										 = GLOBAL_OBJ.businesses.scenes.CustomRoom.Model;
	var STATIC 										 = GLOBAL_OBJ.businesses.scenes.CustomRoom.static;
	GLOBAL_OBJ.businesses.scenes.CustomRoom.SuggestionWindowHall = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"businesses.scenes.CustomRoom.SuggestionWindowHall",
		ctor: function() {
            this.placehoderText = "亲，遇到什么问题啦，或有什么玩法功能建议吗？";
			this._super();
		},

		init: function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();
			this.updateViews()
		},
        onIMEClose:function(){
            GLOBAL_OBJ.LOGD("onIMEClose");
            this._desLabelttf.setVisible(true);
            
            this.suggestion = this.suggestion||this.placehoderText
            if(this.suggestion == ""){
                this.suggestion = this.placehoderText;
            }
            GLOBAL_OBJ.LOGD("this.suggestion  ", this.suggestion);
            this._desLabelttf.setString(this.suggestion);
            this.editbox.setString("");
        },
        onIMEOpen:function(){
            GLOBAL_OBJ.LOGD("onIMEOpen");
            this._desLabelttf.setVisible(false);
            this.editbox.setVisible(true);
            this.suggestion = this.suggestion||this.placehoderText;
            if(this.suggestion == this.placehoderText){
                this.suggestion = "";
            }
            this.editbox.setString(this.suggestion);
        },
        updateViews:function(){
            //聊天输入框
        	this.suggestion = ""; // 我的推荐人的ID
            var that = this;
            var funcs= {
                onChange:function(_sender, _text){
                    GLOBAL_OBJ.LOGD("_text_text_text_text ", _text);
                    
                    that.suggestion = _text;
                    if(that.suggestion == "" || cc.isUndefined(that.suggestion)){
                        that.suggestion = this.placehoderText;
                    }
                    that._desLabelttf.setString(that.suggestion||that.placehoderText);
                },
                onEnd:function(){
                    that.onIMEClose();
                },
                onBegin:function(){
                    that.onIMEOpen();
                },
                onReturn:function(){
                    that.onIMEClose();
                }
            };
            
            var color = cc.color(102, 102, 102);
            var color1 = cc.color(102, 102, 102);
            var  size          = this.inputNode1.getContentSize();
            size.width = size.width - 10;
            size.height = size.height - 10;
			this._desLabelttf = cc.LabelTTF.create(this.placehoderText, "Arial-BoldMT", 24);
            this._desLabelttf.setAnchorPoint(cc.p(0, 1));
            this._desLabelttf.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            this._desLabelttf.setDimensions(cc.size(size.width,0));
            this._desLabelttf.setColor(color);
            this.inputNode1.addChild(this._desLabelttf);
            this._desLabelttf.setPosition(cc.p(10, size.height));
            
            var editbox = GLOBAL_OBJ.bkernel.extend.EditBox.bind_editbox_ext( this.inputNode1,funcs,{
                fontSize:24,
                placeFontSize:24,
                //place:"亲，遇到什么问题啦，或有什么玩法功能建议吗？",
                placeColor:color1,
                fontColor:color,
                maxLength:160,
                inputMode: cc.EDITBOX_INPUT_MODE_ANY
            });
            editbox.setInputMode( cc.EDITBOX_INPUT_MODE_ANY );
            this.editbox = editbox;
            
            //聊天输入框
        	this.contactInformation = ""; // 我的推荐人的ID
            var that = this;
            var phoneEDIT = GLOBAL_OBJ.bkernel.extend.EditBox.bind_editbox_ext( this.inputNode2, (function(){
                return {
                    onChange:function(_sender, _text){
                    	that.contactInformation = _text;
                    }
                };
            })(),{
                fontSize:24,
                placeFontSize:24,
                place:"请您留下手机号码",
                placeColor:color1,
                fontColor:color,
                /*
                placeColor:cc.color(102, 102, 102),
                fontColor:cc.color(102, 102, 102),
                */
                maxLength:160
            });
            phoneEDIT.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        },
		/*
		弹窗弹出完毕
		*/
		onEase:function(){
			this._super();
		},

		onClose:function(){
			this.windowClose();
		},
        onSend:function(){
            var that = this;
            this.suggestion = this.suggestion.trim();
            this.contactInformation = this.contactInformation.trim();
            if(this.suggestion == this.preSuggestion){
                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                     text:"这个问题您已提交过了",
                     duration:2
                 });
                 return;
            }
            if(this.suggestion == "" || this.suggestion == this.placehoderText){
                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                     text:"请输入您的问题或建议",
                     duration:2
                 });
                 return;
            }
            if(this.contactInformation == ""){
                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                     text:"请输入您的联系方式",
                     duration:2
                 });
                 return;
            }
            if(this.contactInformation < 999999){
                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                     text:"请输入正确的联系方式",
                     duration:2
                 });
                 return;
            }
            
            //pk todo:获取玩家的基础信息
            var hp = hall.PluginInterface;
            var timestamp = Date.parse(new Date());
            
            var brand = ty.staticSystemInfo.brand;
            
            var timstr = timestamp/1000;
            var param = {
                content     :   this.suggestion,            //提交的内容
                phone       :   this.contactInformation||"110",    //联系方式
                userid      :   hp.getUserId(),             //玩家ID
                username    :   hp.getUserName(),           //玩家名称
                type        :   5,                          //类型：指定为5
                pt          :   brand||"test",                  //设备名称
                gameid      :   GLOBAL_OBJ.GAMEID,             //插件游戏ID
                serviceid   :   ty.loginUrl,                //SDK登录服务器地址
                ip          :   "123456",                //客户端IP地址
                clid        :   hall.AccountInfo.clientId,  //clientId
                qtime       :   timstr,                  //提交时间
            }
            
            var pstr = "";
            for(var k in param){
                var v = param[k];
                if(pstr != ""){
                    pstr = pstr+"&"+k+"="+v;
                }else{
                    pstr = k+"="+v;
                }
            }
            
            var httpObj = ty.Http;
            function onError(response)
            {
                ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                     text:"提交失败！",
                     duration:2
                 });
                 
            }

            function callback(response)
            {
                if (response.ResponseCode != 200)
                {
                    // 出问题时要回调给调用者
                    onError(response);
                }else{
                    if(response.responseData){
                        //"responseData":"{\"retcode\":1
                        if(response.responseData.indexOf("retcode\":1")){
                            ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                             text:"提交成功！",
                             duration:2
                         });
                        }else{
                            ty.NotificationCenter.trigger(hall.EventType.HALL_POP_COMMON_MSG_BOX_SMALL, {
                             text:"您的提交太频繁了，请稍候再试",
                             duration:2
                            });
                        }
                    }
                 that.preSuggestion = that.suggestion;
                }
            }
            
            var cb = {
                'cb':function(response){
                    callback(response);
                },
            };
    
            pstr = 'http://cs.tuyoo.com/api/getData?'+pstr;
            var configObj = {
                'url': pstr,
                'headers': ['Content-Type: application/json; charset=utf-8'],
                'postData': 'visitor=cocos2d&TestSuite=Extensions Test/NetworkTest',
                'obj'    : cb,
                'callback':cb['cb']
            };
            //configObj.headers.retain();
            // 测试post
            httpObj.httpGet(configObj);

		},
		onCleanup:function(){
			this._super();
		},

		/*
		touch响应，基类重载
		*/
		onTouchBegan:function(_touch,_event){
			this._super();
 			return true;
		},

	});
	//end
})();

