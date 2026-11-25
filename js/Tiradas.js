const MAZO_CARTAS = [
    { id: 1, nombre: "El Loco", arcano: "Arcano Mayor (0)", significado: "Nuevos comienzos, espontaneidad, aventura y confianza en el camino.", invertido: "Imprudencia, riesgo innecesario o dudar al dar el salto." },
    { id: 2, nombre: "El Mago", arcano: "Arcano Mayor (I)", significado: "Habilidad, concentración, recursos disponibles y manifestación.", invertido: "Manipulación, dispersión o talento sin aprovechar." },
    { id: 3, nombre: "La Sacerdotisa", arcano: "Arcano Mayor (II)", significado: "Intuición profunda, misterio, sabiduría interior y calma.", invertido: "Desconexión intuitiva o secretos ocultos." },
    { id: 4, nombre: "La Emperatriz", arcano: "Arcano Mayor (III)", significado: "Creatividad, abundancia, cuidado y crecimiento.", invertido: "Bloqueo creativo o exigencia excesiva." },
    { id: 5, nombre: "El Emperador", arcano: "Arcano Mayor (IV)", significado: "Estructura, liderazgo, estabilidad y orden.", invertido: "Rigidez o falta de control." },
    { id: 6, nombre: "El Hierofante", arcano: "Arcano Mayor (V)", significado: "Guía, tradición, aprendizaje y valores.", invertido: "Cuestionar normas o buscar tu propio camino." },
    { id: 7, nombre: "Los Amantes", arcano: "Arcano Mayor (VI)", significado: "Vínculos, armonía, decisiones desde el corazón.", invertido: "Dudas o falta de alineación." },
    { id: 8, nombre: "El Carro", arcano: "Arcano Mayor (VII)", significado: "Avance decidido, enfoque y victoria.", invertido: "Falta de rumbo o impaciencia." },
    { id: 9, nombre: "As de Copas", arcano: "Arcano Menor · Copas", significado: "Apertura emocional, afecto genuino y paz interior.", invertido: "Emociones contenidas." },
    { id: 10, nombre: "Dos de Copas", arcano: "Arcano Menor · Copas", significado: "Conexión mutua, acuerdo y cercanía.", invertido: "Malentendidos por resolver." },
    { id: 11, nombre: "Tres de Espadas", arcano: "Arcano Menor · Espadas", significado: "Claridad tras una herida emocional o desengaño.", invertido: "Proceso de sanación y cierre." },
    { id: 12, nombre: "As de Bastos", arcano: "Arcano Menor · Bastos", significado: "Chispa creativa, impulso y nuevo proyecto.", invertido: "Pausa necesaria para recargar energía." }
];

const TIENDA_TIRADAS = [
    { nombre: "Tirada del Amor Verdadero", tipo: "Romántica · 3 cartas", descripcion: "Explora vínculos, bloqueos emocionales y panorama afectivo.", precio: "$250.00 MXN" },
    { nombre: "Tirada Relámpago Sí o No", tipo: "Rápida · 1 carta", descripcion: "Respuesta directa y enfocada a una pregunta concreta.", precio: "$150.00 MXN" },
    { nombre: "Lectura de Energía y Propósito", tipo: "Espiritual · 5 cartas", descripcion: "Panorama general de tu momento actual y próximos pasos.", precio: "$500.00 MXN" }
];

