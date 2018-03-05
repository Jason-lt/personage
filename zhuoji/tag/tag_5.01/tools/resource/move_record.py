#! /usr/bin/python   
# -*- coding: UTF-8 -*-  
#
# 移动资源脚本工具


__author__     = 'hanjiajun'
__version__    = '$Revision: 1.0 $'
__date__       = '$Date: 2014/12/25 $'
__copyright__  = 'Copyright (c) 2014'
__license__    = 'Python' 

import sys, os, re ,md5, shutil
import json

# 错误:UnicodeDecodeError: 'ascii' codec can't decode byte 0xc2 in position 22750: ordinal not in range(128)
# 删除 more_game_new.png文件名前面的奇怪空格

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

# 入口 支持两种模式,记录(record)和比较(compare)
def main():
    if __name__ == '__main__':
        if len(sys.argv) < 4:
            print '需要:模式名<record|compare>,资源路径,记录文件路径[,输出路径(只在compare模式需要)]'
            return
        elif len(sys.argv) == 4:
            excute(sys.argv[1],sys.argv[2],sys.argv[3],None)
        elif len(sys.argv) == 5:
            excute(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4])

# 脚本执行入口
def excute(mode,res_path,recard_file_path,output_file_path):
    if mode == "record":
        #定义状态数据
        state = {}
        #读取状态数据
        getState(res_path,state)
        # print state
        #保存状态数据
        writeJson(recard_file_path,state)
    elif mode == "compare":

        newState = {}
        oldState = readJson(recard_file_path) #获取老状态
        getState(res_path,newState) #获取新状态
        diffent = {}
        compareState(newState,oldState,diffent) #比较状态
        outputDiff(output_file_path,diffent) #输出差别

# 获取资源状态
def getState(path,state_info):
    state_info["imgs"] = {}
    state_info["tpsArray"] = [];
    state_info["tpsMap"] = {};

    # 遍历目录内文件
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            # 遍历修改信息
            for file in files:
                filePath = os.path.join(root,file)
                if isImg(file): 
                    # 判断为图片
                    md5 = fileMd5(filePath)
                    if not state_info["imgs"].has_key(md5):
                        state_info["imgs"][md5] = []
                    # 保存绝对路径和md5值
                    # 数组形式是为了处理重复文件情况
                    state_info["imgs"][md5].append(filePath)#
                elif isTps(file):
                    # 判断为tps
                    tps = {}
                    # 找到资源路径 fileNames
                    # 读取plist名 plist
                    getTpsFileNames(os.path.join(root,file),tps)
                    # 保存路径和plist信息
                    state_info["tpsArray"].append(tps)
                    state_info["tpsMap"][tps["plist"]] = tps["fileNames"]# 使用plist作为key,fileNames数组作为键

#比较资源状态,保存到diffent中
#!!!可能会修改newState和oldState中的数据
def compareState(newState,oldState,diffent):
    diffent['removeImg'] = []
    diffent['moveImgPair'] = []
    diffent['oldTps'] = oldState['tpsArray']
    diffent['newTps'] = newState['tpsArray']

    newImg = newState['imgs']
    oldImg = oldState['imgs']
    # 遍历老图片
    for key in oldImg:
        # print key
        
        oldValue = oldImg[key]
        # print value 
        if not newImg.has_key(key):
            # 添加删除资源
            diffent['removeImg'].append(oldValue)
        else:
            newValue = newImg[key]
            if not compareArray(newValue,oldValue):
                # 添加不同的资源记录
                diffent['moveImgPair'].append({
                    'old':oldValue,
                    'new':newValue
                    })
                # print "diff"


