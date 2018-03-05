/**
 * Author  LI
 * Date    14-4-22
 * Desc    DEBUG脚本入口
 *  这个文件只是斗地主游戏代码DEBUG的入口文件，加载各个JS文件
 *
 * 	如果打开,则以大厅形式启动
 * 	区别: 
 * 		1 user_info game_world boot loading等文件会初始化内容会有不同(基本都是跳过以下地主的初始化内容)
 * 		2 加载js文件不同
 * 	原有hall.js中的文件路径统一放到config/hall_include.json管理，依次加载每个模块。与框架混淆处统一使用一个文件。
 */


// IOS模拟器热加载磁盘的JS文件，Android可以通过海马玩模拟器挂在本地磁盘
if (ty.LOCAL_JS_DEBUG && ty.LOCAL_JS_DEBUG.enabled) {
    // 依次加载每个模块
    if (!ty.LOCAL_JS_DEBUG.gymjPath) {
	    cc.log("OLD 加载majhong JavaScript本地代码调试 from guiyang.js");
		// 注意前后的顺序,注意文件名中不能有大写字母，否则在android中会有问题
	    var MJJSONFILE  = ty.LOCAL_JS_DEBUG.projPath+"/FrameWork2/tuyougame/res/games/guiyang/config/guiyang_include.json";
	    cc.log("guiyang_include.json path:"+MJJSONFILE);
	    
		var requireScripts = function()
		{
		    var arrScripts = JSON.parse(hall.GlobalFuncs.readFile('games/guiyang/config/guiyang_include.json'));
		    for(var nScript = 0, numScript = arrScripts.length; nScript < numScript; ++nScript)
		    {
		    	arrScripts[nScript] = arrScripts[nScript].replace("games/guiyang",ty.LOCAL_JS_DEBUG.projPath + "/guiyang");
		        require(arrScripts[nScript]);
		    }
		};
		requireScripts();
    }
    else
    {
    	cc.log("加载majhong JavaScript本地代码调试 from guiyang.js");
		// 注意前后的顺序,注意文件名中不能有大写字母，否则在android中会有问题
	    var MJJSONFILE  = ty.LOCAL_JS_DEBUG.gymjPath+"/config/guiyang_include.json";
	    cc.log("NEW guiyang_include.json path:"+MJJSONFILE);
	    
		var requireScripts = function()
		{
		    var arrScripts = JSON.parse(ty.FileManager.readFile(MJJSONFILE));

			cc.log("arrScripts.length : " + arrScripts.length);

			var filePath;

		    for(var nScript = 0, numScript = arrScripts.length; nScript < numScript; ++nScript)
		    {
				filePath = arrScripts[nScript];
				filePath = filePath.replace("games/guiyang", ty.LOCAL_JS_DEBUG.gymjPath);
				cc.log("load js from local : " + filePath);
		        require(filePath);
		    }
		};
		requireScripts();
    }
}
else
{
	var requireScripts = function()
	{
	    var arrScripts = JSON.parse(hall.GlobalFuncs.readFile('games/guiyang/config/guiyang_include.json'));
	    for(var nScript = 0, numScript = arrScripts.length; nScript < numScript; ++nScript)
	    {
	    	hall.LOGD(this._TAG,"arrScripts[nScript] : "+arrScripts[nScript]);
	        require(arrScripts[nScript]);
	    }
	};
	requireScripts();
}