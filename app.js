// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
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
    mostrarProductos(true);
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

// --------------------
// Mostrar productos
// --------------------
function mostrarProductos(isAdmin = false, filtro = "") {
  const contenedor = document.getElementById("productos");

  db.collection("productos").onSnapshot((querySnapshot) => {
    contenedor.innerHTML = ""; // Limpiar productos
    querySnapshot.forEach((doc) => {
      const p = doc.data();
      if (p.name.toLowerCase().includes(filtro.toLowerCase())) {
        contenedor.innerHTML += `
          <div class="card">
            <img src="${p.photo}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p><b>$${p.price}</b></p>
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
function agregarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const foto = document.getElementById("foto").value.trim();

  if (!nombre || !precio || !descripcion || !foto) {
    alert("Completa todos los campos");
    return;
  }

  db.collection("productos").add({
    name: nombre,
    price: precio,
    description: descripcion,
    photo: foto
  })
  .then(() => {
    alert("Producto agregado correctamente");
    // Limpiar campos
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("foto").value = "";
    // onSnapshot actualiza automáticamente
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
  db.collection("productos").doc(id).delete();
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
