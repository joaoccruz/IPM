import requests

LOGGED = "6i"


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




testPost("register", {"username": "BobbyJeans"})
testPost("register", {"username": "BobbyBans"})
testPost("register", {"username": "AA"})
testPost("register", {"username": "BB"})




testPost("sendContactRequest", {"sender": "BobbyJeans", "receiver": LOGGED})
testPost("sendContactRequest", {"sender": "BobbyBans", "receiver": LOGGED})

addFriend(LOGGED, "AA")
addFriend(LOGGED, "BobbyJeans")

sendMessage(LOGGED, "BobbyJeans", "hiii")
sendMessage("BobbyJeans", LOGGED, "Greetings")