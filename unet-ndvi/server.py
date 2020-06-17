from flask import Flask, request, jsonify, Response, send_file, send_from_directory
from keras.models import load_model
import json
import jsonpickle
import numpy as np
from PIL import Image
import tensorflow as tf
import skimage.io as io
import os
import glob
import base64
from flask_cors import CORS
import cv2
from skimage.filters import threshold_otsu

app = Flask(__name__)
CORS(app)

model = load_model("pretrained-model/unet-model")
graph = tf.get_default_graph()

init_op = tf.initialize_all_variables()
sess = tf.Session()
sess.run(init_op)

def labelVisualize(num_class,color_dict,img):
	img = img[:,:,0] if len(img.shape) == 3 else img
	img_out = np.zeros(img.shape + (3,))
	for i in range(num_class):
		img_out[img == i,:] = color_dict[i]
	return img_out / 255


def saveResult(save_path, npyfile, filename, flag_multi_class = False,num_class = 2):
	for i,item in enumerate(npyfile):
		img = labelVisualize(num_class,COLOR_DICT,item) if flag_multi_class else item[:,:,0]
		io.imsave(os.path.join(save_path,filename.replace(".jpg","")+".png"),item)

@app.route('/api/predict/', methods=['POST'])
def predict():
	global graph
	global sess

	req = request.files.to_dict(flat=False)
	
	for key in req.keys():
		filename = key
		im = Image.open(req[key][0])

		npimg = np.fromstring(req[key][0].read(), np.uint8)
		img = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)

	cv2.imwrite("received_img.png", np.array(im))

	#files = glob.glob('processed_images/*')
	#for f in files:
	 #   os.remove(f)

	test_images = np.empty((len(req), 512, 512, 3))
	test_images[0] = im

	#filenames = []
	#for i, file in enumerate(req):
	#	im = Image.open(req[file][0].stream)
		#test_images.append(np.array(im))
	#	filenames.append(file)
	#	test_images[i] = im

	print(test_images.shape)
	
	with sess.as_default():
		with graph.as_default():
			imgs_mask_test = model.predict(test_images, batch_size=1, verbose=1)

	print(imgs_mask_test.shape)

	saveResult('output/', imgs_mask_test, filename)

	imgs_mask_test[imgs_mask_test <= 0.5] = 0
	imgs_mask_test[imgs_mask_test >= 0.5] = 1

	for i, image in enumerate(imgs_mask_test):
	    image = io.imread("output/"+filename.replace(".jpg", "")+".png")
	    thresh = threshold_otsu(image)
	    binary = image > thresh

	    RGB = np.zeros((binary.shape[0],binary.shape[1],3), dtype=np.uint8)

	    RGB[binary]  = [0,255,0]
	    RGB[~binary] = [255,0,0]

	    cv2.imwrite("output/"+filename.replace(".jpg","")+".png", cv2.cvtColor(RGB, cv2.COLOR_RGB2BGR))


	#saveResult('processed_images/', predictions, filename)

	return "Connected"

@app.route("/download/<path:path>")
def get_file(path):
	"""Download a file."""
	return send_file("processed_images/"+path, attachment_filename=path, as_attachment=True)

app.run(host="127.0.0.1", port=5002)
