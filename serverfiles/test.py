import requests

def testPost(val1, val2 = {}, p = False):	
	IP = "http://localhost:5000/"

	r = requests.post(IP + val1, data=val2)
	if(p):
		print(val1 + ": " , r.reason, r.content.decode("utf-8"))



testPost("getPosts", {}, True)


#testPost("register", {"username": "BobbyJeans"})
testPost("register", {"username": "BobbyBans"})


testPost("sendContactRequest", {"sender": "BobbyJeans", "receiver": "BobbyBans"})
testPost("getContactRequests", {"username": "BobbyBans"})
testPost("approveContactRequest", {"sender": "BobbyBans", "receiver": "BobbyJeans"})

"""
testPost("addMessage", {"sender": "BobbyJeans", "receiver": "BobbyBans", "message": "Olá"})
testPost("getMessages", {"username": "BobbyJeans"}, True)
"""