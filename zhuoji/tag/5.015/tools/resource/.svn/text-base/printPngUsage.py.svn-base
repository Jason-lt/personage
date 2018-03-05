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
import codecs

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

pngArray = []; #需要比较的png列表
pngOutputArray = []; #输出文件名数组
pngOutput = {}; #输出对象


#遍历多个ccb文件
def searchPngFromDirs(pathes,png):
    array = []
    for path in pathes.split(','):
        searchPngFromDir(path,png,array)
    return array

#遍历搜索ccb文件
def searchPngFromDir(path,png,array):
    # print "搜索跟目录:" + path + " ..."
    if os.path.isfile(path):
        if searchPngFromCcb(path,png):
            array.append(os.path.basename(path))
    elif os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.ccb'):
                    if searchPngFromCcb(os.path.join(root,file),png):
                        array.append(os.path.basename(os.path.join(root,file)))

#搜索ccb文件内容
def searchPngFromCcb(rootPath,png):
    # print "检查ccb文件:" + rootPath + " ..."
    tree = ET.ElementTree(file= rootPath)

    for elem in tree.iter(tag='string'):
        text = elem.text
        if text != None:
            text = os.path.basename(text)
            if text == png:
                return True
    return False


#检查文件类型
def isImg(file):
    return file.endswith('.png') or file.endswith('.jpg')

#检查文件是否在大厅项目中
def checkInPngArray(file):
    return file in pngArray

#检查在输出数组内
def checkInOutputArray(file):
    return file in pngOutputArray
 
#打印结果
def printResult():
    print "打印搜索结果 start"
    for text in pngOutput:
        print text
    print "打印搜索结果 done"

def searchAllImg(imgPath,ccbPath,outputFile):

    writeFile= open ( outputFile, 'wb' )  
    writeFile.write(codecs.BOM_UTF8)
    writeFile.write("图片,名称,类型,位置,ccb,使用场景(游戏/场景),描述,样式ID,主题ID,是否允许三方配置引用\n")



    format = "{0}|{1},{2}\n"


    if os.path.isdir(imgPath):
        for root, dirs, files in os.walk(imgPath):
            for file in files:
                if isImg(file):
                    print file
                    print imgPath
                    relPath = os.path.relpath(root,imgPath)
                    print relPath
                    ext = os.path.splitext(file)[1]
                    array = searchPngFromDirs(ccbPath,file)
 


                    for ccb in array:
                        # split = ccb.split("_")
                        # print "split"+ split[0]
                        # print "split"+ split[1] 
                        modify = "是"

                        print file
                        print relPath
                        print ccb

                        writeFile.write(format.format(file,relPath,ccb))


    writeFile.close()
    
def output(str):
    print str


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print '需要带ccb根目录的路径 和 大厅图片散图路径 和 导出文件'
    elif len(sys.argv) == 3:
        searchAllImg(sys.argv[2],sys.argv[1],sys.argv[3])
        # printResult()
    elif len(sys.argv) == 4:
        searchAllImg(sys.argv[2],sys.argv[1],sys.argv[3])
        # printResult()
        # copyOutPut(sys.argv[2],sys.argv[3])
    else:
        searchAllImg(sys.argv[2],sys.argv[1],sys.argv[3])
        #printResult()
        # copyOutPut(sys.argv[2],sys.argv[3])



