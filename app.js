// ===== Firebase =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// ===== Login =====
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "Belen192226" && pass === "Fran192226") {
    document.getElementById("login").style.display = "none";
    document.getElementById("adminPanel").classList.remove("hidden");
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// Hacemos login visible desde HTML
window.login = login;

// ===== Productos =====
async function cargarProductos() {
  const productosDiv = document.getElementById("productos");
  productosDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "productos"));
  querySnapshot.forEach((doc) => {
    const p = doc.data();
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio}</p>
      <p>${p.descripcion}</p>
      <img src="${p.foto}" width="120">
    `;
    productosDiv.appendChild(div);
  });
}

// Agregar producto
async function agregarProducto() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value;
  const foto = document.getElementById("foto").value;

  try {
    await addDoc(collection(db, "productos"), {
      nombre,
      precio,
      descripcion,
      foto
    });
    alert("Producto agregado!");
    cargarProductos();
  } catch (e) {
    console.error("Error agregando producto: ", e);
  }
}

window.agregarProducto = agregarProducto;

// Filtro
function filtrarProductos() {
  const texto = document.getElementById("search").value.toLowerCase();
  const productos = document.querySelectorAll(".producto");

  productos.forEach(p => {
    const visible = p.innerText.toLowerCase().includes(texto);
    p.style.display = visible ? "block" : "none";
  });
}

window.filtrarProductos = filtrarProductos;

// Cargar productos al inicio
cargarProductos();
