if(Cookies.get('user')==undefined){
  location.assign('index.html');
}
const socket=io('http://localhost:5000');

let noteIndex=window.location.href.split('?i=')[1];
if(noteIndex!=undefined){
  socket.on('getRequest',(message)=>{
    if(message=='noUserFound'){
      Cookies.remove('user');
      location.assign('index.html');
      return;
    }
    if(message!='noData'){
      message=message.split('**__--__**');
      document.querySelector('.note-title').value=message[0];
      document.querySelector('.description').value=message[1];
      document.querySelector('.imageButton').remove();
    }
  });
  socket.emit('getNote',{name: Cookies.get('user'), index: +noteIndex});
}