from quick_server import create_server, msg, setup_restart

msg("{0}", " ".join(sys.argv)) # prints how the script was started
msg("starting server at {0}:{1}", addr if addr else 'localhost', port)
try:
    server.serve_forever() # starts the server -- only returns when the server stops (e.g., by typing `quit`, `restart`, or `CTRL-C`)
finally:
    msg("shutting down..")
    msg("{0}", " ".join(sys.argv)) # print how the script was called before exit -- this way you don't have to scroll up to remember when the server was running for a while
    server.server_close() # make sure to clean up all resources