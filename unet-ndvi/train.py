import os
import json 
from model import *
from data import *
import numpy as np
import parameters as para
from DataLoader import DataGenerator
from keras.models import load_model
import cv2
from PIL import Image
from skimage import io
from skimage.filters import threshold_otsu

os.environ["CUDA_VISIBLE_DEVICES"] = "0"


def create_dict():

    partition = {}
    partition['train'] = []
    partition['validation'] = []
    
    for i, img_filename in enumerate(sorted(os.listdir(para.rgb_dir))):
        if (i < para.TRAIN_TEST_SPLIT):
            partition['train'].append(img_filename)
        else:
            partition['validation'].append(img_filename)
    
    labels = {}
    labels['train'] = []
    labels['validation'] = []
    for i, img_filename in enumerate(sorted(os.listdir(para.ndvi_dir))):
        if (i < para.TRAIN_TEST_SPLIT):
            labels['train'].append(img_filename)
        else:
            labels['validation'].append(img_filename)

    return (partition, labels)

def saveResult(save_path, npyfile, filename, flag_multi_class = False,num_class = 2):
    for i,item in enumerate(npyfile):
        img = labelVisualize(num_class,COLOR_DICT,item) if flag_multi_class else item[:,:,0]
        io.imsave(os.path.join(save_path,filename.replace(".jpg","")+".png"),item)

#data_gen_args = dict(rotation_range=0.2,
 #                   width_shift_range=0.05,
  #                  height_shift_range=0.05,
   #                 shear_range=0.05,
    #                zoom_range=0.05,
     #               horizontal_flip=True,
      #              fill_mode='nearest')
#myGene = trainGenerator(2,'data/membrane/train','image','label',data_gen_args,save_to_dir = None)

#model = unet()
#model_checkpoint = ModelCheckpoint('unet_membrane.hdf5', monitor='loss',verbose=1, save_best_only=True)

#model.fit(imgs_train, imgs_mask_train, batch_size=1, nb_epoch=10, verbose=1,
	#shuffle=True, callbacks=[model_checkpoint])

#model.fit_generator(myGene, steps_per_epoch=300, epochs=1, callbacks=[model_checkpoint])

#testGene = testGenerator("data/membrane/test")
#results = model.predict_generator(testGene, 30, verbose=1)
#imgs_mask_test = model.predict(imgs_test, batch_size=1, verbose=1)
#saveResult("data/membrane/test",results)

#def get_trainingData():
#	train_imgs = []
#	labels = []
#	for file in os.listdir('train_imgs'):
#		train_imgs.append(cv2.imread("train_imgs/" + file, cv2.IMREAD_UNCHANGED))
#
#	for file in os.listdir('labels'):
#		labels.append(imread("labels/" + file))
#
#	return (np.array(train_imgs), np.array(labels))
#train_imgs, ndvi_masks = get_trainingData()
    

partition, labels = create_dict()

training_generator = DataGenerator(partition, labels, batch_size=para.batch_size, mode="train")
validation_generator = DataGenerator(partition, labels, batch_size=para.batch_size, mode="validation")

model = unet()	
model_checkpoint = ModelCheckpoint('unet_membrane_latest.hdf5', monitor='loss',verbose=1, save_best_only=True)
model.fit(train_imgs, ndvi_masks, batch_size=2,  nb_epoch=10, verbose=1, shuffle=True, callbacks=[model_checkpoint])
model.fit_generator(generator=training_generator,
                    validation_data=validation_generator,
                    use_multiprocessing=True,
                    workers=6,
                    epochs=para.epochs,
                    callbacks=[model_checkpoint])

results = model.predict_generator(validation_generator, verbose=1)

def inference():

	TEST_DIR = "inputs"
	files = os.listdir(TEST_DIR)
	size_limit = 100

	indexes = np.arange(len(files))

	model = load_model("pretrained-model/unet-model")

	for i in range(int(np.floor(len(files) / size_limit))):
	    filenames = []
	    ins = indexes[i*size_limit:(i+1)*size_limit]
	    imgs_test = np.empty((len(ins), 512, 512, 3))

	    size = [files[k] for k in ins]

	    for i, file in enumerate(size):
	        imgs_test[i] = Image.open(TEST_DIR+"/"+ file)
	        filenames.append(file)
	        #imgs_test[i] = cv2.imread("testing_server/" + file, cv2.IMREAD_UNCHANGED)

	    imgs_mask_test = model.predict(imgs_test, batch_size=1, verbose=1)

	    imgs_mask_test[imgs_mask_test <= 0.95] = 0
	    imgs_mask_test[imgs_mask_test >= 0.95] = 1

	    for i, image in enumerate(imgs_mask_test):
	        image = labelVisualize(2,COLOR_DICT,image) if False else image[:,:,0]
	        io.imsave("binary.png",image)
	        image = io.imread("binary.png")
	        thresh = threshold_otsu(image)
	        binary = image > thresh

	        RGB = np.zeros((binary.shape[0],binary.shape[1],3), dtype=np.uint8)

	        RGB[binary]  = [0,255,0]
	        RGB[~binary] = [255,0,0]

	        cv2.imwrite("processed_images/" + filenames[i].replace(".jpg", "")+".png", cv2.cvtColor(RGB, cv2.COLOR_RGB2BGR))

#print(len(imgs_mask_test))
#saveResult("processed_images/",imgs_mask_test)
