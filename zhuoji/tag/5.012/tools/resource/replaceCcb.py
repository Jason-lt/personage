#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
#
# 修改png图片文件后,这个脚本提供后续的ccb修改和代码内常量修改的修改
# 实现分为以下几个阶段:
#   1.(大厅3.35期间状态)只支持ccb自动修改
#   2.增加支持图片改名
#   3.增加支持代码内常量修改
#   4.增加支持图片plist内层级变化,如:other/xxx.png => xxx.png
#
#
#
#
#
#
#
#

__author__     = 'hanjiajun'
__version__    = '$Revision: 1.0 $'
__date__       = '$Date: 2014/10/13 $'
__copyright__  = 'Copyright (c) 2014'
__license__    = 'Python' 

import sys, os, re ,md5
import Image 

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

#文件列表,以老文件的MD5码作为key
#不包含单文件包含在多tps文件内的情况
#字段: old:老路径,new:新路径,oldTps:老tps,newTps:新tps,oldFileName:老filename,newFileName:新filename
pngfiles = {}

#tps文件列表
#字段: key:tps的plist文件名,fileNames[]文件引用路径,plist:plist文件名
oldTps = []
newTps = []

#输出替换列表
#字段: oldImgKey:老图片key,oldPlistKey:老plistkey,newImgKey:新图片key,newPlistKey:新plistkey,
# output = []


#比较新旧文件夹,生成比较结果
def compareImg(oldPath,newPath,tpsFolder):

    #先检索tps,从里面提取filename信息
    oldTpsPath = os.path.join(oldPath,tpsFolder)
    newTpsPath = os.path.join(newPath,tpsFolder)

    #检索旧tps
    if os.path.isdir(oldTpsPath):
        for root, dirs, files in os.walk(oldTpsPath):
            for file in files:
                if isTps(file):
                    filePath = os.path.join(root,file)
                    tps = {}
                    tps["key"] = file
                    getTpsFileNames(filePath,tps)
                    oldTps.append(tps)

    #检索新tps
    if os.path.isdir(newTpsPath):
        for root, dirs, files in os.walk(newTpsPath):
            for file in files:
                if isTps(file):
                    filePath = os.path.join(root,file)
                    tps = {}
                    tps["key"] = file
                    getTpsFileNames(filePath,tps)
                    newTps.append(tps)

    #检索旧文件
    if os.path.isdir(oldPath):
        for root, dirs, files in os.walk(oldPath):
            for file in files:
                if isImg(file):
                    filePath = os.path.join(root,file)
                    # print filePath
                    md5 = fileMd5(filePath)
                    if not pngfiles.has_key(md5):
                        pngfiles[md5] = {}
                    pngfiles[md5]["old"] = filePath
                    #从tps中找到自己所属的tps
                    for tps in oldTps:
                        for fileName in tps["fileNames"]:
                            #判断文件是否属于fileName
                            if isSubFile(filePath,fileName):
                                pngfiles[md5]["oldTps"] = tps["plist"]#引用
                                pngfiles[md5]["oldFileName"] = fileName#全路径
                                pngfiles[md5]["oldPngKey"] = os.path.relpath(filePath,fileName)#相对路径

    #检索新文件
    if os.path.isdir(newPath):
        for root, dirs, files in os.walk(newPath):
            for file in files:
                if isImg(file):
                    filePath = os.path.join(root,file)
                    # print filePath
                    md5 = fileMd5(filePath)
                    if not pngfiles.has_key(md5):
                        pngfiles[md5] = {}
                    pngfiles[md5]["new"] = filePath
                    #从tps中找到自己所属的tps
                    for tps in newTps:
                        # print "    "+tps["key"]
                        for fileName in tps["fileNames"]:
                            #判断文件是否属于fileName
                            # print "        "+fileName
                            if isSubFile(filePath,fileName):
                                pngfiles[md5]["newTps"] = tps["plist"]#引用
                                pngfiles[md5]["newFileName"] = fileName#全路径
                                pngfiles[md5]["newPngKey"] = os.path.relpath(filePath,fileName)#相对路径

    ret = []
    #遍历files找出修改过的图片,并保存到output中
    for key in pngfiles:
        f = pngfiles[key]
        if ((not f.has_key("newTps"))
            or (not f.has_key("newPngKey"))):
            if ((not f.has_key("oldTps"))
                or (not f.has_key("oldPngKey"))):
                print "一直没有被tps包含的图片" +f["new"]
            else:
                print "文件信息不全 " +str(f.has_key("newTps"))+"|"+str(f.has_key("newPngKey"))+"|"+str(f.has_key("oldTps"))+"|"+str(f.has_key("oldPngKey")) 
            pass
        elif ((not f.has_key("oldTps"))
            or (not f.has_key("oldPngKey"))):
            print "文件信息不全" +str(f.has_key("newTps"))+"|"+str(f.has_key("newPngKey"))+"|"+str(f.has_key("oldTps"))+"|"+str(f.has_key("oldPngKey"))
            pass
        else:
            if f["oldTps"] != f["newTps"] or f["oldPngKey"] != f["newPngKey"]:
                print "{0}|{1}>>{2}|{3}".format(f["oldTps"],f["oldPngKey"],f["newTps"],f["newPngKey"])
                change = {}
                change["oldPng"] = f["oldPngKey"]
                change["oldPlist"] = f["oldTps"]
                change["newPng"] = f["newPngKey"]
                change["newPlist"] = f["newTps"]
                ret.append(change)

    return ret




