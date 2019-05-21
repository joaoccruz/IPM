from flask import Flask, request,render_template
from flask_cors import CORS
import os
import queue
import requests
import json
import time

app = Flask(__name__,template_folder='web',static_folder="web/static")
CORS(app)

USER_LIST = {}
POST_LIST = []

defaultJson = lambda x: x.__dict__ 

class Post:
	def __init__(self, src, desc, location, user, date, likes=[], comments=[]):
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
		self.messageList = {}

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
		return "No username", 400

	if(userExists(u)):
		return "User already found", 403

	USER_LIST[u] = User(u)
	return "OK"



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

		try:
			USER_LIST[sender].messageList[receiver].append(m)
		except:
			USER_LIST[sender].messageList[receiver] = [m]

		try:
			USER_LIST[receiver].messageList[sender].append(m)
		except:
			USER_LIST[receiver].messageList[sender] = [m]
		
		return "OK"

	else:
		return "User not found", 403

# CONTACTS

@app.route("/getContactRequests", methods=["POST"])
def getContactRequests():
	try:
		u = request.form["username"]
	except:
		return "Missing header", 400

	if(not userExists(u)):
		return "User not found", 403

	return json.dumps(list(USER_LIST[u].contactsRequests))

@app.route("/sendContactRequest", methods=["POST"])
def sendRequest():
	try:
		sender   = request.form["sender"]
		receiver = request.form["receiver"]
	except:
		return "Missing header", 400	

	if(userExists(sender) & userExists(receiver)):
		if(sender not in USER_LIST[receiver].contacts and sender not in USER_LIST[receiver].contactsRequests and sender != receiver):
			USER_LIST[receiver].contactsRequests.add(sender)	
			return "OK"
		else:
			return "Already contacts", 409
	else:
		return "User not found", 409


@app.route("/approveContactRequest", methods=["POST"])
def acceptContactRequest():
	try:
		sender   = request.form["sender"]
		receiver = request.form["receiver"]
	except:
		return "Missing header", 400


	contactsRequests = USER_LIST[sender].contactsRequests 
	if(receiver not in contactsRequests ):
		return "%s not found in %s's contacts requests" % (receiver, sender), 403

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
		return "%s not found in %s's contacts requests" % (receiver, sender), 403

	USER_LIST[sender].contactsRequests.remove(receiver)
	return "OK"


@app.route("/getMessages", methods=["POST"])
def getMessages():
	try:
		u = request.form["u1"]
		u2 = request.form["u2"]
	except:
		return "Missing header", 400

	if(not userExists(u) or not userExists(u2)):
		return "User doesn't exist", 403

	return json.dumps(list(USER_LIST[u].messageList[u2]), default=defaultJson)


@app.route("/getContacts", methods=["POST"])
def getContactList():
	try:
		u = request.form["username"]
	except:
		return "Missing header", 400

	if(not userExists(u)):
		return "User %s doesn't exist" % u

	return json.dumps(list(USER_LIST[u].contacts))

@app.route("/addPost", methods=["POST"])
def addPost():
	try:
		src = request.form["src"]
		desc = request.form["desc"]
		location = request.form["location"]
		user = request.form["user"]
		date = request.form["date"]
		likes = json.loads(request.form["likes"])
		comments = json.loads(request.form["comments"])
	except:
		return "Missing header", 400


	np = Post(src,desc,location,user,date,likes,comments)
	POST_LIST.append(np)
	return "OK"


@app.route("/likePost", methods=["POST"])
def likePost():
	# VALIDATE BOUNDARIES
	try:
		pid = request.form["postId"]
		u = request.form["user"]
	except:
		return "Missing header", 400

	l = POST_LIST[int(pid)].likes
	

	if(u in l):
		l.remove(u)
	else:
		l.append(u)

	return "OK"

@app.route("/likeComment", methods=["POST"])
def likeComment():
	try:
		u = request.form["user"]
		pid = request.form["postId"]
		commentId = request.form["commentId"]
	except:
		return "Missing header", 400

	l = POST_LIST[int(pid)].comments[int(commentId)]["likes"]
	
	if(u in l):
		l.remove(u)
	else:
		l.append(u)

	return "OK"

@app.route("/addComment", methods=["POST"])
def addComment():
	try:
		pid = request.form["postId"]
		user = request.form["user"]
		message = request.form["message"]
		likes = request.form["likes"]
	except:
		return "Missing header", 400

	if(likes == ""):
		likes = []

	POST_LIST[int(pid)].comments.append({"message": message, "user": user, "likes": likes})
	return "OK"


@app.route("/getPosts", methods=["POST"])
def getPosts():

	return json.dumps(POST_LIST, default=defaultJson)

POST_LIST.append(Post("img/beach.jpeg", "Nada como o ar da montanha, na praia", "Serra da Estrela", "Senhor_Malaquias", time.time(), ["Senhor_António","Senhor_Malaquias"], []));
POST_LIST.append(Post("img/montanha.jpg", "Imagem genérica de uma montanha", "Montanha", "Senhor_José", time.ctime(time.time()-604800000), [], []));
POST_LIST.append(Post("img/gil.jpg", "Grande Gil! ", "Parque das Nações", "Senhor_António", time.time(), [], []));
app.run(host="0.0.0.0",port=5000)
