from os import listdir
import os
import json
from os.path import isfile, join
import re
import shutil

from PIL import Image

temp_save = 'temp\\'
new_path = 'static\\Images\\'
json_path = 'static\\JavaScript\\'
if os.path.exists(temp_save):
    shutil.rmtree(temp_save)
os.mkdir(temp_save)

try:
    with open('credentials.json', 'r') as file:
        data = json.load(file)
        mypath = data['upload_path']
except Exception as e:
    print('Could not find "upload_path" in "credentials.json"')
    raise e

allFiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

imgFiles = []

# print(allFiles)



for oneFile in allFiles:
    length = len(oneFile)
    print(length)
    print(oneFile[(length-3):(length)])
    # if(oneFile[(length-3):(length)] == "JPG"):
    if oneFile.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
       imgFiles.append(oneFile)

print(imgFiles)
for imgFile in imgFiles:
    im = Image.open(mypath + "/" + imgFile);

    newWidth = 700;
    width = im.size[0];
    height = im.size[1];

    wpercent = (newWidth/float(width))
    newHeight = int(float(height)*float(wpercent));

    im = im.resize((newWidth,newHeight), Image.LANCZOS);
    #im.show();
    im.save(temp_save + imgFile);
    

if len(os.listdir(temp_save)) > 10:
    print(os.listdir(temp_save))
    
    if os.path.exists(new_path):
        shutil.rmtree(new_path)
    os.mkdir(new_path)
    for item in os.listdir(temp_save):
        src_path = os.path.join(temp_save, item)
        dest_path = os.path.join(new_path, item)
        shutil.move(src_path, dest_path)
    # shutil.move(temp_save, new_path)

    shutil.copyfile(mypath + '\\WebsiteVehicles.csv', json_path + '\\WebsiteVehicles.csv')