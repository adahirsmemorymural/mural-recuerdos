import {
  db,
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "./firebase.js";

const mural = document.getElementById("mural");

/* ❤️ LIKE SYSTEM */
function likePost(id, post) {
  const key = "liked_" + id;

  if (localStorage.getItem(key)) return;

  localStorage.setItem(key, "true");

  updateDoc(doc(db, "posts", id), {
    likes: (post.likes || 0) + 1
  });
}

/* 📸 POLAROID DOWNLOAD AESTHETIC */
function downloadPolaroid(imageUrl) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  img.onload = () => {
    canvas.width = 420;
    canvas.height = 520;

    /* fondo polaroid */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* sombra suave */
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 20;

    /* imagen */
    ctx.drawImage(img, 25, 25, 370, 370);

    ctx.shadowBlur = 0;

    /* watermark aesthetic */
    ctx.fillStyle = "#111";
    ctx.font = "italic 18px Georgia";
    ctx.fillText("adahir.diaz", 150, 460);

    /* small vintage date stamp style */
    const now = new Date().toLocaleDateString();
    ctx.font = "12px Arial";
    ctx.fillStyle = "#777";
    ctx.fillText(now, 170, 485);

    /* download */
    const link = document.createElement("a");
    link.download = "memory-polaroid.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
}

/* 📡 RENDER MURAL */
onSnapshot(collection(db, "posts"), (snap) => {
  mural.innerHTML = "";

  snap.forEach((d) => {
    const post = d.data();
    const likedKey = "liked_" + d.id;
    const isLiked = localStorage.getItem(likedKey);

    const card = document.createElement("div");
    card.className = "post";

    card.innerHTML = `
      <img src="${post.imageUrl}" />

      <div class="info">
        <div class="desc">${post.description}</div>
        <div class="date">${post.date}</div>

        <div>
          <span class="like ${isLiked ? "liked" : ""}">❤</span>
          <span>${post.likes || 0}</span>
        </div>

        <div class="download-btn">⬇ Descargar Polaroid</div>
      </div>
    `;

    /* ❤️ LIKE */
    card.querySelector(".like").addEventListener("click", () => {
      likePost(d.id, post);
      card.querySelector(".like").classList.add("liked");
    });

    /* ⬇ DOWNLOAD */
    card.querySelector(".download-btn").addEventListener("click", () => {
      downloadPolaroid(post.imageUrl);
    });

    mural.appendChild(card);
  });
});
