import socket

try:
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	print("Socket created!!")
except socket.error as e:
	print(e)
port = 1024
s.bind(('', port))
print("Socket binded to port", port)

s.listen(2)

while True:
	c, addr = s.accept()
	print(addr, c)
	c.send('Greetings from test server!!')
	c.close()


#print(socket.gethostbyname('www.nitk.ac.in'))
