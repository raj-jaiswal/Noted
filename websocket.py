from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO,emit
import sqlite3

connector=sqlite3.connect('data.db')
cursor=connector.cursor()

app=Flask(__name__, static_url_path='', static_folder="static/")
socketio=SocketIO(app)

@socketio.on('connect')
def test_connect():
    pass
    #print("socket connected")
    
@socketio.on('login')
def login(message):
  if(exists(message['name'])):
    cursor.execute('SELECT * FROM "{}"'.format(message['name']))
    data=cursor.fetchall()[0]
    key=data[2]
    hashed=data[3]
    if(encrypt(message['pass'],key)==hashed):
      emit('logInResponse','success',broadcast=False)
    else:
      emit('logInResponse','The Password is Incorrect',broadcast=False)
  else:
    emit('logInResponse',"User Doesn't Exist",broadcast=False)

@socketio.on('signup')
def signup(message):
  import string
  import random
  if('"' in message['name']):
    return emit('signUpResponse','Username Can not contain "',broadcast=False)
  if (exists(message['name']) or len(message['name'])==0):
    return emit('signUpResponse','User Already Exists',broadcast=False)
  if (len(message['pass'])<8):
    return emit('signUpResponse','The Password is too Short',broadcast=False)
  key=''.join(random.choices(string.ascii_uppercase + string.digits,k=10))
  encrypted=encrypt(message['pass'],key)
  cursor.execute('CREATE TABLE "{}" (type VARCHAR,data VARCHAR,key VARCHAR,pass VARCHAR,email VARCHAR)'.format(message['name']))
  cursor.execute('INSERT INTO "{}"(key,pass,email) VALUES (?,?,?)'.format(message['name']),[key,encrypted,message['email']])
  connector.commit()
  emit('signUpResponse','success',broadcast=False)

@socketio.on('getData')
def dataRequest(message):
  if('name' in message and exists(message['name'])):
    cursor.execute('SELECT * FROM "{}"'.format(message['name']))
    data=cursor.fetchall()
    if(len(data)>1):
      return emit('getRequest',data[1:],broadcast=False)
    else:
      return emit('getRequest','noData',broadcast=False)
  else:
    return emit('getRequest','noUserFound',broadcast=False)

@socketio.on('getNote')
def dataRequest(message):
  if('name' in message and exists(message['name'])):
    cursor.execute('SELECT * FROM "{}"'.format(message['name']))
    data=cursor.fetchall()
    if(len(data)>1 and 'index' in message and message['index']<len(data)-1):
      return emit('getRequest',data[message['index']+1][1],broadcast=False)
    else:
      return emit('getRequest','noData',broadcast=False)
  else:
    return emit('getRequest','noUserFound',broadcast=False)

@socketio.on('putData')
def dataEntry(message):
  if('name' in message and exists(message['name'])):
    cursor.execute('INSERT INTO "{}"(type,data) VALUES (?,?)'.format(message['name']),[message['type'],message['data']])
    connector.commit()
    return emit('putRequest','success',broadcast=False)
  else:
    return emit('putRequest','noUserFound',broadcast=False)

@socketio.on('updateData')
def updateEntry(message):
  if('name' in message and exists(message['name'])):
    if('index' in message):
      cursor.execute('UPDATE "{}" SET data=? WHERE rowid= {}'.format(message['name'],message['index']+2),[message['data']])
      connector.commit()
      emit('putRequest','success',broadcast=False)
    else:
      return emit('putRequest','noIndex',broadcast=False);
  else:
    return emit('putRequest','noUserFound',broadcast=False)

@socketio.on('delete')
def deleteData(message):
  if('name' in message and exists(message['name'])):
    cursor.execute('SELECT * FROM "{}"'.format(message['name']))
    data=cursor.fetchall()
    data.pop(message['index']+1)
    cursor.execute('DELETE FROM "{}"'.format(message['name']))
    for i in data:
      cursor.execute('INSERT INTO "{}" VALUES (?,?,?,?,?)'.format(message['name']),i)
    connector.commit();
    return emit('deleteRequest','success',broadcast=False)
  else:
    return emit('deleteRequest','noUserFound',broadcast=False)

def encrypt(data,key):
  import hmac
  import hashlib
  return hmac.new(
    bytes(key,'latin-1'),
    msg=bytes(data,'latin-1'),
    digestmod=hashlib.sha256
  ).hexdigest().upper()

def exists(name):
  cursor.execute('SELECT name FROM sqlite_master WHERE type="table"')
  for i in cursor.fetchall():
    if (i[0]==name):
      return True
  return False

if __name__=='__main__':
  socketio.run(app)