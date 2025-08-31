// Variables globales
    let productos = [];
    let carrito = [];
    const cuentaCarrito = document.getElementById('cuenta-carrito');
    const modalCarrito = document.getElementById('modal-carrito');
    const closeModal = document.querySelector('.close');
    const carritoItems = document.querySelector('.carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const cartIcon = document.getElementById('cart');
    const btnVaciar = document.getElementById('btn-vaciar');
    const cardsContainer = document.querySelector('.cards');
    const categoriaLinks = document.querySelectorAll('.categorias a');

    // URL del JSON en GitHub
    const JSON_URL = 'https://raw.githubusercontent.com/Quincenero/verduleria-organica/refs/heads/main/verduleria.json';

    // Inicializar la página
    document.addEventListener('DOMContentLoaded', () => {
      cargarProductos();
      setupEventListeners();
      actualizarCarrito();
    });

    // Cargar productos desde GitHub
    async function cargarProductos() {
      try {
        const response = await fetch(JSON_URL);
        
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        
        productos = await response.json();
        console.log('Productos cargados:', productos); // Para depuración
        mostrarProductos('todos');
        
        // Eliminar spinner y mensaje de carga
        cardsContainer.innerHTML = '';
      } catch (error) {
        console.error('Error:', error);
        cardsContainer.innerHTML = `
          <div class="loading-text">
            <p>Error al cargar los productos. Por favor, intenta nuevamente más tarde.</p>
            <button class="btn-agregar" onclick="cargarProductos()">Reintentar</button>
          </div>
        `;
      }
    }

    // Configurar event listeners
    function setupEventListeners() {
      // Menú hamburguesa
      const menu = document.getElementById('menu-icon');
      const navList = document.querySelector('.navList');

      menu.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('open');
        menu.classList.toggle('bx-x');
        document.body.classList.toggle('no-scroll');
        menu.setAttribute('aria-expanded', isOpen);
        menu.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      });

      // Filtros de categoría
      categoriaLinks.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
          e.preventDefault();
          // Remover clase active de todos los enlaces
          categoriaLinks.forEach(link => link.classList.remove('active'));
          // Agregar clase active al enlace clickeado
          enlace.classList.add('active');
          
          const categoria = enlace.getAttribute('data-categoria');
          console.log('Categoría seleccionada:', categoria); // Para depuración
          mostrarProductos(categoria);
        });
      });

      // Modal del carrito
      cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        modalCarrito.style.display = 'flex';
      });

      closeModal.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
      });

      window.addEventListener('click', (e) => {
        if (e.target === modalCarrito) {
          modalCarrito.style.display = 'none';
        }
      });

      // Botón vaciar carrito
      btnVaciar.addEventListener('click', vaciarCarrito);
    }

    // Mostrar productos según categoría
    function mostrarProductos(categoria) {
      console.log('Mostrando productos para categoría:', categoria); // Para depuración
      cardsContainer.innerHTML = '';

      let productosFiltrados = [];
      
      if (categoria === 'todos') {
        productosFiltrados = productos;
      } else {
        productosFiltrados = productos.filter(producto => {
          console.log('Producto:', producto.nombre, 'Categoría:', producto.categoria); // Para depuración
          return producto.categoria === categoria;
        });
      }

      console.log('Productos filtrados:', productosFiltrados); // Para depuración

      if (productosFiltrados.length === 0) {
        cardsContainer.innerHTML = '<p class="loading-text">No hay productos en esta categoría.</p>';
        return;
      }

      productosFiltrados.forEach(producto => {
        const productoElemento = document.createElement('div');
        productoElemento.classList.add('card-producto');
        productoElemento.innerHTML = `
          <img src="${producto.img}" alt="${producto.nombre}" onerror="this.src='https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
          <h3>${producto.nombre}</h3>
          <p>Producto orgánico de la más alta calidad</p>
          <div class="producto-precio">$${producto.precio}</div>
          <div class="controles-cantidad">
            <button class="btn-restar" data-id="${producto.id}">-</button>
            <span id="cantidad-${producto.id}">0</span>
            <button class="btn-sumar" data-id="${producto.id}">+</button>
          </div>
          <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `;
        cardsContainer.appendChild(productoElemento);
      });

      // Agregar event listeners a los botones
      document.querySelectorAll('.btn-sumar').forEach(boton => {
        boton.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'));
          aumentarCantidad(id);
        });
      });

      document.querySelectorAll('.btn-restar').forEach(boton => {
        boton.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'));
          disminuirCantidad(id);
        });
      });

      document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'));
          agregarAlCarrito(id);
        });
      });
    }

    // Funciones para controlar cantidades
    function aumentarCantidad(id) {
      const cantidadElemento = document.getElementById(`cantidad-${id}`);
      let cantidad = parseInt(cantidadElemento.textContent);
      cantidadElemento.textContent = cantidad + 1;
    }

    function disminuirCantidad(id) {
      const cantidadElemento = document.getElementById(`cantidad-${id}`);
      let cantidad = parseInt(cantidadElemento.textContent);
      if (cantidad > 0) {
        cantidadElemento.textContent = cantidad - 1;
      }
    }

    // Funciones del carrito
    function agregarAlCarrito(id) {
      const cantidadElemento = document.getElementById(`cantidad-${id}`);
      const cantidad = parseInt(cantidadElemento.textContent);
      
      if (cantidad <= 0) return;
      
      const producto = productos.find(p => p.id === id);
      const productoEnCarrito = carrito.find(item => item.id === id);

      if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
      } else {
        carrito.push({ ...producto, cantidad });
      }

      // Resetear contador
      cantidadElemento.textContent = '0';
      
      actualizarCarrito();
      
      // Feedback visual
      const boton = document.querySelector(`.btn-agregar[data-id="${id}"]`);
      const originalText = boton.textContent;
      boton.textContent = "¡Agregado!";
      setTimeout(() => {
        boton.textContent = originalText;
      }, 1500);
    }

    function vaciarCarrito() {
      // Mostrar confirmación antes de vaciar
      if (carrito.length === 0) {
        alert("El carrito ya está vacío");
        return;
      }
      
      if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        carrito = [];
        actualizarCarrito();
        alert("Carrito vaciado correctamente");
      }
    }

    function actualizarCarrito() {
      // Actualizar contador
      const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
      cuentaCarrito.textContent = totalItems;

      // Actualizar modal del carrito
      carritoItems.innerHTML = '';
      let total = 0;

      if (carrito.length === 0) {
        carritoItems.innerHTML = '<p>Tu carrito está vacío</p>';
        btnVaciar.disabled = true;
        btnVaciar.style.opacity = "0.6";
      } else {
        btnVaciar.disabled = false;
        btnVaciar.style.opacity = "1";
        
        carrito.forEach(item => {
          const itemTotal = item.precio * item.cantidad;
          total += itemTotal;

          const itemElemento = document.createElement('div');
          itemElemento.classList.add('carrito-item');
          itemElemento.innerHTML = `
            <img src="${item.img}" alt="${item.nombre}" width="50" onerror="this.src='https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
            <div class="item-info">
              <h4>${item.nombre}</h4>
              <p>$${item.precio} x ${item.cantidad}</p>
            </div>
            <div>$${itemTotal}</div>
          `;
          carritoItems.appendChild(itemElemento);
        });
      }

      carritoTotal.textContent = total;
    }