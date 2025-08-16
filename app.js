// --------------------
// Configuración de Firebase
// --------------------
const firebaseConfig = {
  apiKey: "AIzaSyDsRX8iONMb11kwVww6cMYRctEbjB0EC9w",
  authDomain: "catalogo-pwa-ca5bc.firebaseapp.com",
  projectId: "catalogo-pwa-ca5bc",
  storageBucket: "catalogo-pwa-ca5bc.appspot.com",
  messagingSenderId: "1076707936903",
  appId: "1:1076707936903:web:4a06dad55ccf1498b64622"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --------------------
// Usuario admin
// --------------------
const USER = "Belen192226";
const PASS = "Fran192226";

// --------------------
// Función login
// --------------------
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === USER && pass === PASS) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    mostrarProductos(true); // Mostrar productos con botones de eliminar
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// --------------------
// Mostrar productos
// --------------------
function mostrarProductos(isAdmin = false, filtro = "") {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  db.collection("productos").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const p = doc.data();
      if(p.nombre.toLowerCase().includes(filtro.toLowerCase())) {
        contenedor.innerHTML += `
          <div class="card">
            <img src="${p.foto}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p><b>$${p.precio}</b></p>
            ${isAdmin ? `<button onclick="eliminarProducto('${doc.id}')">Eliminar</button>` : ""}
          </div>
        `;
      }
    });
  });
}

// --------------------
// Agregar producto (solo admin)
// --------------------
// --------------------
// Agregar producto (solo admin)
// --------------------
function agregarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const foto = document.getElementById("foto").value.trim();

  if (!nombre || !precio || !descripcion || !foto) {
    alert("Completa todos los campos");
    return;
  }

  // Guardar en Firestore
  const db = firebase.firestore();
  db.collection("productos").add({
    nombre: nombre,
    precio: precio,
    descripcion: descripcion,
    foto: foto
  })
  .then(() => {
    alert("Producto agregado correctamente");
    // Limpiar campos
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("foto").value = "";
    // Mostrar productos actualizados
    mostrarProductos();
  })
  .catch((error) => {
    console.error("Error al agregar producto: ", error);
    alert("Error al agregar el producto");
  });
}

// --------------------
// Eliminar producto (solo admin)
// --------------------
function eliminarProducto(id) {
  db.collection("productos").doc(id).delete().then(() => {
    mostrarProductos(true);
  });
}

// --------------------
// Filtrar productos
// --------------------
function filtrarProductos() {
  const valor = document.getElementById("search").value;
  const isAdmin = !document.getElementById("adminPanel").classList.contains("hidden");
  mostrarProductos(isAdmin, valor);
}

// --------------------
// Mostrar productos al cargar (visitantes)
// --------------------
mostrarProductos(false);

