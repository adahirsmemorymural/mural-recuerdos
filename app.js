import {
  db, storage,
  collection, addDoc, onSnapshot,
  deleteDoc, doc, updateDoc,
  ref, uploadBytes, getDownloadURL
} from "./firebase.js";

const ADMIN_KEY = "mural-secret-2026";

function isAdmin() {
  return localStorage.getItem("adminKey") === ADMIN_KEY;
}

// activar admin en TU dispositivo (una vez)
window.makeAdmin = () => {
  localStorage.setItem("adminKey", ADMIN_KEY);
  alert("Modo admin activado");
};

// ocultar upload si no eres admin
if (!isAdmin()) {
  document.getElementById("uploadBtn").style.display = "none";
}

/* SUBIR IMAGEN */
document.getElementById("uploadBtn").onclick = () => {
  document.getElementById("fileInput").click();
};

document.getElementById("fileInput").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const storageRef = ref(storage, "mural/" + file.name);
  const snap = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snap.ref);

  await addDoc(collection(db, "posts"), {
    imageUrl: url,
    description: "Sin descripción",
    date: new Date().toLocaleDateString(),
    likes: 0
  });
};



/* RENDER MURAL */
const mural = document.getElementById("mural");

onSnapshot(collection(db, "posts"), (snap) => {
  mural.innerHTML = "";

  snap.forEach((d) => {
    const post = d.data();

    const likedKey = "liked_" + d.id;
    const isLiked = localStorage.getItem(likedKey);

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <img src="${post.imageUrl}" />

      <div class="info">
        <div class="desc">${post.description}</div>
        <div class="date">${post.date}</div>

        <div>
          <span class="likeBtn ${isLiked ? "liked" : ""}">❤</span>
          <span>${post.likes || 0}</span>
        </div>

        ${
          isAdmin()
            ? `<div class="admin-actions">
                <button onclick="editPost('${d.id}')">Editar</button>
                <button onclick="deletePost('${d.id}')">Borrar</button>
              </div>`
            : ""
        }
      </div>
    `;

    /* LIKE */
    const likeBtn = div.querySelector(".likeBtn");

    likeBtn.onclick = async () => {
      if (localStorage.getItem(likedKey)) return;

      localStorage.setItem(likedKey, "true");

      await updateDoc(doc(db, "posts", d.id), {
        likes: (post.likes || 0) + 1
      });
    };

    mural.appendChild(div);
  });
});

/* BORRAR (ADMIN) */
window.deletePost = async (id) => {
  if (!isAdmin()) return;
  await deleteDoc(doc(db, "posts", id));
};

/* EDITAR (ADMIN) */
window.editPost = async (id) => {
  if (!isAdmin()) return;

  const newDesc = prompt("Nueva descripción:");
  if (!newDesc) return;

  await updateDoc(doc(db, "posts", id), {
    description: newDesc
  });
};

const ADMIN_KEY = "mural-secret-2026";

function isAdmin() {
  return localStorage.getItem("adminKey") === ADMIN_KEY;
}

// BOTÓN ADMIN
document.getElementById("adminBtn").addEventListener("click", () => {
  const pass = prompt("Ingresa clave de admin:");

  if (pass === ADMIN_KEY) {
    localStorage.setItem("adminKey", ADMIN_KEY);
    alert("Ya eres admin");

    // recargar para aplicar cambios
    location.reload();
  } else {
    alert("Clave incorrecta ❌");
  }
});
