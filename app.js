// Usuario y contraseña admin
const USER = "Belen192226";
const PASS = "Fran192226";

// Array de productos (se cargará desde Firestore)
let productos = [];

// Login admin
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === USER && pass === PASS) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    cargarProductos(); // Cargar productos al entrar
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// Cargar productos desde Firebase Firestore
async function cargarProductos(filtro = "") {
  productos = [];
  const querySnapshot = await db.collection("productos").get();
  querySnapshot.forEach(doc => {
    productos.push({ id: doc.id, ...doc.data() });
  });
  mostrarProductos(filtro);
}

// Mostrar productos en el HTML
function mostrarProductos(filtro = "") {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  productos
    .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .forEach(p => {
      contenedor.innerHTML += `
        <div class="card">
          <img src="${p.foto}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <p><b>$${p.precio}</b></p>
          <button onclick="eliminarProducto('${p.id}')">Eliminar</button>
        </div>
      `;
    });
}

// Agregar producto a Firestore
async function agregarProducto() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value;
  const foto = document.getElementById("foto").value;

  if(!nombre || !precio || !descripcion || !foto) {
    alert("Completa todos los campos");
    return;
  }

  await db.collection("productos").add({ nombre, precio, descripcion, foto });

  // Limpiar inputs
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("foto").value = "";

  cargarProductos();
}

// Eliminar producto de Firestore
async function eliminarProducto(id) {
  await db.collection("productos").doc(id).delete();
  cargarProductos();
}

// Filtrar productos en tiempo real
function filtrarProductos() {
  const valor = document.getElementById("search").value;
  mostrarProductos(valor);
}

// Registrar Service Worker para PWA (offline)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// Cargar productos para visitantes que no son admin
cargarProductos();
