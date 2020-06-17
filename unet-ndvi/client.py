from __future__ import print_function
import requests
import json
import cv2
import os
import base64

addr = 'http://127.0.0.1:5002'
test_url = addr + '/api/predict/'

# prepare headers for http request
content_type = 'application/json'
headers = {'content-type': content_type}

images = {}
for file in os.listdir("testing_server"):
	with open("testing_server/" + file, 'rb') as f:
		images[file] =f.read()

response = requests.post(test_url, json=images)

#resp = json.loads(response.text)
#resp = eval(resp)
#print(resp.keys())
#print(resp['IMG0_0_2048.jpg'])
#print(len(resp['IMG0_0_2048.jpg']))
#cv2.imwrite("result.png", resp['IMG0_0_2048.jpg'])