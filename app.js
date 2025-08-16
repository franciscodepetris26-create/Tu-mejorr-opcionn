// ===== Firebase =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsRX8iONMb11kwVww6cMYRctEbjB0EC9w",
  authDomain: "catalogo-pwa-ca5bc.firebaseapp.com",
  projectId: "catalogo-pwa-ca5bc",
  storageBucket: "catalogo-pwa-ca5bc.firebasestorage.app",
  messagingSenderId: "1076707936903",
  appId: "1:1076707936903:web:3043cf0acff9b494b64622",
  measurementId: "G-MZXZS2G1V1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== Variables =====
let esAdmin = false;

// ===== Login =====
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "Belen192226" && pass === "Fran192226") {
    esAdmin = true;
    document.getElementById("login").style.display = "none";
    document.getElementById("adminPanel").classList.remove("hidden");
    cargarProductos();
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

// ===== Cargar Productos =====
async function cargarProductos() {
  const productosDiv = document.getElementById("productos");
  productosDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "productos"));
  querySnapshot.forEach((docItem) => {
    const p = docItem.data();
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p><b>Precio:</b> $${p.precio}</p>
      <p>${p.descripcion}</p>
      <img src="${p.foto}" width="120">
      ${esAdmin ? `<button class="deleteBtn" data-id="${docItem.id}">Eliminar</button>` : ""}
    `;
    productosDiv.appendChild(div);
  });

  if (esAdmin) {
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => eliminarProducto(btn.dataset.id));
    });
  }
}

// ===== Agregar Producto =====
const addButton = document.getElementById("addButton");
addButton.addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value;
  const foto = document.getElementById("foto").value;

  if (!nombre || !precio || !descripcion || !foto) {
    alert("Por favor, completa todos los campos");
    return;
  }

  try {
    await addDoc(collection(db, "productos"), { nombre, precio, descripcion, foto });
    alert("Producto agregado ✅");

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("foto").value = "";

    cargarProductos();
  } catch (e) {
    console.error("Error agregando producto:", e);
    alert("Error al guardar el producto ❌");
  }
});

// ===== Eliminar Producto =====
async function eliminarProducto(id) {
  if (confirm("¿Seguro que quieres eliminar este producto?")) {
    try {
      await deleteDoc(doc(db, "productos", id));
      alert("Producto eliminado ✅");
      cargarProductos();
    } catch (e) {
      console.error("Error eliminando producto:", e);
      alert("Error al eliminar ❌");
    }
  }
}

// ===== Filtro de Productos =====
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
  const texto = searchInput.value.toLowerCase();
  document.querySelectorAll(".producto").forEach(p => {
    const visible = p.innerText.toLowerCase().includes(texto);
    p.style.display = visible ? "block" : "none";
  });
});

// ===== Cargar productos al inicio =====
cargarProductos();