def isSubFile(file,root):
    relPath = os.path.relpath(file,root )
    # print "            "+relPath
    return not relPath.startswith("..")

def isImg(file):
    return file.endswith('.png') or file.endswith('.jpg')

def isTps(file):
    return file.endswith('.tps')

def isCcb(file):
    return file.endswith('.ccb')

#抽取tps文件内的图片读取路径信息
def getTpsFileNames(rootPath,tps):
    fileNames =[]
    tps["fileNames"] = fileNames
    tree = ET.ElementTree(file= rootPath)
    for elem in tree.iter(tag='filename'):
        text = elem.text
        if text != None:
            if text.endswith('.png'):
                pass
            elif text.endswith('.plist'):
                tps["plist"] = os.path.basename(text)
            elif text.endswith('.java'):
                pass
            else:
                #小图路径
                dirPath = os.path.join(os.path.dirname(rootPath),text)
                fileNames.append(dirPath)

#计算文件md5值
def fileMd5(filePath):
    ret = "ERROR"
    if os.path.isfile(filePath):
        file = open(filePath,'r')
        ret = md5.new( file.read() ).digest()
        file.close()
    else:
        print "文件路径错误:"+filePath
    return ret

#替换tps内容
#change: oldPlist,oldPng,newPlist,newPng
def changeTpsPlistAndPng(root,change):
    #遍历节点
    changed = False
    for elem in root.iter(tag='array'):
        children = elem.getchildren()
        if len(children) == 2:
            #找到children为2的节点
            #比较两个节点是否符合oldPng和oldPlist
            if ((children[0].text == change["oldPng"] and children[1].text == change["oldPlist"]) 
                or (children[1].text == change["oldPng"] and children[0].text == change["oldPlist"])):
                #如果符合,则修改节点内容
                children[0].text = change["newPlist"]
                children[1].text = change["newPng"]
                changed = True
    return changed

