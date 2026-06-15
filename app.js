import {
db
}
from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy,
doc,
updateDoc,
increment
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const subtitle = document.getElementById('subtitle');
const text = subtitle.textContent;

subtitle.innerHTML = '';

[...text].forEach((char, i) => {
  const span = document.createElement('span');
  span.textContent = char === ' ' ? '\u00A0' : char;
  span.style.animationDelay = `${i * 0.04}s`;
  subtitle.appendChild(span);
});

const gallery =
document.getElementById(
"gallery"
);

const modal =
document.getElementById(
"imageModal"
);

const modalImage =
document.getElementById(
"modalImage"
);

const closeModal =
document.getElementById(
"closeModal"
);

/* ==========================
   MODAL FOTO
========================== */

closeModal.addEventListener(
"click",
()=>{

modal.style.display =
"none";

}
);

modal.addEventListener(
"click",
()=>{

modal.style.display =
"none";

}
);

/* ==========================
   LIKES
========================== */

function hasLiked(id){

return localStorage.getItem(
"liked_" + id
);

}

function saveLike(id){

localStorage.setItem(
"liked_" + id,
"true"
);

}

/* ==========================
   CARGAR RECUERDOS
========================== */

async function loadMemories(){

gallery.innerHTML = "";

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
"polaroid";

card.innerHTML = `

<img
src="${data.imageUrl}"
class="memory-image">

<div
class="memory-info">

<div
class="memory-place">

📍 ${data.place}

</div>

<div
class="memory-date">

🗓 ${data.date}

</div>

<div
class="memory-description">

${data.description}

</div>

<div
class="like-bar">

<button
class="like-btn"
data-id="${memory.id}">

❤️

</button>

<span
class="likes-count">

${data.likes || 0}

</span>

</div>

</div>

`;

gallery.appendChild(
card
);

const image =
card.querySelector(
".memory-image"
);

image.addEventListener(
"click",
()=>{

modal.style.display =
"flex";

modalImage.src =
data.imageUrl;

}
);

const likeBtn =
card.querySelector(
".like-btn"
);

const count =
card.querySelector(
".likes-count"
);

if(
hasLiked(memory.id)
){

likeBtn.disabled =
true;

likeBtn.innerHTML =
"❤️";

}

likeBtn.addEventListener(
"click",
async()=>{

if(
hasLiked(
memory.id
)
){
return;
}

try{

await updateDoc(
doc(
db,
"recuerdos",
memory.id
),
{
likes:
increment(1)
}
);

saveLike(
memory.id
);

count.textContent =
parseInt(
count.textContent
)+1;

likeBtn.disabled =
true;

}catch(error){

console.error(
error
);

}

}
);

}
);

}

loadMemories();
