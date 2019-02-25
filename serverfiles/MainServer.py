from flask import Flask, request,render_template
import requests
import os

app = Flask(__name__)

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
    return render_template("/html/main.html")