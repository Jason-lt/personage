/*************************************************************
 *  mahjong_table_menu_chat.js
    mahjong_table_menu_chat
 *  mahjong
 	麻将牌 菜单
 *
 *  Created by nick.kai.lee on 16-06-12
 *  特殊说明：
    使用方法:

 */
(function(){
    "use strict";
    var GLOBAL_OBJ = guiyang;
	var C2S = GLOBAL_OBJ.table.network.C2S;
    var AUDIO = GLOBAL_OBJ.bkernel.utils.Audio;
	var MODEL_TABLEINFO = GLOBAL_OBJ.table.models.TableInfo;

	GLOBAL_OBJ.table.windows.Menu.Chat = GLOBAL_OBJ.bkernel.base.BaseWindowController.extend({
		_TAG:"table.windows.Menu.Chat",
		ctor: function() {
			this._super();
		},

		init:function(_ccb) {
			this._super(_ccb);
		},

		onLoad: function() {
			this._super();

			var that    	   = this;
            var size;
			/*
			@文字聊天*/
			size       	   = this.nodeTextViewNode.getContentSize();

            this.textTableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :cc.size(size.width,size.height),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   :cc.size(size.width, 62),
                controller :GLOBAL_OBJ.table.windows.Menu.Chat.Cell00,
                container  :this.nodeTextViewNode,
                data       :{
                    callFunc:function(_txt){
                        that.windowClose();
                        C2S.requestTableChat(
                            MODEL_TABLEINFO.getRoomId(),
                            MODEL_TABLEINFO.getTableId(),
                            MODEL_TABLEINFO.getActiveServerSeatId(), 0, _txt);
                    }
                }
            });
            this.nodeTextViewNode.addChild(this.textTableview);
            this.textTableview.reloadData(8);
            this.textTableview.setTouchEnabled(false);

            /*
			@emo聊天*/
			size       	  = this.nodeEmotionViewNode.getContentSize();
            this.emoTableview = GLOBAL_OBJ.bkernel.utils.TableView.Layer.create({
                viewSize   :cc.size(size.width,size.height),
                direction  :cc.SCROLLVIEW_DIRECTION_VERTICAL,
                fillOrder  :cc.TABLEVIEW_FILL_TOPDOWN,
                cell       :GLOBAL_OBJ.bkernel.utils.TableView.Cell.Common,
                cellSize   :cc.size(size.width, 120),
                controller :GLOBAL_OBJ.table.windows.Menu.Chat.Cell01,
                container  :this.nodeEmotionViewNode,
                data       :{ callFunc:function(_index){
                	that.windowClose();
                	C2S.requestTableChat(
                		MODEL_TABLEINFO.getRoomId(), 
	                    MODEL_TABLEINFO.getTableId(), 
	                    MODEL_TABLEINFO.getActiveServerSeatId(), 1, _index + 1);
                } }
            });

            this.nodeEmotionViewNode.addChild(this.emoTableview);
            this.emoTableview.reloadData(3);
            this.emoTableview.setTouchEnabled(false);

            //输入框
            // this.editBox = GLOBAL_OBJ.bkernel.extend.EditBox.bind_editbox_ext( this.sp9InputBg, (function(){
            //     var text = "";
            //     return {
            //         onChange:function(_sender, _text){
            //             text = _text;
            //         },
            //         onReturn:function(_sender){
            //             var sender = _sender;
            //         //     if (text && text.length > 0){
            //         //         C2S.requestTableChat(
		     //            		// MODEL_TABLEINFO.getRoomId(),
			 //                 //    MODEL_TABLEINFO.getTableId(),
			 //                 //    MODEL_TABLEINFO.getActiveServerSeatId(), 0, text);
            //         //     };
            //         //     sender.setString(text = "");
            //         },
            //     };
            // })(),{
            //     fontSize:25,
            //     placeFontSize:25,
            //     place:"请输入聊天内容",
            //     placeColor:cc.color(255, 255, 255),
            //     fontColor:cc.color(255, 255, 255),
            //     maxLength:30,
            // });
		},

		onCleanup:function() {
			this._super();
		},

		onEase:function(){
			this._super();
		},

		/*是否监听物理返回键，默认监听。不监听的在子类中重写返回false即可*/ 
		isKeyBackListenEnabled:function(){
			return false;
		},

		/*touch响应，基类重载*/
        onTouchBegan:function(_touch, _event){
            var touch = _touch;
            var point = this.view.ccbRootNode.convertToNodeSpace(touch.getLocation());
            var rect  = this._bgNode.getBoundingBox();

            if ( !cc.rectContainsPoint(rect, point) )
            {
                this.windowClose();    //窗外点击;
            }

            return true;
        },

		onClose:function(){
            AUDIO.audio(GLOBAL_OBJ.RES.UI_CLOSEBUTTON_MP3);
			this.windowClose();
		},

		// onSend:function(){
		// 	var text = this.editBox.getString();
		// 	if (text && text.length > 0){
         //        C2S.requestTableChat(
         //    		MODEL_TABLEINFO.getRoomId(),
         //            MODEL_TABLEINFO.getTableId(),
         //            MODEL_TABLEINFO.getActiveServerSeatId(), 0, text);
         //        this.windowClose();
         //    }
		// }
	});

})();