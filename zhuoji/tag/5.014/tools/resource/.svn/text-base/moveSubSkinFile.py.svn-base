#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
#
# 3.501修改地主子皮肤图片用的脚本


__author__     = 'hanjiajun'
__version__    = '$Revision: 1.0 $'
__date__       = '$Date: 2014/12/25 $'
__copyright__  = 'Copyright (c) 2014'
__license__    = 'Python' 

import sys, os, re ,md5, shutil
import json

#移动文件夹
move_list = [
    {
        "from":"replace/hall/img_src/hall/hall/hall_head_title.png",
        "to":"replace/hall/img_src/hall_hall/hall_hall_head_title.png"
    },
    {
        "from":"replace/hall/img_src/hall/hall/hall_more_game_title.png",
        "to":"replace/hall/img_src/hall_hall/hall_more_game_title.png"
    },
    {
        "from":"replace/hall/img_src/hall/hall/thirdShowMoreGame.png",
        "to":"replace/hall/img_src/hall_hall/hall_hall_third_show_more_game.png"
    },
    {
        "from":"replace/hall/img_src/loading/loading_360_login.png",
        "to":"replace/hall/img_src/hall_loading/hall_loading_loading_360_login.png"
    },
    {
        "from":"replace/hall/img_src/loading/firstpage_logo_bg.png",
        "to":"replace/hall/img_src/hall_loading/hall_loading_firstpage_logo_bg.png"
    },
    {
        "from":"replace/hall/img_src/loading/loading_logo.png",
        "to":"replace/hall/img_src/hall_loading/hall_loading_loading_logo.png"
    },
    {
        "from":"replace/hall/img_src/loading/loading_zi.png",
        "to":"replace/hall/img_src/hall_loading/hall_loading_loading_zi.png"
    }
]

#需要删除的文件夹,支持递归
remove_list = [
    {
        "dir":"replace/hall/img_src/hall"
    },
    {
        "dir":"replace/hall/img_src/loading"
    },
]

# 入口
def main():
    if __name__ == '__main__':
        if len(sys.argv) < 2:
            print '需要:修改皮肤的 skins 路径'
            return
        elif len(sys.argv) == 2:
            excute(sys.argv[1])

# 脚本执行入口
def excute(skin_path):
    if os.path.isdir(skin_path):
         filelist = os.listdir(skin_path)
         for sub_skin in filelist:
            print "---------------"
            print sub_skin
            for data in move_list:
                print data["from"]
                print data["to"]
                fromPath = os.path.join(skin_path,sub_skin,data["from"])
                toPath = os.path.join(skin_path,sub_skin,data["to"])
                moveFile(fromPath,toPath)

            for data in remove_list:
                removePath = os.path.join(skin_path,sub_skin,data["dir"])
                if os.path.exists(removePath):
                    shutil.rmtree(removePath)

# 移动图片文件
def moveFile(from_path,to_path):
    if os.path.exists(from_path):
        if not os.path.exists(os.path.dirname(to_path)):
            os.makedirs(os.path.dirname(to_path))
        shutil.move(from_path,to_path)

main();












