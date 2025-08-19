const contenedor = document.querySelector('.cards');
const apiUrl = 'https://raw.githubusercontent.com/Quincenero/proyecto-marco-espinoza/main/mercaderia.json';

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    return response.json();
  })
  .then(productos => {
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${prod.img}" alt="${prod.alt}" />
        <h3>${prod.nombre}</h3>
        <p>ARS ${prod.precio}</p>
        <button>Añadir al carrito</button>
      `;
      contenedor.appendChild(card);
    });
  })
  .catch(error => console.error('Error fetching data:', error));