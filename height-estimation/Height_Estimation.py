#!/usr/bin/env python
# coding: utf-8

import open3d as o3d
import numpy as np
import scipy as sp
from scipy import spatial
from matplotlib import pyplot as plt
import pptk
import os
import subprocess


# ## Converting Video into Frames & Constructing a Point Cloud

# ### Extracting Frames


video_file = os.popen('ls video').read()
video_file = video_file.splitlines()

for video in video_file:
    print(str(video_file.index(video)) + ':', video)

video_num = int(input('Please enter video number:'))
video_path = 'video/' + video_file[video_num].replace(' ', '\ ')
video_out_path = 'frames/' + video_file[video_num].replace(' ', '\ ')
video_name = video_file[video_num].replace(' ', '\ ')
print('Video selected: ' + video_path + '\n')

fps = float(input('Specify frames per second: '))
os.system('mkdir ' + video_out_path)
os.system('ffmpeg -i ' + video_path + ' -vf fps=' + str(fps) + ' ' + video_out_path + '/out%d.jpg')
print('\n' + 'Frames generated Successfully')


# ### Constructing Point Cloud


os.system('mkdir point-cloud/' + video_name)

print('Constructing point cloud: ' + video_out_path)
os.system('visualsfm-mardy.visualsfm sfm+pairs+pmvs ' + video_out_path + '/ point-cloud/' + video_name + '/output')
print('\n' + 'Pointcloud made Successfully')



ply_path = 'point-cloud/' + video_name + '/output.0.ply'

print("Load a ply point cloud, print it, and render it")
ply = o3d.io.read_point_cloud(ply_path)
ply.paint_uniform_color([0.8, 0.8, 0.8])
o3d.visualization.draw_geometries([ply])



def pc_to_points(ply):
    ply_points = np.asarray(ply.points)
    return ply_points

def pc_y_points(ply_points):
    y_points = ply_points[:,1]
    return y_points 

def plot_y_points(y_points):
    x = np.arange(1,ply_points.shape[1])
    y = y_points[0:ply_points.shape[1]-1]
    plt.plot(x,y)
    plt.show()

def pc_height(y_points):
    min_y = np.amin(y_points)
    max_y = np.amax(y_points)
    height = max_y - min_y
    return height


def view_pc(ply_points):
    v = pptk.viewer(ply_points, ply_points[:,1])
    v.color_map('hsv')


def display_inlier_outlier(cloud, ind):
    inlier_cloud = cloud.select_down_sample(ind)
    outlier_cloud = cloud.select_down_sample(ind, invert=True)

    outlier_cloud.paint_uniform_color([1, 0, 0])
    inlier_cloud.paint_uniform_color([0.8, 0.8, 0.8])
    o3d.visualization.draw_geometries([inlier_cloud, outlier_cloud])

def stat_removal(ply):
    cl, ind = ply.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0)
    return cl, ind

def radius_removal(ply):
    cl, ind = ply.remove_radius_outlier(nb_points=16, radius=0.05)
    return cl, ind


#Calculating height of pointcloud
ply_points = pc_to_points(ply)
y_points = pc_y_points(ply_points)
plot_y_points(y_points)
height = pc_height(y_points)
print("Height before outlier removal: ", height*100, "cm")


# Removing outliers and then calculating height
cl, ind = stat_removal(ply)
# display_inlier_outlier(ply, ind)

ply_points = pc_to_points(cl)
y_points = pc_y_points(ply_points)
plot_y_points(y_points)
height = pc_height(y_points)
print("Height after outlier removal: ", height*100, "cm")


v = pptk.viewer(ply_points)
v.attributes(-y_points)