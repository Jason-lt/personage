#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
# 递归扫文件夹内的ccb文件,打印出其中所有的png文件名
# 流程
#   1.收集所有大厅png文件名
#   2.扫ccb,找到所有符合大厅png文件名
#   #3.打印结果出来
#   4.将相应地大厅资源拷贝到目标文件夹
#   3.4可选

__author__     = "kink"
__version__    = "$Revision: 1.0 $"
__date__       = "$Date: 2014/10/09 $"
__copyright__  = "Copyright (c) 2014"
__license__    = "Python" 

import sys, os, re 
# import Image 

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

pngArray = []; #需要比较的png列表
pngOutputArray = []; #输出文件名数组
pngOutput = {}; #输出对象
notFind = []; #没找到的png

#遍历多个ccb文件
def searchPngFromDirs(pathes):
    for path in pathes.split(','):
        searchPngFromDir(path)

#遍历搜索ccb文件
def searchPngFromDir(path):
    print "搜索跟目录:" + path + " ..."
    # checkSameNamePng(path)
    if os.path.isfile(path):
        searchPngFromCcb(path)
    elif os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.ccb'):
                    searchPngFromCcb(os.path.join(root,file)) 

#搜索ccb文件内容
def searchPngFromCcb(rootPath):
    print "检查ccb文件:" + rootPath + " ..."
    tree = ET.ElementTree(file= rootPath)

    find = False
    for elem in tree.iter(tag='string'):
        text = elem.text
        if text != None:
            text = os.path.basename(text)
            if checkExt(text) and checkInPngArray(text):
                #去重后保存到数组和字典中
                pngOutput[text] = True
                pngOutputArray.append(text)
                find = True


#检查文件类型
def checkExt(file):
    return file.endswith('.png') or file.endswith('.jpg')

#检查文件是否在大厅项目中
def checkInPngArray(file):
    return file in pngArray

#检查在输出数组内
def checkInOutputArray(file):
    return file in pngOutputArray


#收集需要比较的png
def collectionPngArray(path):
    print "收集大厅图片列表 ..."
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                if isImg(file) :
                    pngArray.append(file)


                # if pngOutput.has_key(text):
                #     print "重名图片:" + text

#检查文件类型
def isImg(file):
    return file.endswith('.png') or file.endswith('.jpg')


#检查重名图片
def checkSameNamePng(path):
    print "同名图片检查 start"
    nameMap = {}
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                if checkExt(file):
                    if nameMap.has_key(file):
                        print "重名图片:" + file
                    nameMap[file] = True
    print "同名图片检查 done"

#打印结果
def printResult():
    print "打印搜索结果 start"
    print "用到的图片:"
    for text in pngOutput:
        print text

    print ""
    print "没用到的图片:"
    for png in pngArray:
        if not pngOutput.has_key(png):
            print png
        else:
            # print png +"~~~"
            pass
    print "打印搜索结果 done"

#复制找到的文件到目标目录
def copyOutPut(src,dest):
    if os.path.isdir(src):
        for root, dirs, files in os.walk(src):
            #原文件夹相对路径
            relPath = os.path.relpath(root,src)

            #组装目标绝对路径
            if relPath == ".":
                filePath = dest
            else:
                filePath = os.path.join(dest,relPath)

            #遍历文件夹内文件,拷贝文件
            for file in files:
                #原文件绝对路径
                cpSrc = os.path.join(root,file)
                #目标文件绝对路径
                cpDest = os.path.join(filePath,file)
                #检查文件,同时在ccb中和大厅图片文件中出现,则拷贝出来
                if os.path.isfile(cpSrc) and checkInOutputArray(file):
                    #保证文件夹存在
                    if not os.path.exists(filePath):
                        os.makedirs(filePath)
                    print "-----"
                    print cpSrc
                    print cpDest
                    open(cpDest, "wb").write(open(cpSrc, "rb").read()) 

#老入口
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print '需要带ccb根目录的路径 和 大厅图片散图路径 <和 导出目录>'
    elif len(sys.argv) == 3:
        collectionPngArray(sys.argv[2])
        searchPngFromDirs(sys.argv[1])
        printResult()
    elif len(sys.argv) == 4:
        collectionPngArray(sys.argv[2])
        searchPngFromDirs(sys.argv[1])
        # printResult()
        copyOutPut(sys.argv[2],sys.argv[3])
    else:
        collectionPngArray(sys.argv[2])
        searchPngFromDirs(sys.argv[1])
        #printResult()
        copyOutPut(sys.argv[2],sys.argv[3])

#找所有图片中没有被ccb使用的 
# def findUnusePng():
#     #搜索所有图片
#     # {fileName:"",fullPath:""}
#     pngs = []
#     #搜索所有ccb
#     # {proj:"",ccb:"",usePngs:[]}
#     ccbs = []
#     #遍历所有图片
#         #遍历所有ccb
#             #如果找到使用的,就计数
#             #否则就不计数

#     #打印所有统计结果


# #新入口,找到所有没有使用的图片
# if __name__ == '__main__':
#     if len(sys.argv) < 4:
#         print '需要所有工程的ccb路径,大厅common和hall图片路径,过滤个数'
#     elif len(sys.argv) ==4 :
#         findUnusePng()


