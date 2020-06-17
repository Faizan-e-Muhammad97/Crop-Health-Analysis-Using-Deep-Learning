#Path to input images - RGB images
rgb_dir = "data/train_imgs"

#Path to grountruth labels - NDVI masks
ndvi_dir = "data/labels"

#Number of classes (labels)
num_classes = 2

#Dimension of input images
input_dim = (512,512)

batch_size = 4

epochs = 3

#This number represent the number of images to train the model on. (a splitter)
TRAIN_TEST_SPLIT = 300
