/*****************************************
 *  mahjong_reload_script.js
    麻将 JS环境 热加载
 *  mahjong
 *  热加载
 *  Created by nick.kai.lee on 15-12-28
 *  特殊说明：

    使用说明:
 */
(function(){
    var GLOBAL_OBJ = guiyang;
    
	var RS_MAHJONG = function() {
		// 注意前后的顺序,注意文件名中不能有大写字母，否则在android中会有问题
        //ADDNEW
	    var MJJSONFILE  = ty.LOCAL_JS_DEBUG.gymjPath+"/config/" + GLOBAL_OBJ.GAMENAME + "_include.json";//ADDNEW
	    cc.log("热加载majhong JavaScript本地代码调试:"+MJJSONFILE);
	    var arrScripts  = JSON.parse(ty.FileManager.readFile(MJJSONFILE));

        var depScripts  = [
        ];

        //附加的热加载脚本（PS：不是每个MJ的脚本我呢见）
        for(var i in depScripts){
            depScripts[i] = depScripts[i].replace('games/' + GLOBAL_OBJ.GAMENAME,ty.LOCAL_JS_DEBUG.gymjPath);//ADDNEW
            cc.sys.cleanScript(depScripts[i]);
            require(depScripts[i]);
        }

        //热更新 BB框架里的代码
	    for(var nScript = 0, numScript = arrScripts.length; nScript < numScript; ++nScript){
            if (arrScripts[nScript].indexOf("script/bkernel")>0||arrScripts[nScript].indexOf("script/businesses")>0||arrScripts[nScript].indexOf("script/table")>0) {
                arrScripts[nScript] = arrScripts[nScript].replace('games/' + GLOBAL_OBJ.GAMENAME ,ty.LOCAL_JS_DEBUG.gymjPath);//ADDNEW
                cc.sys.cleanScript(arrScripts[nScript]);
                require(arrScripts[nScript]);                
            }
	    }
	};
	var RS_MAHJONG11 = function() {
		var MJJSONFILE  = ty.LOCAL_JS_DEBUG.gymjPath+"/config/" + GLOBAL_OBJ.GAMENAME + "_include.json"; //ADDNEW
	    cc.log("热加载majhong JavaScript本地代码调试:"+MJJSONFILE);
	    // var arrScripts = JSON.parse(ty.FileManager.readFile(MJJSONFILE));
	    var arrScripts = [
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/mjc_table_scene.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/mjc_table_result.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/env/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/env/mahjong_kernel_world.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/utils/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/utils/mahjong_notification.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/utils/mahjong_global_timer.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/utils/mahjong_reload_script.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/extend/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/extend/mahjong_extend_button.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/extend/mahjong_extend_node.js",
    
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/base/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/base/mahjong_base_controller.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/base/mahjong_base_window_controller.js",
    
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/network/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/network/mahjong_events.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/network/mahjong_c2s.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/network/mahjong_s2c.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/windows/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/bkernel/windows/mahjong_window_factory.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/mahjong_resource.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/mahjong_global.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/mahjong_events.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/mahjong_functions.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/mahjong_game_world.js",
    
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/network/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/network/mahjong_events.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/network/mahjong_c2s.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/network/mahjong_s2c.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/utils/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/utils/mahjong_tail_node.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/mahjong_window_consts.js",    
    
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_c2s_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_events_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_god_raffle_static.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_god_raffle_model.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_god_raffle_slot.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_god_raffle_tail.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_god_raffle_entry.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/god_raffle/mahjong_god_raffle_window.js",
        
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/mahjong_c2s_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/mahjong_events_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/mahjong_lucky_wheel_static.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/mahjong_lucky_wheel_model.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/mahjong_lucky_wheel_tail.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/mahjong_lucky_wheel_slot.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/lucky_wheel/mahjong_lucky_wheel_window.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_to_vip_table/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_to_vip_table/mahjong_invite_to_vip_table_static.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_to_vip_table/mahjong_invite_to_vip_table_window.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_list/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_list/mahjong_c2s_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_list/mahjong_events_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_list/mahjong_invite_list_static.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_list/mahjong_invite_list_window.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/invite_list/mahjong_invite_list_cell.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/red_packets/init.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/red_packets/mahjong_c2s_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/red_packets/mahjong_events_ex.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/red_packets/mahjong_red_packets_model.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/red_packets/mahjong_red_packets_static.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/windows/red_packets/mahjong_red_packets_window.js",

    'games/' + GLOBAL_OBJ.GAMENAME + "/script/businesses/boot.js",
    'games/' + GLOBAL_OBJ.GAMENAME + "/script/boot.js"
	    ];
	    for(var nScript = 0, numScript = arrScripts.length; nScript < numScript; ++nScript)
	    {
	    	arrScripts[nScript] = arrScripts[nScript].replace('games/' + GLOBAL_OBJ.GAMENAME, ty.LOCAL_JS_DEBUG.gymjPath); //ADDNEW
	    	cc.sys.cleanScript(arrScripts[nScript]);
	        require(arrScripts[nScript]);
	    }

        GLOBAL_OBJ.businesses.shut();
        GLOBAL_OBJ.businesses.boot();
	};
	GLOBAL_OBJ.bkernel.utils.ReloadScript = {
		extend:function(_parent){
			// debug状态下才可以显示热加载按钮
	        // 看看是否需要支持JS 本地代码调试 by likai
	        if (ty.SystemInfo.getConfig().debug&&ty.LOCAL_JS_DEBUG&&ty.LOCAL_JS_DEBUG.enabled) {
	    //         var winSize  = cc.Director.getInstance().getWinSize();
	    //         cc.MenuItemFont.setFontSize(65);
	    //         var decrease = new cc.MenuItemFont("热加载", function(){
					// RS_MAHJONG();
	    //         }, this);
	    //         decrease.color = cc.color(0, 200, 200);

	    //         var menu = new cc.Menu(decrease);
	    //         menu.alignItemsHorizontally();
	    //         menu.setAnchorPoint(cc.p(0,0.5))
	    //         menu.x = winSize.width*0.1;
	    //         menu.y = winSize.height*0.5;
	    //         _parent.addChild(menu, 99999999);
                GLOBAL_OBJ.businesses.shut();
                RS_MAHJONG();

                GLOBAL_OBJ.LOGD("重启麻将环境\n")
                GLOBAL_OBJ.businesses.boot();
	       };
		}
	};
})();