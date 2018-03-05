/*************************************************************
 *  mahjong_base_resizable_label_bubble.js
    mahjong_base_resizable_label_bubble
 *  mahjong
 	tip气泡 基类
 *
 *  Created by zengxx on 16-02-18
 *  特殊说明：
 	1._lblText为ccb中设置文本节点，本类的子类中必须有，且命名不能改
 	2._background为气泡背景，本类的子类中必须有，且命名不能改
	3.ccb里的label的setDimensions方法只接受两个参数（width，height），而代码创建的label支持cc.size
	4.setDimensions后，label的长度或者高度就保持不变了，所以要重复setDimensions来比较label的长度或者高度
    使用方法:
 */

(function(){
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.businesses.base.ResizableLabelBubbleController = GLOBAL_OBJ.bkernel.base.BaseController.extend({
		_TAG:'GLOBAL_OBJ.businesses.base.ResizableLabelBubbleController',

		ctor:function(){
			this._super();
		},

		init:function(_ccb){
			this._super(_ccb);
		},

		onLoad:function(){
			this._super();
		},

		// 供子类重写，用来自定义气泡大小，仅供内部使用
		getDimensions:function(){
			return cc.size(250,0);
		},

		/*
		设置气泡里的内容*/
		setString:function(_txt){
	        this._lblText.setDimensions( 0, 0 );
	        this._lblText.setString(_txt);
	        var size0 = this._lblText.getContentSize();
	        var size1 = this.getDimensions();
	        var size2 = cc.size(0, 0);
	        this._lblText.setDimensions( size1.width, size1.height );
	        this._lblText.setString(_txt);
	        var size3 = this._lblText.getContentSize();
	        
	        size2.width  = size0.width  < size1.width ? size0.width : size1.width;
	        size2.height = size3.height > 50 ? size3.height : 50;
	        
	        var size4 = cc.size(size2.width+30, size2.height+20);
	        this._background.setPreferredSize(size4);
			this.view.ccbRootNode.setContentSize(size4);

			this._lblText.setPosition( cc.p( 15,(size4.height)*0.5) );
			this._background.setPosition( cc.p( size4.width*0.5,(size4.height)*0.5) );
		}
	})
})();