if(Cookies.get('user')==undefined){
  location.assign('index.html');
}
const socket=io();

socket.on('getRequest',(data)=>{
  if(data=='noUserFound'){
    Cookies.remove('user');
    location.assign('index.html');
  }
  for (let i=0;i<data.length;i++){
    let item=data[i];
    if(item[0]=='text'){
      let notes=document.querySelector('.notes');
      let input=document.createElement('div')
      input.classList.add('input');
      input.index=i;
      input.innerHTML+='\
        <input type="text" value="'+item[1].split('**__--__**')[0]+'" onclick="openNote(this)" readonly>\
        <div class="bullet"></div>\
        <div class="shade"></div>\
        <div class="delete centered" onclick="deleteNote(this);"><i class="fa-solid fa-trash"></i></div>\
      ';
      notes.appendChild(input);
    }
    else if(item[0]=='image'){
      let notes=document.querySelector('.notes');
      let imageNote=document.createElement('div');
      imageNote.classList.add('note-image');
      imageNote.index=i;
      imageNote.innerHTML+='<div class="bullet"></div>\
                            <div class="delete centered" onclick="deleteNote(this);"><i class="fa-solid fa-trash"></i></div>';
      let imageElement=document.createElement('img');
      imageElement.src=item[1];
      imageNote.appendChild(imageElement);
      notes.appendChild(imageNote);
    }
  }
  document.querySelector('.load').style.display='none';
  checkForEmpty();
  setDelay(document.body.children[1],1);
});

setDelay(document.body.children[0],1);
socket.emit('getData',{'name': Cookies.get('user')});

document.addEventListener("visibilitychange", event => {
  if (document.visibilityState == "visible") {
    if(Cookies.get('user')==undefined){
      location.assign('index.html');
    }
    else{
      location.assign('main.html');
    }
  }
});

function checkForEmpty(){
  if(document.querySelector('.notes').children.length==0){
    document.querySelector('.empty').style.display='block';
    setDelay(document.body.children[2],1);
  }
  else{
    document.querySelector('.empty').style.display='none';
  }
}

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}