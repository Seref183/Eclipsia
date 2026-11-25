const boton = document.getElementById('miboton');
const titulo = document.getElementById('titulo');

// Agregamos un evento al botón
boton.addEventListener('click', function() {
  // Cambiamos el color del texto
  titulo.style.color = '#2908e6';
  titulo.textContent = 'Hola Mundo';
});