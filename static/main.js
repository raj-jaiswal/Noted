socket.on('connect',()=>{
  socket.on('putRequest',(message)=>{
    if(message=='success'){
      location.assign('main.html');
    }
    else{
      Cookies.remove('user');
      location.assign('index.html');
    }
  });
});

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

function logout(){
  Cookies.remove('user');
  window.location.href='index.html';
}

function showMenu(){
  document.querySelector('#pop-up-hidden').classList.toggle('pop-up');
  document.querySelector('.blur').classList.toggle('pop-up');
}

function getImage(img){
  let image=img.files[0];
  if(image.size>5 * 1000000){
    alertify('File Too Large');
    return;
  }
  document.querySelector('img').src=URL.createObjectURL(image);
  document.querySelector('#pop-up-hidden p').textContent=image.name;
  document.querySelector('#pop-up-hidden button').style.display='block';
}

function addImage(){
  let img=document.querySelector('img');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var image=canvas.toDataURL('image/jpeg');
  socket.emit('putData',{name: Cookies.get('user'),type:'image',data: image});
  showMenu();
}

function saveData(){
  let name=Cookies.get('user');
  let title=document.querySelector('.note-title').value;
  if(title==''){
    alertify('Please Add a Title');
    return;
  }
  let data=title+'**__--__**'+document.querySelector('.description').value;
  if(noteIndex==undefined){
    socket.emit('putData',{name,type:'text',data});
  }
  else{
    socket.emit('updateData',{name,type:'text',data,index: +noteIndex});
  }
}

function deleteNote(btn){
  swal({
    title: "Are you sure?",
    text: "You are about to Delete a Note. The Note will be permanently deleted.",
    buttons: ['Cancel','Yes, Delete'],
    dangerMode: true,
  })
  .then((willDelete)=>{
    if(willDelete){
      socket.emit('delete',{'name':Cookies.get('user'),'index':btn.parentElement.index});
      btn.parentElement.remove();
      let elements=document.querySelector('.notes').children;
      for(let i=0;i<elements.length;i++){
        elements[i].index=i;
      }
      checkForEmpty();
    }
  });
}

function openNote(inp){
  let index=inp.parentElement.index;
  window.location.href="add.html?i="+index;
}

function alertify(msg){
  swal({
    text:msg,
    button:false,
    timer:1500
  });
}