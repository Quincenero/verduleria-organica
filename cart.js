let productos = [];

fetch('https://raw.githubusercontent.com/Quincenero/proyecto-marco-espinoza/main/mercaderia.json')
  .then(res => res.json())
  .then(data => {
    console.log("Productos cargados:", data);
    productos = data;
    renderProductos("Todos");
  })
  .catch(err => console.error("Error al cargar productos:", err));

const contenedor = document.getElementById("productos");
const enlaces = document.querySelectorAll('[data-categoria]');

enlaces.forEach(enlace => {
  enlace.addEventListener("click", e => {
    e.preventDefault();
    const categoria = enlace.dataset.categoria;
    renderProductos(categoria);
  });
});

function renderProductos(categoriaSeleccionada) {
  contenedor.innerHTML = "";

  const filtrados = categoriaSeleccionada === "Todos"
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  filtrados.forEach(p => {
    const card = document.createElement("div");
    card.className = "card-producto";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}" loading="lazy">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
    `;
    contenedor.appendChild(card);
  });
}


