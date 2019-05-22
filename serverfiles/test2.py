import requests

LOGGED = "ll"


def testPost(val1, val2 = {}, p = False):	
	IP = "http://localhost:5000/"

	r = requests.post(IP + val1, data=val2)
	if(p):
		print(val1 + ": " , r.reason, r.content.decode("utf-8"))


def addFriend(loggedIn, friend):
	testPost("sendContactRequest", {"sender": loggedIn, "receiver": friend})
	testPost("approveContactRequest", {"sender": friend, "receiver": loggedIn})

def sendMessage(u1, u2, message):
	testPost("addMessage", {"sender": u1, "receiver": u2, "message": message})

