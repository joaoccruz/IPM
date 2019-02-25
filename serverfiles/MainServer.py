from flask import Flask, request
import requests
import os

app = Flask(__name__)
files = "./htlm"

def readhtlm(filename):
    try:
        file = open(os.path.join(".",filename,".html"),"r")
        ret = file.read()
        file.close()

        return ret
    except:
        print("File not found: %s" % filename)





@app.route("/", methods=["GET"])
def homePage():
    return readhtlm("main")