#这段是导出的临时数据,因为工具还不支持中间数据导入导出,先凑合用
changeData = [
["hall/img/nopack/loading.jpg","common/img/nopack/loading.jpg"],
["hall/img/nopack/panel_bg1.jpg","common/img/nopack/panel_bg1.jpg"],
["hall/img/nopack/table_bg.jpg","common/img/nopack/table_bg.jpg"],
["hall/img/nopack/activity_img_demo.png","common/img/nopack/activity_img_demo.png"],
["hall/img/nopack/line3.png","common/img/nopack/line3.png"],
["hall/img/nopack/activity_img_demo2.png","common/img/nopack/activity_img_demo2.png"],
["hall/img/nopack/alert_bg.png","common/img/nopack/alert_bg.png"],
["hall/img/nopack/loading_mengban.png","common/img/nopack/loading_mengban.png"],
["hall/img/nopack/apply_progress_bg.png","common/img/nopack/apply_progress_bg.png"],
["hall/img/nopack/mask.png","common/img/nopack/mask.png"],
["hall/img/nopack/bottom_bg.png","common/img/nopack/bottom_bg.png"],
["hall/img/nopack/orange_edit.png","common/img/nopack/orange_edit.png"],
["hall/img/nopack/buy_coins.png","common/img/nopack/buy_coins.png"],
["hall/img/nopack/buy_diamonds.png","common/img/nopack/buy_diamonds.png"],
["hall/img/nopack/panel_bg_top.png","common/img/nopack/panel_bg_top.png"],
["hall/img/nopack/chat_bg.png","common/img/nopack/chat_bg.png"],
["hall/img/nopack/popwinbg.png","common/img/nopack/popwinbg.png"],
["hall/img/nopack/chat_input_bg.png","common/img/nopack/chat_input_bg.png"],
["hall/img/nopack/results_bg.png","common/img/nopack/results_bg.png"],
["hall/img/nopack/curtain_top.png","common/img/nopack/curtain_top.png"],
["hall/img/nopack/returnmask.png","common/img/nopack/returnmask.png"],
["hall/img/nopack/everydayloginbg.png","common/img/nopack/everydayloginbg.png"],
["hall/img/nopack/t_tmp.png","common/img/nopack/t_tmp.png"],
["hall/img/nopack/fly_coin.png","common/img/nopack/fly_coin.png"],
["hall/img/nopack/line2.png","common/img/nopack/line2.png"],
["hall/img/font/changci.fnt","common/img/font/changci.fnt"],
["hall/img/font/room_reward_font.fnt","common/img/font/room_reward_font.fnt"],
["hall/img/font/everydaylogin.fnt","common/img/font/everydaylogin.fnt"],
["hall/img/font/table_black.fnt","common/img/font/table_black.fnt"],
["hall/img/font/great_master.fnt","common/img/font/great_master.fnt"],
["hall/img/font/table_middle_yellow.fnt","common/img/font/table_middle_yellow.fnt"],
["hall/img/font/online_count_num.fnt","common/img/font/online_count_num.fnt"],
["hall/img/font/table_small_blue.fnt","common/img/font/table_small_blue.fnt"],
["hall/img/font/red_big_num.fnt","common/img/font/red_big_num.fnt"],
["hall/img/font/table_small_yellow.fnt","common/img/font/table_small_yellow.fnt"],
["hall/img/font/red_middle_num.fnt","common/img/font/red_middle_num.fnt"],
["hall/img/nopack/fruit_bg.jpg","ddz/img/nopack/fruit_bg.jpg"],
["hall/img/nopack/diploma_bg.png","ddz/img/nopack/diploma_bg.png"],
["hall/img/nopack/diploma_none_bg.png","ddz/img/nopack/diploma_none_bg.png"],
["hall/img/nopack/notecard_bg.png","ddz/img/nopack/notecard_bg.png"],
["hall/img/anibomb.plist","common/img/anibomb.plist"],
["hall/img/aniduck.plist","common/img/aniduck.plist"],
["hall/img/anilightandrocket.plist","common/img/anilightandrocket.plist"],
["hall/img/aniplane.plist","common/img/aniplane.plist"],
["hall/img/aniquickbtn.plist","common/img/aniquickbtn.plist"],
["hall/img/aniquickfire.plist","common/img/aniquickfire.plist"],
["hall/img/aniquicklight.plist","common/img/aniquicklight.plist"],
["hall/img/avatartexts.plist","common/img/avatartexts.plist"],
["hall/img/btn_emo.plist","common/img/btn_emo.plist"],
["hall/img/common_first_level.plist","common/img/common_first_level.plist"],
["hall/img/common_loading.plist","common/img/common_loading.plist"],
["hall/img/common_second_level.plist","common/img/common_second_level.plist"],
["hall/img/common_table.plist","common/img/common_table.plist"],
["hall/img/emo.plist","common/img/emo.plist"],
["hall/img/itr_emo.plist","common/img/itr_emo.plist"],
["hall/img/poker_b.plist","common/img/poker_b.plist"],
["hall/img/poker_m.plist","common/img/poker_m.plist"],
["hall/img/poker_s.plist","common/img/poker_s.plist"],
["hall/img/ddz_result11.plist","ddz/img/ddz_result11.plist"],
["hall/img/dizhu_table_anim1.plist","ddz/img/dizhu_table_anim1.plist"],
["hall/img/dizhu_table_chuntian.plist","ddz/img/dizhu_table_chuntian.plist"],
["hall/img/dizhu_table_damanguan.plist","ddz/img/dizhu_table_damanguan.plist"],
["hall/img/dizhu_table_liandui.plist","ddz/img/dizhu_table_liandui.plist"],
["hall/img/fruit.plist","ddz/img/fruit.plist"],
["hall/img/fruit2.plist","ddz/img/fruit2.plist"],
["hall/img/lose.plist","ddz/img/lose.plist"],
["hall/img/match.plist","ddz/img/match.plist"],
["hall/img/result_button.plist","ddz/img/result_button.plist"],
["hall/img/room.plist","ddz/img/room.plist"],
["hall/img/table_anim1.plist","ddz/img/table_anim1.plist"],
["hall/img/table_anim2.plist","ddz/img/table_anim2.plist"],
["hall/img/tablebox.plist","ddz/img/tablebox.plist"],
["hall/img/tableoperatebtn.plist","ddz/img/tableoperatebtn.plist"],
["hall/img/tableother.plist","ddz/img/tableother.plist"],
["hall/img/tableresult.plist","ddz/img/tableresult.plist"],
["hall/img/win_head.plist","ddz/img/win_head.plist"],
["hall/img/diamond2coin.plist","hall/img/diamond2coin.plist"],
["hall/img/everydaylogin.plist","hall/img/everydaylogin.plist"],
["hall/img/exchangeitems.plist","hall/img/exchangeitems.plist"],
["hall/img/great_master.plist","hall/img/great_master.plist"],
["hall/img/hall.plist","hall/img/hall.plist"],
["hall/img/loading.plist","hall/img/loading.plist"],
["hall/img/lotteryaward.plist","hall/img/lotteryaward.plist"],
["hall/img/newplayer_reward.plist","hall/img/newplayer_reward.plist"],
["hall/img/nopack2.plist","hall/img/nopack2.plist"],
["hall/img/secondlevel.plist","hall/img/secondlevel.plist"],
]


