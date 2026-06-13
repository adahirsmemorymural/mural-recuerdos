import {
  db,
  storage,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  ref,
  uploadBytes,
  getDownloadURL
} from "./firebase.js";

const mural = document.getElementById("mural");

/* 📤 SUBIR POST */
document.getElementById("uploadBtn").addEventListener("click", async () => {

  const file = document.getElementById("fileInput").files[0];
  const desc = document.getElementById("descInput").value;

  if (!file) return alert("Selecciona una imagen");

  const storageRef = ref(storage, "mural/" + Date.now() + "_" + file.name);

  const snap = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snap.ref);

  await addDoc(collection(db, "posts"), {
    imageUrl: url,
    description: desc || "sin descripción",
    date: new Date().toLocaleDateString(),
    likes: 0,
    createdAt: Date.now()
  });

  alert("Publicado 👑");
});

/* 📡 VER MURAL EN ADMIN */
onSnapshot(collection(db, "posts"), (snap) => {
  mural.innerHTML = "";

  snap.forEach((d) => {
    const post = d.data();

    const card = document.createElement("div");
    card.className = "post";

    card.innerHTML = `
      <img src="${post.imageUrl}" />

      <div class="info">
        <div class="desc">${post.description}</div>
        <div class="date">${post.date}</div>

        <button class="delete-btn">🗑 Borrar</button>
      </div>
    `;

    card.querySelector(".delete-btn").addEventListener("click", async () => {
      await deleteDoc(doc(db, "posts", d.id));
    });

    mural.appendChild(card);
  });
});
