# -*- coding: utf-8 -*-  
#使用方法: python ccb-单图转大图处理.py /Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/tools /Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/test/img_src /Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/games
#用pip 安装 pillow 才可以用PIL
import PIL.Image  
import glob, os, sys  
import PIL.ImageFilter  

import types
try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree  as ET


def system_cmd(_cmd):
    print _cmd
    os.system(_cmd);

def compress_images(_cur,_path):
    for files in glob.glob(_path+'/*.png'):
        filepath,filename = os.path.split(files)  
        filterame,exts = os.path.splitext(filename)
        f = filepath+"/"+filename
        if exts == ".png":
            print "开始压缩:"+f
            # os.system("pngquant -f --ext .png --quality 0-0 "+f);
            os.system(_cur+"/pngquant -f --ext .png "+f)
            os.system(_cur+"/pngout "+f)
#图片压缩开始
def compress():
    cur   = sys.argv[1]#当前脚本的目录
    src   = sys.argv[2]
    dst   = sys.argv[3]
    #图片压缩开始(scale_sprite不压缩)
    print "\n图片压缩开始\n"
    compress_images(cur,dst+"/img")
    compress_images(cur,dst+"/img/nopack")
    compress_images(cur,dst+"/img/font")
    print "\n图片压缩结束\n"

#大图发布
def texturepacker():
    cur   = sys.argv[1]#当前脚本的目录
    src   = sys.argv[2]
    dst   = sys.argv[3]
    print "\n发布Texturepacker大图开始\n"
    for files in glob.glob(src+'/tps/*.tps'):  
        filepath,filename = os.path.split(files)  
        filterame,exts = os.path.splitext(filename)

        tpcmd = "TexturePacker "+filepath+"/"+filename+" --force-publish"
        print "\n"+tpcmd
        os.system(tpcmd)

    print "\n发布Texturepacker大图完毕\n"


#资源拷贝开始
def resource_copy():
    cur   = sys.argv[1]#当前脚本的目录
    src   = sys.argv[2]
    dst   = sys.argv[3]
    print "\n资源拷贝开始\n"
    cmd   = ""
    #创建目录
    system_cmd("rm -r "+dst+"/img");
    system_cmd("rm -r "+dst+"/ccb");
    system_cmd("rm -r "+dst+"/ccbi");
    # system_cmd("mkdir "+dst);
    system_cmd("mkdir "+dst+"/img");
    system_cmd("mkdir "+dst+"/ccb");
    system_cmd("mkdir "+dst+"/ccbi");

    #拷贝nopack，font，scale_sprite
    system_cmd("cp -r "+src+"/nopack"+" "+dst+"/img/nopack");
    system_cmd("cp -r "+src+"/font"+" "+dst+"/img/font");
    system_cmd("cp -r "+src+"/html"+" "+dst+"/img/html");
    system_cmd("cp -r "+src+"/particle"+" "+dst+"/img/particle");
    system_cmd("cp -r "+src+"/sound"+" "+dst+"/img/sound");
    # system_cmd("cp -r "+src+"/../ccb"+" "+dst+"/ccb");
    print "\n资源拷贝结束\n"

IMAGES = {} #所有tps图片所在的大图
NOPACK = {} #所有nopack图片
def scan_img_dir(_path,_dic,_value):
    cur   = sys.argv[1]#当前脚本的目录
    src   = sys.argv[2]
    dst   = sys.argv[3]
    print "\n扫描文件夹:"+_path
    for files in glob.glob(_path+"/*.*"):  
        filepath,filename = os.path.split(files)  
        filterame,exts = os.path.splitext(filename)
        if exts == ".png" or exts == ".jpg" or exts == ".jpeg":
            print filename,_value+"/"+filename
            _dic[filename] = _value+"/"+filename

