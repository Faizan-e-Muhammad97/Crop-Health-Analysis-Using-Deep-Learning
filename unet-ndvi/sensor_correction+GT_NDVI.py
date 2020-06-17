import os
import cv2
import numpy as np
from matplotlib import pyplot as plt
from tifffile import imsave
from tifffile import imread

# RGB images
r_folder = "r_imgs"
r_list = os.listdir("r_imgs")
r_list.sort()

# NIR images
n_folder = "n_imgs"
n_list = os.listdir("n_imgs")
n_list.sort()

# Output folder
input_folder = "inputs"
if not os.path.exists(input_folder):
    os.makedirs(input_folder)
ndvi_folder = "ndvi"
if not os.path.exists(ndvi_folder):
    os.makedirs(ndvi_folder)

def img_splitter(folder_str, name_str, img, step, ext_str):
    height = img.shape[0]
    width = img.shape[1]
    
    for x in range(0, height, step):
        for y in range(0, width, step):
            if(x+step > height):
                continue
            if(y+step > width):
                continue
            name = f"{name_str}_{x}_{y}.{ext_str}"
            if(ext_str == "tiff"):
                imsave(os.path.join(folder_str, name), img[x:x+step, y:y+step])
            else:
                cv2.imwrite(os.path.join(folder_str, name), img[x:x+step, y:y+step])


def ndvi_calculation(n_img, r_img):
    
    # Get req channels
    RED = r_img[:,:,2]
    NIR = n_img
    
    # Allow division by zero    
    np.seterr(divide='ignore', invalid='ignore')
    
    # Calculate ndvi
    ndvi = (NIR.astype(float) - RED.astype(float)) / (NIR.astype(float) + RED.astype(float))
    
    # handle cases for inf or nan
    ndvi[ndvi == np.inf] = 0
    ndvi = np.nan_to_num(ndvi)
    
#     width = ndvi.shape[0]
#     height = ndvi.shape[1]

    return ndvi

def one_hot_encoding(ndvi_img):

    width, height = ndvi_img.shape
    
    # Classes to divide in 2
    # Classes:
    # Healthy : [1] - [0]
    # Unhealthy : [0] - [-1]
    one_hot = np.zeros((width, height))

    for i in range(width):
        for j in range(height):
            if(ndvi_img[i][j] > 0):
                one_hot[i][j] = 1
            else:
                one_hot[i][j] = 0
                
    one_hot.reshape(width,height,1)
    
    return one_hot

for i in range(len(r_list)):
    print("Processing Image.No. " + str(i))
    r_img = cv2.imread(os.path.join(r_folder,r_list[i]))
    n_img = cv2.imread(os.path.join(n_folder,n_list[i]), 0)
    
    ndvi_img = ndvi_calculation(n_img, r_img)
    
    one_hot_img = one_hot_encoding(ndvi_img)
    
    step = 512
    
    img_splitter(ndvi_folder, f"NDVI{i}", one_hot_img, step, "tiff")
    img_splitter(input_folder, f"IMG{i}", r_img, step, "jpg")
    
    if (i == 10):
        break;