document.addEventListener("DOMContentLoaded", () => {
    // Navegación entre paneles
    const enlacesNav = document.querySelectorAll(".nav-link[data-target]");
    const botonesRegresar = document.querySelectorAll(".btn-regresar[data-target]");
    const paneles = document.querySelectorAll(".panel-seccion");

    function mostrarPanel(idPanel) {
        paneles.forEach(panel => panel.classList.toggle("activo", panel.id === idPanel));
        enlacesNav.forEach(enlace => {
            enlace.classList.toggle("active", enlace.dataset.target === idPanel);
        });
    }

    enlacesNav.forEach(enlace => {
        enlace.addEventListener("click", () => {
            mostrarPanel(enlace.dataset.target);
        });
    });

    botonesRegresar.forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarPanel(boton.dataset.target);
        });
    });

    // Poblar catálogos y tienda
    const listaMayores = document.getElementById("lista-mayores");
    const listaMenores = document.getElementById("lista-menores");
    const listaTienda = document.getElementById("lista-tienda");

    if (listaMayores) {
        MAZO_CARTAS.filter(c => c.arcano.includes("Mayor")).forEach(carta => {
            listaMayores.innerHTML += `
                <div class="tarjeta-item">
                    <h4>${carta.nombre} <small>(${carta.arcano})</small></h4>
                    <p><strong>Significado:</strong> ${carta.significado}</p>
                    <p><strong>Invertida:</strong> ${carta.invertido}</p>
                </div>`;
        });
    }

    if (listaMenores) {
        MAZO_CARTAS.filter(c => c.arcano.includes("Menor")).forEach(carta => {
            listaMenores.innerHTML += `
                <div class="tarjeta-item">
                    <h4>${carta.nombre} <small>(${carta.arcano})</small></h4>
                    <p><strong>Significado:</strong> ${carta.significado}</p>
                </div>`;
        });
    }

    if (listaTienda) {
        TIENDA_TIRADAS.forEach(item => {
            listaTienda.innerHTML += `
                <div class="tarjeta-item">
                    <h4>${item.nombre}</h4>
                    <p><strong>Tipo:</strong> ${item.tipo}</p>
                    <p>${item.descripcion}</p>
                    <p><strong>Precio:</strong> ${item.precio}</p>
                </div>`;
        });
    }

    // Generador pseudoaleatorio (Fisher-Yates con crypto.getRandomValues)
    function numeroAleatorioSeguro(maxExclusive) {
        const buffer = new Uint32Array(1);
        window.crypto.getRandomValues(buffer);
        return Math.floor((buffer[0] / (0xFFFFFFFF + 1)) * maxExclusive);
    }

    function barajarMazo(cartas) {
        const copia = [...cartas];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = numeroAleatorioSeguro(i + 1);
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    // Lógica del carrusel / tirada interactiva
    const carrusel = document.getElementById("carrusel-cartas");
    const estadoSeleccion = document.getElementById("estado-seleccion");
    const previewElegidas = document.getElementById("cartas-elegidas-preview");
    const btnRevelar = document.getElementById("btn-revelar-tirada");
    const btnRebarajar = document.getElementById("btn-rebarajar");
    const botonesCantidad = document.querySelectorAll(".btn-cantidad");
    const formTirada = document.getElementById("form-tirada-interactiva");
    const resultadoTirada = document.getElementById("resultado-tirada");

    let limiteCartas = 1;
    let mazoActual = barajarMazo(MAZO_CARTAS);
    let elegidas = [];

    function actualizarEstadoUI() {
        if (!estadoSeleccion || !btnRevelar || !previewElegidas) return;
        estadoSeleccion.textContent = `Selecciona ${limiteCartas} carta${limiteCartas > 1 ? "s" : ""} del carrusel (${elegidas.length}/${limiteCartas} elegidas)`;
        btnRevelar.disabled = elegidas.length !== limiteCartas;

        previewElegidas.innerHTML = elegidas
            .map((carta, idx) => `<span class="chip-carta">#${idx + 1}: ${carta.nombre}</span>`)
            .join("");
    }

    function renderizarCarrusel() {
        if (!carrusel) return;
        carrusel.innerHTML = "";
        elegidas = [];
        if (resultadoTirada) resultadoTirada.style.display = "none";
        actualizarEstadoUI();

        mazoActual.forEach((carta, index) => {
            const btnCarta = document.createElement("button");
            btnCarta.type = "button";
            btnCarta.className = "carta-dorso";
            btnCarta.setAttribute("aria-label", `Carta ${index + 1}`);
            btnCarta.innerHTML = `<span>✦</span><small>#${index + 1}</small>`;

            btnCarta.addEventListener("click", () => {
                const yaElegida = elegidas.some(item => item.id === carta.id);
                if (yaElegida) {
                    elegidas = elegidas.filter(item => item.id !== carta.id);
                    btnCarta.classList.remove("seleccionada");
                } else if (elegidas.length < limiteCartas) {
                    elegidas.push(carta);
                    btnCarta.classList.add("seleccionada");
                }
                actualizarEstadoUI();
            });

            carrusel.appendChild(btnCarta);
        });
    }

    botonesCantidad.forEach(btn => {
        btn.addEventListener("click", () => {
            botonesCantidad.forEach(b => b.classList.remove("activa"));
            btn.classList.add("activa");
            limiteCartas = Number(btn.dataset.cantidad);
            renderizarCarrusel();
        });
    });

    if (btnRebarajar) {
        btnRebarajar.addEventListener("click", () => {
            mazoActual = barajarMazo(MAZO_CARTAS);
            renderizarCarrusel();
        });
    }

    if (formTirada) {
        formTirada.addEventListener("submit", event => {
            event.preventDefault();
            if (elegidas.length !== limiteCartas) return;

            const preguntaInput = document.getElementById("pregunta-usuario");
            const preguntaTexto = preguntaInput ? preguntaInput.value.trim() : "";

            const tarjetasHtml = elegidas.map((carta, index) => {
                const invertida = numeroAleatorioSeguro(2) === 1;
                return `
                    <div class="carta-revelada">
                        <h4>Posición ${index + 1}: ${carta.nombre} ${invertida ? "(Invertida)" : "(Derecha)"}</h4>
                        <p><small>${carta.arcano}</small></p>
                        <p>${invertida ? carta.invertido : carta.significado}</p>
                    </div>
                `;
            }).join("");

            resultadoTirada.innerHTML = `
                <h3>Interpretación de tu Tirada</h3>
                <p><strong>Pregunta:</strong> "${preguntaTexto}"</p>
                ${tarjetasHtml}
            `;
            resultadoTirada.style.display = "block";
        });
    }

    renderizarCarrusel();
});