#根据结果修改ccb内容
def replaceCcb(result,ccbPath,outputPath):
    #遍历ccb文件
    if os.path.isdir(ccbPath):
        for root, dirs, files in os.walk(ccbPath):
            for file in files:
                if isCcb(file):
                    filePath = os.path.join(root,file)
                    tree = ET.ElementTree(file= filePath)
                    changed = False
                    #替换节点
                    for change in result:
                        changed = replaceTree(tree,change) or changed  
                    if changed:
                        #输出到对应目录
                        print file+" changed!"
                        relpath = os.path.relpath(filePath,ccbPath)
                        writePath = os.path.join(outputPath,relpath)
                        writeDirPath = os.path.dirname(writePath)
                        if not os.path.exists(writeDirPath):
                            os.makedirs(writeDirPath)
                        tree.write(writePath, encoding="utf-8",xml_declaration=True)


#替换tps内容
#change: oldPlist,oldPng,newPlist,newPng
def replaceTree(root,change):
    #遍历节点
    changed = False
    for elem in root.iter(tag='string'):
        if elem.text == change[0]:
            elem.text = change[1]
            changed = True
    return changed




if __name__ == '__main__':
    if len(sys.argv) < 3:
        print '需要:工程ccb路径(如ccbproj),ccb输出路径(变化的ccb会新建一个到这里,确认后手动覆盖回去)'
    elif len(sys.argv) >= 3:
        replaceCcb(changeData,sys.argv[1],sys.argv[2])

    # if len(sys.argv) < 5:
    #     print '需要:图片修改前路径(如img_src),图片修改后路径(如img_src_new),工程ccb路径(如ccbproj),ccb输出路径'
    # elif len(sys.argv) == 5:
    #     result = compareImg(sys.argv[1],sys.argv[2],"tps")
    #     # modifyCcb(result,sys.argv[3],sys.argv[4])
    # else:
    #     result = compareImg(sys.argv[1],sys.argv[2],"tps")
    #     modifyCcb(result,sys.argv[3],sys.argv[4])


