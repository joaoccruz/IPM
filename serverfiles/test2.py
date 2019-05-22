import requests, random, string

from test import LOGGED


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


newUser = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
#newUser = "KE2CF"
print(newUser)
testPost("register", {"username": newUser})
addFriend(newUser, LOGGED)
sendMessage(newUser,LOGGED, "hey")
sendMessage(LOGGED,newUser, "sup")