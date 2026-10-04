// ============================================================
// TiendaWeb · script.js
// Un solo archivo para todas las páginas. Cada función revisa
// que existan sus elementos antes de ejecutarse.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  iniciarMenu();
  iniciarRegistro();
  iniciarQuienesSomos();
  iniciarCatalogo();
  iniciarCarrito();
  iniciarBusqueda();
});

// ---------- Menú para pantallas pequeñas ----------
function iniciarMenu() {
  var boton = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector(".menu");
  if (!boton || !menu) return;

  boton.addEventListener("click", function () {
    menu.classList.toggle("is-open");
    boton.setAttribute("aria-expanded", menu.classList.contains("is-open") ? "true" : "false");
  });
}

// ---------- Registro ----------
function iniciarRegistro() {
  var form = document.getElementById("form-registro");
  if (!form) return;

  var checkbox = document.getElementById("terminos");
  var boton = document.getElementById("btn-enviar");
  var mensaje = document.getElementById("mensaje-registro");

  // El botón se habilita solo si se aceptan los términos
  boton.disabled = !checkbox.checked;
  checkbox.addEventListener("change", function () {
    boton.disabled = !checkbox.checked;
  });

  function mostrar(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje " + tipo;
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // 1. Verificar que todos los campos estén completos
    var campos = [
      { id: "nombre", etiqueta: "Nombre" },
      { id: "email", etiqueta: "Correo electrónico" },
      { id: "password", etiqueta: "Contraseña" },
      { id: "nacimiento", etiqueta: "Fecha de nacimiento" },
      { id: "telefono", etiqueta: "Teléfono" }
    ];
    var faltantes = [];

    for (var i = 0; i < campos.length; i++) {
      var campo = document.getElementById(campos[i].id);
      if (campo.value.trim() === "") {
        faltantes.push(campos[i].etiqueta);
      }
    }

    if (faltantes.length > 0) {
      mostrar("Faltan campos por completar: " + faltantes.join(", ") + ".", "error");
      return;
    }

    // 2. Verificar el correo con expresión regular
    var er = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!er.test(document.getElementById("email").value.trim())) {
      mostrar("El correo electrónico no tiene un formato válido.", "error");
      return;
    }

    // 3. Todo correcto
    mostrar("¡Registro completado! (demostración, los datos no se guardan).", "ok");
    form.reset();
    boton.disabled = true;
  });
}

// ---------- Quiénes somos ----------
function iniciarQuienesSomos() {
  var boton = document.getElementById("btn-ver-mas");
  var extra = document.getElementById("info-extra");
  if (!boton || !extra) return;

  boton.addEventListener("click", function () {
    var oculto = extra.classList.toggle("oculto");
    boton.textContent = oculto ? "Ver más" : "Ver menos";
    boton.setAttribute("aria-expanded", oculto ? "false" : "true");
  });
}

// ---------- Catálogo ----------
function iniciarCatalogo() {
  var botones = document.querySelectorAll(".btn-agregar");
  if (botones.length === 0) return;

  var contador = document.getElementById("contador-carrito");
  var mensaje = document.getElementById("mensaje-catalogo");
  var total = 0;

  for (var i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function () {
      var producto = this.closest(".producto");
      var nombre = producto.getAttribute("data-nombre");

      total = total + 1;
      if (contador) contador.textContent = total;

      mensaje.textContent = "Se agregó \"" + nombre + "\" al carrito.";
      mensaje.className = "mensaje ok";
    });
  }
}

// ---------- Carrito ----------
function iniciarCarrito() {
  var campos = document.querySelectorAll(".cantidad");
  if (campos.length === 0) return;

  function formato(numero) {
    return numero.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  }

  function recalcular() {
    var total = 0;

    for (var i = 0; i < campos.length; i++) {
      var cantidad = parseInt(campos[i].value, 10) || 0;
      var precio = Number(campos[i].getAttribute("data-precio"));
      var subtotal = cantidad * precio;

      campos[i].closest("tr").querySelector(".subtotal").textContent = formato(subtotal);
      total = total + subtotal;
    }

    document.getElementById("total-carrito").textContent = formato(total);
  }

  for (var j = 0; j < campos.length; j++) {
    campos[j].addEventListener("input", function () {
      // Solo se aceptan números
      this.value = this.value.replace(/\D/g, "");
      recalcular();
    });
  }

  recalcular();
}

// ---------- Búsqueda ----------
function iniciarBusqueda() {
  var form = document.getElementById("form-busqueda");
  if (!form) return;

  var campo = document.getElementById("texto-busqueda");
  var titulo = document.getElementById("titulo-resultados");
  var lista = document.getElementById("lista-resultados");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var texto = campo.value.trim();

    if (texto === "") {
      titulo.textContent = "Escribe algo para buscar.";
      lista.classList.add("oculto");
      return;
    }

    titulo.textContent = "Resultados para la búsqueda de " + texto;
    lista.classList.remove("oculto");
  });
}
