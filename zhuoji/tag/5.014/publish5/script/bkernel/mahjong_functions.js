/*************************************************************
 *  mahjong_funtions.js
    mahjong_funtions
 *  mahjong
 	麻将牌桌全局函数
 *
 *  Created by nick.kai.lee on 16-06-16
 *  特殊说明：
 	
    使用方法:

 */
(function () {
	var GLOBAL_OBJ = guiyang;
	GLOBAL_OBJ.bkernel.Functions = {

		/*
		 @获得真实boundingbox(坐标系来自相对世界的坐标)
		 params _node:参考节点
		 */
		boundingBoxRefWorld:function( _node ){
			var size  = _node.getContentSize();
			var point = _node.getParent().convertToWorldSpace(_node.getPosition());
			return cc.rect(
				point.x-size.width*_node.getAnchorPoint().x,
				point.y-size.height*_node.getAnchorPoint().y,
				size.width,size.height);
		},

		/*
		 @获得真实boundingbox(坐标系来自相对父节点的坐标)
		 params _node:参考节点
		 */
		boundingBoxRefSelf:function( _node ){
			var size  = _node.getContentSize();
			return cc.rect(0,0,size.width,size.height);
		},

		/*
		 检测一个对象是否是空对象 {}
		 */
		isEmptyObject:function(_obj){
			for (var key in _obj){
				return false;
			}
			return true;
		},

		isDebug:function(){
			return ty.IS_DEBUG == true || typeof(ty.OFFLINECONFIG) != 'undefined';
		},
		// 递归设置node节点的关联透明度
		recurseCascadeOpacity:function(node, v) {
			node.setCascadeOpacityEnabled(v);
			var array = node.getChildren();
			for (var i = 0;i < array.length; i++){
				this.recurseCascadeOpacity(array[i], v);
			}
		},
		/**
		 * 把一个精灵进行圆角处理
		 * @param spr 要处理的精灵
		 * @param r 圆角半径 （0.0 - 1.0）
		 */
		roundRect:function (spr, r) {
			var vsh = "                               																									\n\
					attribute vec4 a_position;                																							\n\
					attribute vec2 a_texCoord;                																							\n\
															  																							\n\
					#ifdef GL_ES                              																							\n\
					varying mediump vec2 v_texCoord;		  																							\n\
					#else									  																							\n\
					varying vec2 v_texCoord;				  																							\n\
					#endif									  																							\n\
															  																							\n\
					void main()								  																							\n\
					{										  																							\n\
						gl_Position = CC_PMatrix * a_position;																							\n\
						v_texCoord = a_texCoord;              																							\n\
					}";

			var fsh = "																																	\n\
					varying vec2 v_texCoord;																											\n\
					uniform float u_edge;																												\n\
																																						\n\
					void main()																															\n\
					{																																	\n\
						float edge = u_edge;																											\n\
						float dis = 0.0;																												\n\
						vec2 texCoord = v_texCoord;																										\n\
						if ( texCoord.x < edge )																										\n\
						{																																\n\
							if ( texCoord.y < edge )																									\n\
							{																															\n\
								dis = distance( texCoord, vec2(edge, edge) );																			\n\
							}																															\n\
							if ( texCoord.y > (1.0 - edge) )																							\n\
							{																															\n\
								dis = distance( texCoord, vec2(edge, (1.0 - edge)) );																	\n\
							}																															\n\
						}																																\n\
						else if ( texCoord.x > (1.0 - edge) )																							\n\
						{																																\n\
							if ( texCoord.y < edge )																									\n\
							{																															\n\
								dis = distance( texCoord, vec2((1.0 - edge), edge ) );																	\n\
							}																															\n\
							if ( texCoord.y > (1.0 - edge) )																							\n\
							{																															\n\
								dis = distance( texCoord, vec2((1.0 - edge), (1.0 - edge) ) );															\n\
							}																															\n\
						}																																\n\
																																						\n\
						if(dis > edge)																													\n\
						{																																\n\
							gl_FragColor = vec4(0, 0, 0, 0);																							\n\
						}																																\n\
						else																															\n\
						{																																\n\
							gl_FragColor = texture2D( CC_Texture0,texCoord);																			\n\
						}																																\n\
					}";

			var program = new cc.GLProgram();
			program.initWithString(vsh, fsh);
			program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
			program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
			program.link();
			program.updateUniforms();

			var glProgramState = cc.GLProgramState.getOrCreateWithGLProgram(program);
			glProgramState.setUniformFloat("u_edge", r); //设置圆角半径
			spr.setGLProgramState(glProgramState);
		}
	};
})();
