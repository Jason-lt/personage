/************************************************************************
 *  mahjong_extend_editbox.js
 *  编辑框功能扩展
 *  mahjong
 *
 *  Created by nick.kai.lee on 16-07-04
 *  特殊说明：
	扩展一个编辑框的功能
	
 	使用方法:
    GLOBAL_OBJ.bkernel.extend.EditBox.bind_editbox_ext(parent,callfunc,params);
 */


(function(){
	var GLOBAL_OBJ = guiyang;

	/*
	@editbox 生成器
	params _params: edibox需要的参数
	params _parent: 父节点
	params _delegate: 回调函数代理
	*/
	var ___f__editbox_producer = function(_params, _parent, _delegate){
		var params = {
			fontSize : _params.fontSize  || 22,
			fontColor: _params.fontColor || cc.WHITE,
			placeColor: _params.placeColor || cc.WHITE,
			// placeSize: _params.placeSize || 22,
			place: _params.place || "",
			font: _params.font || "Arial-BoldMT",
			placeFont: _params.placeFont || "Arial-BoldMT",
			placeFontSize: _params.placeFontSize || 22,
			inputMode: _params.inputMode || cc.EDITBOX_INPUT_MODE_ANY,
			maxLength: _params.maxLength || 20,
		};

		var size        = _parent.getContentSize();
        var scaleSprite = cc.Scale9Sprite.create();
        scaleSprite.setOpacity( 0 );
        var editBox     = cc.EditBox.create(size, scaleSprite);
        _parent.addChild(editBox);

        editBox.setAnchorPoint(cc.p(0.5, 0.5));
        editBox.setPosition(cc.p(size.width/2, size.height/2));
        editBox.setFontSize( params.fontSize );
        editBox.setFontColor( params.fontColor );
        editBox.setPlaceholderFont( params.placeFont, params.placeFontSize  );
        editBox.setPlaceholderFontColor( params.placeColor );
        editBox.setPlaceHolder( params.place );
        editBox.setFontName( params.font );
        editBox.setInputMode( params.inputMode );
        editBox.setMaxLength(params.maxLength);
        editBox.setDelegate(_delegate);
        return editBox;
	};

	GLOBAL_OBJ.bkernel.extend.EditBox  = {

		/*
		@editbox基础扩展
		params _parent: 父节点
		params _callFuncs: 回调函数
		params _params: 参数
		*/
		bind_editbox_ext:function( _parent, _callFuncs, _params ){
			var parent    = _parent;
			var params    = _params || {};

			var onBegin   = _callFuncs.onBegin   || function(){};
			var onEnd     = _callFuncs.onEnd     || function(){};
			var onChange  = _callFuncs.onChange  || function(){};
			var onReturn  = _callFuncs.onReturn  || function(){};

			var delegate  = {
				editBoxEditingDidBegin:function(_sender){
					onBegin(_sender);
				},
				
				editBoxEditingDidEnd:function(_sender){
					onEnd(_sender);
				},

				editBoxTextChanged:function(_sender, _text){
					onChange(_sender, _text);
				},

				editBoxReturn:function(_sender){
					onReturn(_sender);
				},
			};

			return ___f__editbox_producer(params, parent, delegate);
		},

	};//end
})();
