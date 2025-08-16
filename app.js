// Inicializar Firebase (sin import)
firebase.initializeApp({
  apiKey: "AIzaSyDsRX8iONMb11kwVww6cMYRctEbjB0EC9w",
  authDomain: "catalogo-pwa-ca5bc.firebaseapp.com",
  projectId: "catalogo-pwa-ca5bc",
  storageBucket: "catalogo-pwa-ca5bc.firebasestorage.app",
  messagingSenderId: "1076707936903",
  appId: "1:1076707936903:web:4a06dad55ccf1498b64622",
  measurementId: "G-FZE5JC9LBF"
});

const db = firebase.firestore();
let esAdmin = false;

// Login admin
document.getElementById("loginButton").addEventListener("click", () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === "Belen192226" && pass === "Fran192226"){
    esAdmin = true;
    document.getElementById("login").style.display = "none";
    document.getElementById("adminPanel").classList.remove("hidden");
    cargarProductos();
  } else alert("Usuario o contraseña incorrectos");
});

// Cargar productos
function cargarProductos(){
  const productosDiv = document.getElementById("productos");
  productosDiv.innerHTML = "";

  db.collection("productos").get().then(snapshot => {
    snapshot.forEach(doc => {
      const p = doc.data();
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <h3>${p.nombre}</h3>
        <p><b>Precio:</b> $${p.precio}</p>
        <p>${p.descripcion}</p>
        <img src="${p.foto}" width="120">
        ${esAdmin ? `<button class="deleteBtn" data-id="${doc.id}">Eliminar</button>` : ""}
      `;
      productosDiv.appendChild(div);
    });

    if(esAdmin){
      document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", ()=> eliminarProducto(btn.dataset.id));
      });
    }
  });
}

// Agregar producto
document.getElementById("addButton").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value;
  const foto = document.getElementById("foto").value;

  if(!nombre || !precio || !descripcion || !foto){
    alert("Completa todos los campos");
    return;
  }

  db.collection("productos").add({ nombre, precio, descripcion, foto })
    .then(() => {
      alert("Producto agregado ✅");
      document.getElementById("nombre").value = "";
      document.getElementById("precio").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("foto").value = "";
      cargarProductos();
    }).catch(err => {
      console.error(err);
      alert("No se pudo agregar el producto ❌");
    });
});

// Eliminar producto
function eliminarProducto(id){
  if(confirm("¿Seguro que quieres eliminar este producto?")){
    db.collection("productos").doc(id).delete()
      .then(()=> cargarProductos())
      .catch(err => console.error(err));
  }
}

// Filtro de productos
document.getElementById("search").addEventListener("input", () => {
  const texto = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll(".producto").forEach(p => {
    const visible = p.innerText.toLowerCase().includes(texto);
    p.style.display = visible ? "block" : "none";
  });
});

// Cargar productos al inicio
cargarProductos();
