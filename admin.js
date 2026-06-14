import {
db,
storage,
auth
}
from "./firebase.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
orderBy,
query
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL,
deleteObject
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const uploadBtn =
document.getElementById("uploadBtn");

const adminGallery =
document.getElementById("adminGallery");

let currentUser = null;

/* =========================
   VERIFICAR ADMIN
========================= */

onAuthStateChanged(
auth,
(user)=>{

if(!user){

window.location.href =
"login.html";

return;

}

if(
user.email !==
"edgardiazayala62@gmail.com"
){

alert(
"Acceso denegado"
);

window.location.href =
"index.html";

return;

}

currentUser = user;

loadMemories();

}
);

/* =========================
   SUBIR RECUERDO
========================= */

uploadBtn.addEventListener(
"click",
async()=>{

const file =
document.getElementById("photo").files[0];

const date =
document.getElementById("date").value;

const place =
document.getElementById("place").value;

const description =
document.getElementById("description").value;

if(
!file ||
!date ||
!place ||
!description
){

alert(
"Completa todos los campos"
);

return;

}

try{

const fileName =
Date.now() +
"-" +
file.name;

const storageRef =
ref(
storage,
"memories/" + fileName
);

await uploadBytes(
storageRef,
file
);

const imageUrl =
await getDownloadURL(
storageRef
);

await addDoc(
collection(
db,
"recuerdos"
),
{
imageUrl,
date,
place,
description,
likes:0,
createdAt:
Date.now(),
storagePath:
"memories/" +
fileName
}
);

alert(
"Recuerdo guardado ❤️"
);

document
.getElementById("photo")
.value = "";

document
.getElementById("date")
.value = "";

document
.getElementById("place")
.value = "";

document
.getElementById("description")
.value = "";

loadMemories();

}catch(error){

console.error(error);

alert(
"Error al guardar"
);

}

}
);

/* =========================
   CARGAR RECUERDOS
========================= */

async function loadMemories(){

adminGallery.innerHTML =
"";

const q =
query(
collection(
db,
"recuerdos"
),
orderBy(
"createdAt",
"desc"
)
);

const snapshot =
await getDocs(q);

snapshot.forEach(
(memory)=>{

const data =
memory.data();

const card =
document.createElement(
"div"
);

card.className =
"admin-memory";

card.innerHTML = `

<img src="${data.imageUrl}">

<h3>
📍 ${data.place}
</h3>

<p>
🗓 ${data.date}
</p>

<p>
${data.description}
</p>

<p>
❤️ ${data.likes || 0}
</p>

<br>

<button
class="edit-btn"
data-id="${memory.id}">
Editar
</button>

<button
class="delete-btn"
data-id="${memory.id}"
data-path="${data.storagePath}">
Eliminar
</button>

`;

adminGallery.appendChild(
card
);

}
);

activateButtons();

}

/* =========================
   ELIMINAR
========================= */

function activateButtons(){

const deleteButtons =
document.querySelectorAll(
".delete-btn"
);

deleteButtons.forEach(
(btn)=>{

btn.addEventListener(
"click",
async()=>{

const id =
btn.dataset.id;

const path =
btn.dataset.path;

if(
!confirm(
"¿Eliminar recuerdo?"
)
){
return;
}

try{

await deleteDoc(
doc(
db,
"recuerdos",
id
)
);

if(path){

await deleteObject(
ref(
storage,
path
)
);

}

loadMemories();

}catch(error){

console.error(error);

}

}
);

}
);

/* =========================
   EDITAR
========================= */

const editButtons =
document.querySelectorAll(
".edit-btn"
);

editButtons.forEach(
(btn)=>{

btn.addEventListener(
"click",
async()=>{

const id =
btn.dataset.id;

const nuevoLugar =
prompt(
"Nuevo lugar"
);

const nuevaDescripcion =
prompt(
"Nueva descripción"
);

if(
!nuevoLugar ||
!nuevaDescripcion
){
return;
}

await updateDoc(
doc(
db,
"recuerdos",
id
),
{
place:
nuevoLugar,
description:
nuevaDescripcion
}
);

loadMemories();

}
);

}
);

}
