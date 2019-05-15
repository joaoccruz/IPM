from flask import Flask, request,render_template
from flask_cors import CORS
import os
import queue
import requests
import json


app = Flask(__name__,template_folder='web',static_folder="web/static")
CORS(app)

USER_LIST = {}
POST_LIST = {}

class Post:
	def __init___(self, src, desc, location, user, date, likes=[], comments=[]):
		self.src = src
		self.desc = desc
		self.location = location
		self.user = user
		self.date = date
		self.likes = likes
		self.comments = comments

class Message:
	def __init__(self, sender, receiver, message):
		self.sender = sender
		self.receiver = receiver
		self.message = message
	
	def __str__(self):
		ret = {"sender": self.sender, "receiver": self.receiver, "message": self.message}
		return(str(ret))    	


	def __repr__(self):
		ret = {"sender": self.sender, "receiver": self.receiver, "message": self.message}
		return(str(ret))    	

class User:
	def __init__(self, username):
		self.username = username
		self.contacts = set()
		self.contactsRequests = set()
		self.messageList = []

	def __str__(self):
		return self.username;

	def equals(user):
		if(user.username == self.username):
			return True 
		return False

def userExists(user):
	if(user in USER_LIST):
		return True
	return False

@app.route("/", methods=["GET"])
def ping():
	return "Pong", 200

@app.route("/register", methods=["POST"])
def register():
	print(request.form)
	try:
		u = request.form["username"]
	except:
		return "No username", 404 # Not Found (Original: 400/Bad Request)

	if(userExists(u)):
		return "User already found", 409 # Conflict (Original: 403/Forbidden)

	USER_LIST[u] = User(u)
	return "OK", 200 #OK



@app.route("/addMessage", methods=["POST"])
def message():
	try:
		sender   = request.form["sender"]
		receiver = request.form["receiver"]
		message  = request.form["message"]
	except:
		return "Missing header", 400

	if(userExists(sender) & userExists(receiver)):
		if(sender not in USER_LIST[receiver].contacts):
			return "Not contacts", 403

		m = Message(sender, receiver, message)

		if (len(USER_LIST[sender].messageList) > 50):
			USER_LIST[sender].messageList.pop(0)
			USER_LIST[receiver].messageList.pop(0)


		USER_LIST[sender].messageList.append(m)
		USER_LIST[receiver].messageList.append(m)
		return "OK"

	else:
		return "User not found", 404 # Not Found (Original: 403/Forbidden)

# CONTACTS

@app.route("/getContactRequests", methods=["POST"])
def getContactRequests():
	try:
		u = request.form["username"]
	except:
		return "Missing header", 400

	if(not userExists(u)):
		return "User not found", 404 # Not Found (Original: 403/Forbidden)

	return str(list(USER_LIST[u].contactsRequests))

@app.route("/sendContactRequest", methods=["POST"])
def sendRequest():
	try:
		sender   = request.form["sender"]
		receiver = request.form["receiver"]
	except:
		return "Missing header", 400	

	if(userExists(sender) & userExists(receiver)):
		if(sender not in USER_LIST[receiver].contacts):
			USER_LIST[receiver].contactsRequests.add(sender)	
			return "OK"
		else:
			return "Already contacts", 403	
	else:
		return "User not found", 404 # Not Found (Original: 403/Forbidden)


@app.route("/approveContactRequest", methods=["POST"])
def acceptContactRequest():
	try:
		sender   = request.form["sender"]
		receiver = request.form["receiver"]
	except:
		return "Missing header", 400


	contactsRequests = USER_LIST[sender].contactsRequests 
	if(receiver not in contactsRequests ):
		return "%s not found in %s's contacts requests" % (receiver, sender), 404 # Not Found (Original: 403/Forbidden)

	USER_LIST[sender].contactsRequests.remove(receiver)
	USER_LIST[sender].contacts.add(receiver)
	USER_LIST[receiver].contacts.add(sender)
	return "OK"

@app.route("/denyContactRequest", methods=["POST"])
def denyContactRequest():
	try:
		sender   = request.form["sender"]
		receiver = request.form["receiver"]
	except:
		return "Missing header", 400


	contactsRequests = USER_LIST[sender].contactsRequests 
	if(receiver not in contactsRequests ):
		return "%s not found in %s's contacts requests" % (receiver, sender), 404 # Not Found (Original: 403/Forbidden)

	USER_LIST[sender].contactsRequests.remove(receiver)
	return "OK"


@app.route("/getMessages", methods=["POST"])
def getMessages():
	try:
		u = request.form["username"]
	except:
		return "Missing header", 400

	if(not userExists(u)):
		return "User doesn't exist", 404 # Not Found (Original: 403/Forbidden)

	return str(USER_LIST[u].messageList)


@app.route("/getContacts", methods=["POST"])
def getContactList():
	try:
		u = request.form["username"]
	except:
		return "Missing header", 400

	if(not userExists(u)):
		return "User %s doesn't exist" % u
	return str(list(USER_LIST[u].contacts))

@app.route("/addPost", methods=["POST"])
def addPost():
	try:
		src = request.form["src"]
		desc = request.form["desc"]
		location = request.form["location"]
		user = request.form["user"]
		date = request.form["date"]
		likes = request.form["likes"]
		comments = request.form["comments"]
		return "OK", 200
	except:
		return "Missing header", 400



@app.route("/getPosts", methods=["POST"])
def getPosts():
	return str(POST_LIST)

@app.route("/getContacts", methods=["GET"])
def getContacts():
	return str(USER_LIST)

app.run(host="127.0.0.1",port=5000)
