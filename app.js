// Importar funciones de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8CdmsQ4GUqN1m_KlHlxGhagmed8_aVpA",
  authDomain: "producto-a6e68.firebaseapp.com",
  projectId: "producto-a6e68",
  storageBucket: "producto-a6e68.firebasestorage.app",
  messagingSenderId: "358261871993",
  appId: "1:358261871993:web:6aff27584ed1afd7d04ba8",
  measurementId: "G-6RFWTEJZ7N"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin
const USER = "Belen192226";
const PASS = "Fran192226";

// Login
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if(user === USER && pass === PASS) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    mostrarProductos(true);
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// Mostrar productos
function mostrarProductos(isAdmin = false, filtro = "") {
  const contenedor = document.getElementById("productos");
  const colRef = collection(db, "productos");

  onSnapshot(colRef, (snapshot) => {
    contenedor.innerHTML = "";
    snapshot.forEach((docItem) => {
      const p = docItem.data();
      if(p.name.toLowerCase().includes(filtro.toLowerCase())) {
        contenedor.innerHTML += `
          <div class="card">
            <img src="${p.photo}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p><b>$${p.price}</b></p>
            ${isAdmin ? `<button onclick="eliminarProducto('${docItem.id}')">Eliminar</button>` : ""}
          </div>
        `;
      }
    });
  });
}

// Agregar producto
async function agregarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const foto = document.getElementById("foto").value.trim();

  if(!nombre || !precio || !descripcion || !foto) {
    alert("Completa todos los campos");
    return;
  }

  try {
    await addDoc(collection(db, "productos"), {
      name: nombre,
      price: precio,
      description: descripcion,
      photo: foto
    });
    alert("Producto agregado correctamente");
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("foto").value = "";
  } catch(e) {
    console.error(e);
    alert("Error al agregar producto");
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  await deleteDoc(doc(db, "productos", id));
}

// Filtrar productos
function filtrarProductos() {
  const valor = document.getElementById("search").value;
  const isAdmin = !document.getElementById("adminPanel").classList.contains("hidden");
  mostrarProductos(isAdmin, valor);
}

// Mostrar al cargar
mostrarProductos(false);
