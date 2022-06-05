//animation n stuff
setDelay(document.body.children[0],1);
async function setDelay(elm,k){
  let j=k;
  for(let i=0;i<elm.children.length;i++){
    j++;
    setDelay(elm.children[i],j);
  }
  await delay(125*k);
  elm.style.opacity=1;
  elm.style.transform='translateY(0px)';
}
async function changeState(){
  document.body.classList.toggle('login');
  document.body.classList.toggle('signup');
  let elm=document.querySelector('.container');
  elm.classList.toggle('login');
  elm.classList.toggle('signup');
  let btn=document.querySelector('button')
  btn.classList.toggle('signup');
  btn=btn.children[0];
  for(let i=0;i<2;i++){
    document.getElementsByClassName('mail')[i].classList.toggle('signup');
  }
  let sub=document.querySelector('.subtitle');
  let desc=document.querySelector('.description');
  let txt=document.querySelector('.text');
  let a=document.querySelector('a');
  sub.classList.toggle('hidden');
  desc.classList.toggle('hidden');
  btn.classList.toggle('hidden');
  txt.classList.toggle('hidden');
  a.classList.toggle('hidden');
  await delay(300);
  if(sub.innerHTML=='Log In'){
    sub.innerHTML='Sign Up';
    btn.innerHTML='Sign Up';
    btn.parentElement.onclick=signup;
    a.innerHTML='Log In';
    document.querySelector('meta[name="theme-color"]').setAttribute("content",'#d8f6f4');
  }
  else{
    sub.innerHTML='Log In';
    btn.innerHTML='Log In';
    btn.parentElement.onclick=login;
    a.innerHTML='Sign Up';
    document.querySelector('meta[name="theme-color"]').setAttribute("content",'#fbe7e6');
  }
  sub.classList.toggle('hidden');
  a.classList.toggle('hidden');
  btn.classList.toggle('hidden');
  if(desc.innerHTML!='Create a new Account to use<br>This App.'){
    desc.innerHTML='Create a new Account to use<br>This App.';
  }
  else{
    desc.innerHTML='You must be Logged In to<br>Access your Notes.';
  }
  desc.classList.toggle('hidden');
  if(txt.innerHTML!="Already have an Account?"){
    txt.innerHTML="Already have an Account?";
  }
  else{
    txt.innerHTML="Don't have an Account?";
  }
  txt.classList.toggle('hidden');
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function togglePass(btn){
  let x=document.querySelector('input[name="pass"]');
  if (x.type == "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  btn.classList.toggle('fa-eye');
  btn.classList.toggle('fa-eye-slash');
}

function alertify(msg){
  swal({
    text:msg,
    button:false,
    timer:1500
  });
}