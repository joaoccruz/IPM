import requests

def testPost(val1, val2 = {}, p = False):	
	IP = "http://localhost:5000/"

	r = requests.post(IP + val1, data=val2)
	if(p):
		print(val1 + ": " , r.reason, r.content.decode("utf-8"))


def addFriend(loggedIn, friend):
	testPost("sendContactRequest", {"sender": loggedIn, "receiver": friend})
	testPost("approveContactRequest", {"sender": friend, "receiver": loggedIn})




testPost("getPosts", {}, True)


testPost("register", {"username": "BobbyJeans"})
testPost("register", {"username": "BobbyBans"})
testPost("register", {"username": "AA"})

addFriend("BobbyJeans", "BobbyBans")
addFriend("BobbyJeans", "AA")


"""
testPost("addMessage", {"sender": "BobbyJeans", "receiver": "BobbyBans", "message": "Olá"})
testPost("getMessages", {"username": "BobbyJeans"}, True)
"""