def scan_plist_dir(_path):
    cur   = sys.argv[1]#当前脚本的目录
    src   = sys.argv[2]
    dst   = sys.argv[3]
    m     = []
    print "\n扫描文件夹:"+_path
    for files in glob.glob(_path+"/*.plist"):  
        filepath,filename = os.path.split(files)  
        filterame,exts = os.path.splitext(filename)
        print filename
        m.append(filename);
    return m

def parse_plist( _src_path, _plistfilename ):
    tree = ET.ElementTree(file=_src_path)
    print "\n解析PLIST文件:"+_src_path
    #tps plist文件里所有的图片
    m = []
    for elem in tree.iter(tag='dict'):
        for sub in elem:
            if sub.text and (sub.text.find('.png') >= 0 or sub.text.find('.jpg') >=0 or sub.text.find('.jpeg') >=0):
                print sub.text,_plistfilename
                IMAGES[sub.text] = _plistfilename

def __transfer( _src_path, _dst_path ):
    tree = ET.ElementTree(file=_src_path)
    for elem in tree.iter(tag='array'):
        if len(elem)>1 :
            if not isinstance(elem[1].text,types.NoneType) and (elem[1].text.find('.png') >= 0 or elem[1].text.find('.jpg') >=0):
                if NOPACK.has_key(elem[1].text):
                    elem[1].text =  NOPACK[elem[1].text]
                elif IMAGES.has_key(elem[1].text):
                    elem[0].text =  IMAGES[elem[1].text]                
                
    #particle 粒子效果
    for elem in tree.iter(tag='dict'):
        #数组第一项必须是空值,第2项目则是png,jpg,ccb等资源
        #普通资源
        for sub in elem:
            # print sub.text
            if sub.text and (sub.text.find('.png') > 0 or sub.text.find('.jpg') >0):
                if NOPACK.has_key(sub.text):
                    sub.text =  NOPACK[sub.text]
    #处理后的ccb转存                
    tree.write(_dst_path)

    name = os.path.split(_dst_path)
    name = name[len(name)-1]
    name = sys.argv[3]+"/ccbi/"+name+"i"
    # name = name[1:]
    # d    = _dst_path[1:]
    system_cmd(sys.argv[1]+"/ccbpublish -e ccbi -o "+name+" -v "+_dst_path)#-e 输出文件的后缀 -o 输出文件 -v 输入文件

#文件夹遍历
def check_path(_src,_dst):
    for root, dirs, files in os.walk(_src):
        print("\n$$$$$   开始扫描 {name} 文件夹".format(name=root))
        if len(dirs)>0:
            for dir in dirs:
                if (os.path.isdir(_dst+"/"+dir)==False):
                    os.mkdir(_dst+"/"+dir)
                check_path(root+"/"+dir,_dst)
        elif len(files)>0:
            for file in files:
                if file.find('.ccb') >= 0:
                    doc = os.path.split(root)
                    doc = doc[len(doc)-1]
                    print "ccb处理："+root+"/"+file,_dst+"/"+doc+"/"+file
                    __transfer(root+"/"+file,_dst+"/"+doc+"/"+file)

def images2Tps():
    cur   = sys.argv[1]#当前脚本的目录
    src   = sys.argv[2]#"/Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/test/img_src"
    dst   = sys.argv[3]#"/Users/likai/Documents/tuyoo_global/mahjong/trunk/skins/test/games"  

    map   = {}
    plist  = dst+"/img"
    map[plist]  = []
    
    #第一阶段
    #资源拷贝开始
    resource_copy()

    # #大图发布
    texturepacker()

    #图片压缩开始
    compress()

    #第二阶段
    # 大图工程生成
    # 扫描nopack目录
    scan_img_dir(dst+"/img/nopack",NOPACK,"nopack")
    map[plist] = scan_plist_dir(dst+"/img")

    #解析所有图片所在的大图
    for f in map[plist]:
        parse_plist(plist+"/"+f,f)
    
    #转移ccb
    check_path(src+"/../ccb",dst+"/ccb")


if __name__=='__main__':  
    images2Tps()
    print u'ccb TPS 单图转大图处理完毕'