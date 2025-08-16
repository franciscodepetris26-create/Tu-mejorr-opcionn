// ===== Firebase =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Tu configuración de Firebase
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
let esAdmin = false;

function login() {
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
}
window.login = login;

// ===== Productos =====
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
      ${esAdmin ? `<button onclick="eliminarProducto('${docItem.id}')">Eliminar</button>` : ""}
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

  if (!nombre || !precio || !descripcion || !foto) {
    alert("Por favor, completa todos los campos");
    return;
  }

  try {
    await addDoc(collection(db, "productos"), { nombre, precio, descripcion, foto });
    alert("Producto agregado ✅");

    // limpiar inputs
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("foto").value = "";

    cargarProductos();
  } catch (e) {
    console.error("Error agregando producto:", e);
    alert("Error al guardar el producto ❌");
  }
}
window.agregarProducto = agregarProducto;

// Eliminar producto
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
window.eliminarProducto = eliminarProducto;

// Filtro de productos
function filtrarProductos() {
  const texto = document.getElementById("search").value.toLowerCase();
  const productos = document.querySelectorAll(".producto");

  productos.forEach(p => {
    const visible = p.innerText.toLowerCase().includes(texto);
    p.style.display = visible ? "block" : "none";
  });
}
window.filtrarProductos = filtrarProductos;

// Cargar productos al iniciar
cargarProductos();
