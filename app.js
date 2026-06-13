import {
  db, storage,
  collection, addDoc, onSnapshot,
  deleteDoc, doc, updateDoc,
  ref, uploadBytes, getDownloadURL
} from "./firebase.js";

const ADMIN_KEY = "mural-secret-2026";

/* 👑 VERIFICAR ADMIN */
function isAdmin() {
  return localStorage.getItem("adminKey") === ADMIN_KEY;
}

window.addEventListener("DOMContentLoaded", () => {

  const adminBtn = document.getElementById("adminBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const mural = document.getElementById("mural");

  /* 🚨 VERIFICACIÓN DE ELEMENTOS */
  if (!adminBtn || !uploadBtn || !fileInput || !mural) {
    console.log("❌ Falta algún elemento en HTML");
    return;
  }

  /* 👑 BOTÓN ADMIN */
  adminBtn.addEventListener("click", () => {
    const pass = prompt("Ingresa clave de admin:");

    if (pass === ADMIN_KEY) {
      localStorage.setItem("adminKey", ADMIN_KEY);
      alert("Modo admin activado 👑");
      location.reload();
    } else {
      alert("Clave incorrecta ❌");
    }
  });

  /* 👀 OCULTAR SUBIDA SI NO ES ADMIN */
  if (!isAdmin()) {
    uploadBtn.style.display = "none";
  }

  /* 📤 SUBIR IMAGEN */
  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, "mural/" + Date.now() + "_" + file.name);
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);

      await addDoc(collection(db, "posts"), {
        imageUrl: url,
        description: "sin descripción",
        date: new Date().toLocaleDateString(),
        likes: 0,
        createdAt: Date.now()
      });

    } catch (error) {
      console.log("Error subiendo imagen:", error);
      alert("Error al subir imagen");
    }
  });

  /* 📸 MOSTRAR MURAL */
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
            <span class="like ${isLiked ? "liked" : ""}">❤</span>
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

      /* ❤️ LIKE */
      const likeBtn = div.querySelector(".like");

      likeBtn.addEventListener("click", async () => {
        if (localStorage.getItem(likedKey)) return;

        localStorage.setItem(likedKey, "true");

        await updateDoc(doc(db, "posts", d.id), {
          likes: (post.likes || 0) + 1
        });
      });

      mural.appendChild(div);
    });
  });

});

/* 🗑 BORRAR (ADMIN) */
window.deletePost = async (id) => {
  if (localStorage.getItem("adminKey") !== ADMIN_KEY) return;
  await deleteDoc(doc(db, "posts", id));
};

/* ✏️ EDITAR (ADMIN) */
window.editPost = async (id) => {
  if (localStorage.getItem("adminKey") !== ADMIN_KEY) return;

  const newDesc = prompt("Nueva descripción:");
  if (!newDesc) return;

  await updateDoc(doc(db, "posts", id), {
    description: newDesc
  });
};
