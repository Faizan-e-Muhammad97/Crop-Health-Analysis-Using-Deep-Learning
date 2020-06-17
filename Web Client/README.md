A Single Page Application for Crop Health Analysis based on [React JS](https://reactjs.org/).

## How to Run
The web client application can be run just like any other React application. Go to the project directory and run
+ `npm start`

## Sections
The Web Application is divided into two main sections
+ NDVI Analysis Section
+ Height Analysis Section

## NDVI Analysis Section

![Ndvi component](./map_ndvi.png)

## Height Analysis Section

![Height component](./height.png)

## Features
The Web Client provides users the following features
+ Multiple Images can be uploaded for ndvi calculation and ndvi mask generation.
+ The results of ndvi analysis are shown on google maps by extracting longitude and latitude information from the images.
+ Height analysis of crops directly from drone survey in video format or from a precomputed pointcloud.
+ Raster image of height analysis with real time statistics.
