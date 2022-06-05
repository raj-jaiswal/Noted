if(Cookies.get('user')!=undefined){
  location.assign('main.html');
}

const socket=io('http://localhost:5000');
socket.on('connect',()=>{
  console.log('connected!');
  socket.on('signUpResponse',(message)=>{
    if(message=='success'){
      Cookies.set('user',document.querySelector('input[name="name"]').value,{expires:365});
      window.location.href="main.html";
    }
    else{
      alertify(message);
    }
  });
  socket.on('logInResponse',(message)=>{
    if(message=='success'){
      Cookies.set('user',document.querySelector('input[name="name"]').value,{expires:365});
      window.location.href="main.html";
    }
    else{
      alertify(message);
    }
  });
});

function login(){
  let name=document.querySelector('input[name="name"]').value;
  let pass=document.querySelector('input[name="pass"]').value;
  socket.emit('login',{name,pass});
}
function signup(){
  let name=document.querySelector('input[name="name"]').value;
  let email=document.querySelector('input[name="email"]').value;
  let pass=document.querySelector('input[name="pass"]').value;
  socket.emit('signup',{name,email,pass});
}

document.addEventListener("visibilitychange", event => {
  if (document.visibilityState == "visible") {
    if(Cookies.get('user')!=undefined){
      location.assign('main.html');
    }
    else{
      location.assign('index.html');
    }
  }
});