#输出不同(即修改文件)
def outputDiff(output_file_path,diffent):
    # print diffent
    output = {
        'moveImg':[],
        'removeImg':[]
    }

    #TODO 格式化替换
    for file_pair in diffent['moveImgPair']:
        oldFileNames = file_pair['old']
        newFileNames = file_pair['new']
        for i in range(0,len(oldFileNames)):
            oldPlistInfo = pathToPlist(oldFileNames[i],diffent["oldTps"])
            newPlistInfo = pathToPlist(newFileNames[min(i,len(newFileNames)-1)],diffent["newTps"])
            if oldPlistInfo != None and newPlistInfo != None:
                output['moveImg'].append({
                    'fromPlist': oldPlistInfo['plist'],
                    'fromImg': oldPlistInfo['img'],
                    'toPlist': newPlistInfo['plist'],
                    'toImg': newPlistInfo['img']
                })


    # 格式化删除
    for file_path in diffent['removeImg']:
        for file_path_item in file_path:
            oldPlistInfo = pathToPlist(file_path_item,diffent["oldTps"])
            if oldPlistInfo != None :
                output['removeImg'].append({
                    'plist': oldPlistInfo['plist'],
                    'img': oldPlistInfo['img']
                })
    # 保存文件
    writeJson(output_file_path,output)



#比较两个数组,把不同的元素留下,返回是否相同
def compareArray(array1,array2):
    # if len(array1) != len(array2):
    #     return False
    match1 = [0 for x in range(0, len(array1))]
    match2 = [0 for x in range(0, len(array2))]
    for index1 in range(0,len(array1)):
        for index2 in range(0,len(array2)):
            if array1[index1] == array2[index2]:
                match1[index1] = 1
                match2[index2] = 1

    noMatch1 = []
    noMatch2 = []
    for index in range(0,len(match1)):
        if match1[index] == 0:
            noMatch1.append(array1[index])

    for index in range(0,len(match2)):
        if match2[index] == 0:
            noMatch2.append(array2[index])

    if len(noMatch1) == 0 and len(noMatch1) == 0:
        return True

    return False

#通过文件路径,和tps信息,生成plist相对路径信息
def pathToPlist(file_path,tpsInfo):
    # print  '----------'
    # print  file_path
    # print  tpsInfo
    for tps in tpsInfo:
        for res_path in tps["fileNames"]:
            if isSubFile(file_path,res_path):
                # print "----"
                # print file_path
                # print res_path
                # print tps["plist"]
                # print os.path.relpath(file_path,res_path)
                return {
                    "plist" : tps["plist"],
                    "img" : os.path.relpath(file_path,res_path)
                }
                # 以上两个作为输出路径,plist的上两级目录需要保留??
    return None


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
    pathSplit = rootPath.split('/')
    projName = pathSplit[len(pathSplit)-4] # 取项目名没啥好办法,直接解析路径了 如 xxx/common/img_src/tps/xxx.tps的项目名位 common
    tree = ET.ElementTree(file= rootPath)
    for elem in tree.iter(tag='filename'):
        text = elem.text
        if text != None:
            if text.endswith('.png'):
                pass
            elif text.endswith('.plist'):
                tps["plist"] = projName + '/img/' + os.path.basename(text)
                # split = text.split('/')
                # print '[]=='+text
                # print split
                # plist = split[len(split)-3]+'/'+split[len(split)-2]+'/'+split[len(split)-1]
                # print plist 
                # tps["plist"] = plist
            elif text.endswith('.java'):
                pass
            else:
                dirPath = os.path.join(os.path.dirname(rootPath),text)
                fileNames.append(dirPath)

    # print tps

# 读取json文件到一个python对象中
def readJson(file_path):
    file = open(file_path,'r')
    json_info = json.loads(file.read())
    file.close()
    return json_info

# 将一个对象写入json
def writeJson(file_path,data):
    #outStr = json.dumps(data,file_path ,'w')

    file = open(file_path,'w')
    outStr = json.dumps(data,sort_keys=True,indent=4)    #处理完之后重新转为Json格式  
    print outStr
    file.write(outStr.strip() + '\n')  
    file.close()

# 计算文件md5值
def fileMd5(filePath):
    ret = "ERROR"
    if os.path.isfile(filePath):
        file = open(filePath,'r')
        ret = md5.new( file.read() ).hexdigest()
        file.close()
    else:
        print "文件路径错误:"+filePath
    return ret

# ---------tool func end------------

# 药药药,切克闹
main();


