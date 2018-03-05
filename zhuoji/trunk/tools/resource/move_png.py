#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
#
# 记录再生成文件位置变动脚本


__author__     = 'hanjiajun'
__version__    = '$Revision: 1.0 $'
__date__       = '$Date: 2014/12/25 $'
__copyright__  = 'Copyright (c) 2014'
__license__    = 'Python' 

import sys, os, re ,md5, shutil
import json

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

# 入口
def main():
    if __name__ == '__main__':
        if len(sys.argv) < 3:
            print '需要:修改内容文件路径,资源路径[,修改路径(如果没有则与资源路径相同)]'
            return
        elif len(sys.argv) == 3:
            excute(sys.argv[1],sys.argv[2],sys.argv[2])
        elif len(sys.argv) >= 3:
            excute(sys.argv[1],sys.argv[2],sys.argv[3])

# 脚本执行入口
def excute(move_file_path,res_path,modify_path):
    info = {}
    loadMoveFile(move_file_path,info)
    loadTpsFiles(res_path,info)
    moveImgFile(modify_path,info)
    removeImgFile(modify_path,info)
    modifyCcb(modify_path,info)
    # print info


# 将移动描述文件内容
def loadMoveFile(move_file_path,info):
    info["moveImg"] = readJson(move_file_path)["moveImg"]

# 读取tps信息
def loadTpsFiles(res_path,info):
    info["tpsArray"] = [];
    info["tpsMap"] = {};
    # 遍历文件夹
    if os.path.isdir(res_path):
        for root, dirs, files in os.walk(res_path):
            for file in files:
                # 判断tps类型
                if isTps(file):
                    tps = {}
                    # 找到资源路径 fileNames
                    # 读取plist名 plist
                    getTpsFileNames(os.path.join(root,file),tps)
                    # 保存路径和plist信息
                    info["tpsArray"].append(tps)
                    info["tpsMap"][tps["plist"]] = tps["fileNames"] # 使用plist作为key,fileNames数组作为键

# 移动图片文件
def moveImgFile(modify_path,info):
    # 遍历修改信息
    for index in range(0,len(info["moveImg"])):
        moveInfo = info["moveImg"][index] # 提取单个编辑信息
        print info["tpsMap"]
        if info["tpsMap"].has_key(os.path.basename(moveInfo["fromPlist"])) and info["tpsMap"].has_key(os.path.basename(moveInfo["toPlist"])):
            # 如果能找到对应的plist,则做移动
            for fileNameIndex in range(0,len(info["tpsMap"][os.path.basename(moveInfo["fromPlist"])])):
                #遍历每个资源路径
                fileName = info["tpsMap"][os.path.basename(moveInfo["fromPlist"])][fileNameIndex]
                fileAbsolutPath = os.path.join(fileName,moveInfo["fromImg"]);
                newfileAbsolutPath = os.path.join(info["tpsMap"][os.path.basename(moveInfo["toPlist"])][0],moveInfo["toImg"]);
                # 判断文件是否存在
                # print "fileAbsolutPath:"+fileAbsolutPath
                # print "newfileAbsolutPath:"+newfileAbsolutPath
                if os.path.exists(fileAbsolutPath):
                    # 如果文件存在,则移动文件
                    # print "move:" + fileAbsolutPath + " >> " + newfileAbsolutPath
                    shutil.move(fileAbsolutPath,newfileAbsolutPath)

# 删除图片文件
def removeImgFile(modify_path,info):
    #TODO 
    pass
    
# 修改ccb文件
def modifyCcb(modify_path,info):
    if os.path.isdir(modify_path):
        for root, dirs, files in os.walk(modify_path):
            # 遍历修改信息
            for file in files:
                if isCcb(file):
                    filePath = os.path.join(root,file)
                    tree = ET.ElementTree(file= filePath)
                    changed = False
                    #替换节点
                    for changeIndex in range(0,len(info["moveImg"])):
                        changed = changeTpsPlistAndPng(tree,info["moveImg"][changeIndex]) or changed  
                    if changed:
                        print filePath+" changed!"
                        # 保存tps文件
                        tree.write(filePath, encoding="utf-8",xml_declaration=True)

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
            if ((children[0].text == change["fromImg"] and children[1].text == change["fromPlist"]) 
                or (children[1].text == change["fromImg"] and children[0].text == change["fromPlist"])):
                #如果符合,则修改节点内容
                children[0].text = change["toPlist"]
                children[1].text = change["toImg"]
                changed = True
    return changed



#TODO 忽略small_tps





# ---------tool func start------------

def isSubFile(file,root):
    relPath = os.path.relpath(file,root )
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
                dirPath = os.path.join(os.path.dirname(rootPath),text)
                fileNames.append(dirPath)

# 读取json文件到一个python对象中
def readJson(file_path):
    file = open(file_path,'r')
    json_info = json.loads(file.read())
    file.close()
    return json_info

# 将一个对象写入json
def writeJson(file_path,data):
    file = open(file_path,'w')
    outStr = json.dumps(data, ensure_ascii = False)    #处理完之后重新转为Json格式，并在行尾加上一个逗号  
    file.write(outStr.strip().encode('utf-8') + '\n')  
    file.close()

# ---------tool func end------------

# 药药药,切克闹
main();












