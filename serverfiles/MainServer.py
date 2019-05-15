from flask import Flask, request,render_template
import requests
import os

app = Flask(__name__,template_folder='html',static_folder="html/static")

def readhtlm(filename):
    try:
        file = open("./html/%s.html" % filename ,"r")
        ret = file.read()
        file.close()
        return ret
    except:
        print("File not found: %s" % filename)





@app.route("/", methods=["GET"])
def homePage():
    return render_template("index.html")


@app.route("/hi", methods=["GET"])
def hi():
    return "hi"

app.run(host="0.0.0.0",port=5000)



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
	print(str(list(USER_LIST.keys())))
	return str(USER_LIST.keys())

app.run(host="127.0.0.1",port=5000)
