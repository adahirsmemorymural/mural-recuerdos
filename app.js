import { db, storage } from "./firebase.js";

import {
addDoc,
collection,
getDocs,
orderBy,
query
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const uploadBtn = document.getElementById("uploadBtn");

const gallery = document.getElementById("gallery");

async function loadMemories() {

gallery.innerHTML = "";

const q = query(
collection(db,"recuerdos")
);

const snapshot = await getDocs(q);

snapshot.forEach((doc) => {

const data = doc.data();

gallery.innerHTML += `
<div class="card">

<img src="${data.imageUrl}">

<div class="card-content">

<div class="card-location">
📍 ${data.location}
</div>

<div class="card-date">
🗓 ${data.date}
</div>

<p>${data.description}</p>

</div>

</div>
`;

});

}

uploadBtn.addEventListener("click", async () => {

const file =
document.getElementById("photo").files[0];

const date =
document.getElementById("date").value;

const location =
document.getElementById("location").value;

const description =
document.getElementById("description").value;

if(!file){
alert("Selecciona una foto");
return;
}

const storageRef = ref(
storage,
`memories/${Date.now()}-${file.name}`
);

await uploadBytes(
storageRef,
file
);

const imageUrl =
await getDownloadURL(storageRef);

await addDoc(
collection(db,"recuerdos"),
{
imageUrl,
date,
location,
description,
createdAt: Date.now()
}
);

alert("Recuerdo guardado 🩵");

loadMemories();

});

loadMemories();

const ADMIN_KEY = "mi-mural-2026-secret";

function isAdmin() {
  return localStorage.getItem("adminKey") === ADMIN_KEY;
}

// ocultar botón si NO eres admin
window.addEventListener("load", () => {
  if (!isAdmin()) {
    document.getElementById("uploadBtn").style.display = "none";
  }
});

document.getElementById("uploadBtn").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // aquí ya llamas tu Firebase (TU CÓDIGO ACTUAL)
  const storageRef = ref(storage, 'mural/' + file.name);

  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  await addDoc(collection(db, "mural"), {
    imageUrl: url,
    createdAt: new Date()
  });
});
