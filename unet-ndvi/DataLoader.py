import os
import cv2
import json
import keras
import numpy as np
import parameters as para
from tifffile import imread 

class DataGenerator(keras.utils.Sequence):
	def __init__(self, train_dict, labels_dict, batch_size=32, dim=(512,512), n_channels=3, shuffle=True, mode='train'):
		self.train_dict = train_dict
		self.labels_dict = labels_dict
		self.dim = dim
		self.n_channels = n_channels
		self.batch_size = batch_size
		self.shuffle = shuffle
		self.mode = mode
		self.on_epoch_end()

	def __len__(self):
		return int(np.floor(len(self.train_dict[self.mode]) / self.batch_size))

	def on_epoch_end(self):
		self.indexes = np.arange(len(self.train_dict[self.mode]))
		if self.shuffle == True:
			np.random.shuffle(self.indexes)

	def __getitem__(self, index):
		indexes = self.indexes[index*self.batch_size:(index+1)*self.batch_size]

		X_batch = [self.train_dict[self.mode][i] for i in indexes]
		y_batch = [self.labels_dict[self.mode][i] for i in indexes]

		X, Y = self.__data_generation(X_batch, y_batch)

		return X, Y

	def __data_generation(self, x_files, y_files):
		X = np.empty((self.batch_size, *self.dim, self.n_channels))
		y = np.empty((self.batch_size, *self.dim, para.num_classes - 1))

		for i, file in enumerate(x_files):
			X[i,] = cv2.imread(para.rgb_dir + "/" + file, cv2.IMREAD_UNCHANGED) / 255
		for i, file in enumerate(y_files):
			y[i,] = imread(para.ndvi_dir + "/" + file).reshape(512,512,1)

		return X, y