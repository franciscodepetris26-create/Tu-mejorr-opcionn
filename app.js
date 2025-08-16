// Inicializar Firebase
firebase.initializeApp({
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
  measurementId: "TU_MEASUREMENT_ID"
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

// Cargar productos desde Firebase
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
