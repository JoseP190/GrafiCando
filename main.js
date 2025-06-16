let mazos = {
    comodines: [],
    preguntas: [],
    datos: []
};

function actualizarContadores() {
    Object.keys(mazos).forEach(tipo => {
        const contador = document.getElementById(`contador-${tipo}`);
        const mazoElemento = document.getElementById(tipo);
        const cantidadCartas = mazos[tipo].length;
        
        // Actualizar el texto del contador
        if (cantidadCartas === 0) {
            contador.textContent = `Sin cartas (0)`;
            contador.classList.add('vacio');
            mazoElemento.classList.add('vacio');
        } else {
            contador.textContent = `Cartas: ${cantidadCartas}`;
            contador.classList.remove('vacio');
            mazoElemento.classList.remove('vacio');
        }
    });
}

// Función para procesar el texto y extraer las cartas
function procesarTexto(texto) {
    const cartas = [];
    const regex = /\{([^}]+)\}/g;
    let match;
    let totalCartas = 0;
    let cartasProblematicas = 0;

    while ((match = regex.exec(texto)) !== null) {
        totalCartas++;
        try {
            const cartaStr = '{' + match[1] + '}';
            const cartaLimpia = cartaStr
                .replace(/\n/g, ' ')
                .replace(/\r/g, '')
                .replace(/\t/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            const carta = JSON.parse(cartaLimpia);
            cartas.push(carta);
        } catch (e) {
            cartasProblematicas++;
            console.error(`Error en carta #${totalCartas}:`, e);
            console.error('Carta problemática:', match[0]);
            console.error('Posición del error:', e.position);
            if (e.position) {
                const contexto = match[0].substring(Math.max(0, e.position - 50), e.position + 50);
                console.error('Contexto del error:', contexto);
            }
        }
    }
    
    console.log(`Total de cartas encontradas: ${totalCartas}`);
    console.log(`Cartas procesadas correctamente: ${cartas.length}`);
    console.log(`Cartas con errores: ${cartasProblematicas}`);
    
    return cartas;
}

// Cargar los mazos
async function cargarMazos() {
    try {
        const comodinesResponse = await fetch('cartas/comodines.txt');
        const preguntasResponse = await fetch('cartas/preguntas.txt');
        const datosResponse = await fetch('cartas/datos.txt');

        const comodinesTexto = await comodinesResponse.text();
        const preguntasTexto = await preguntasResponse.text();
        const datosTexto = await datosResponse.text();

        mazos.comodines = procesarTexto(comodinesTexto);
        mazos.preguntas = procesarTexto(preguntasTexto);
        mazos.datos = procesarTexto(datosTexto);

        console.log('Mazos cargados:', {
            comodines: mazos.comodines.length,
            preguntas: mazos.preguntas.length,
            datos: mazos.datos.length
        });

        actualizarContadores();
    } catch (error) {
        console.error('Error al cargar los mazos:', error);
    }
}

function mostrarRespuesta(respuesta, esCorrecta) {
    const respuestaDiv = document.querySelector('.respuesta');
    respuestaDiv.textContent = esCorrecta ? '¡Correcto!' : 'Incorrecto';
    respuestaDiv.className = `respuesta mt-6 p-4 rounded-lg ${esCorrecta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
    respuestaDiv.style.display = 'block';

    if (!esCorrecta) {
        const respuestaCorrectaDiv = document.createElement('div');
        respuestaCorrectaDiv.className = 'mt-2 text-sm italic text-gray-600';
        respuestaCorrectaDiv.textContent = `La respuesta correcta era: ${respuesta}`;
        respuestaDiv.appendChild(respuestaCorrectaDiv);
    }
}

function mostrarMensajeVacio(tipoMazo) {
    const nombresMazos = {
        'comodines': 'Comodines',
        'preguntas': 'Preguntas', 
        'datos': 'Datos Curiosos'
    };
    
    const iconosMazos = {
        'comodines': '🃏',
        'preguntas': '❓',
        'datos': '📚'
    };
    
    const nombreMazo = nombresMazos[tipoMazo] || tipoMazo;
    const icono = iconosMazos[tipoMazo] || '🎴';
    
    // Crear mensaje temporal
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-mazo-vacio';
    mensaje.innerHTML = `
        <div class="icono-vacio">${icono}</div>
        <div class="texto-vacio">¡Mazo de ${nombreMazo} agotado!</div>
        <div class="subtexto-vacio">No quedan más cartas en este mazo</div>
    `;
    
    // Agregar estilos inline temporales
    mensaje.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.95), rgba(220, 38, 38, 0.95));
        color: white;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        z-index: 10001;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: fadeInShake 0.5s ease-out;
        font-family: inherit;
    `;
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#mensajeVacioStyles')) {
        const style = document.createElement('style');
        style.id = 'mensajeVacioStyles';
        style.textContent = `
            @keyframes fadeInShake {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            .icono-vacio { font-size: 3rem; margin-bottom: 1rem; }
            .texto-vacio { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem; }
            .subtexto-vacio { font-size: 1rem; opacity: 0.9; }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(mensaje);
    
    // Remover mensaje después de 2.5 segundos
    setTimeout(() => {
        mensaje.style.opacity = '0';
        mensaje.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (mensaje.parentNode) {
                mensaje.parentNode.removeChild(mensaje);
            }
        }, 300);
    }, 2500);
}

// Función para crear imagen con manejo de errores
function crearImagenCarta(src, className = 'w-2/3 h-auto mb-6 mx-auto max-w-sm max-h-64 object-cover') {
    const img = document.createElement('img');
    img.className = className;
    
    // Imagen de error por defecto (SVG en base64)
    const imagenError = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjI4MCIgaGVpZ2h0PSIxODAiIHN0cm9rZT0iI0Q1RDdEQSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1IDUiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI0VGNDQ0NCIvPgo8dGV4dCB4PSIxNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPiE8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
    
    // Intentar cargar la imagen original
    if (src && src.trim() !== '' && !src.includes('ejemplo.com')) {
        img.src = src;
        
        // Si falla al cargar, usar imagen de error
        img.onerror = () => {
            img.src = imagenError;
            img.alt = 'Imagen no disponible';
        };
        
        img.alt = 'Imagen de la carta';
        
        // Agregar funcionalidad de clic para mostrar en modal
        img.style.cursor = 'pointer';
        img.title = 'Haz clic para ver en grande';
        img.onclick = () => {
            mostrarImagenEnModal(img.src, img.alt);
        };
    } else {
        // Si no hay src o es una URL de ejemplo, usar directamente la imagen de error
        img.src = imagenError;
        img.alt = 'Imagen no disponible';
    }
    
    return img;
}

// Función para crear múltiples imágenes
function crearImagenesCartas(carta) {
    const contenedor = document.createElement('div');
    contenedor.className = 'imagenes-container mb-6';
    
    let imagenes = [];
    
    // Buscar todos los campos de imagen: imagenDelantera, imagenDelantera2, imagenDelantera3, etc.
    if (carta.imagenDelantera) {
        // Verificar si imagenDelantera es un array o string con múltiples URLs
        if (Array.isArray(carta.imagenDelantera)) {
            imagenes = [...carta.imagenDelantera];
        } else if (typeof carta.imagenDelantera === 'string') {
            // Dividir por comas si hay múltiples URLs en un solo campo
            const urlsEnCampo = carta.imagenDelantera.split(',').map(url => url.trim()).filter(url => url.length > 0);
            imagenes = [...urlsEnCampo];
        }
    }
    
    // Buscar campos adicionales: imagenDelantera2, imagenDelantera3, etc.
    for (let i = 2; i <= 10; i++) { // Buscar hasta imagenDelantera10
        const campoImagen = `imagenDelantera${i}`;
        if (carta[campoImagen] && carta[campoImagen].trim() !== '' && !carta[campoImagen].includes('ejemplo.com')) {
            imagenes.push(carta[campoImagen]);
        }
    }
    
    // Filtrar URLs vacías o de ejemplo
    imagenes = imagenes.filter(url => url && url.trim() !== '' && !url.includes('ejemplo.com'));
    
    // Si solo hay una imagen, usar el comportamiento normal
    if (imagenes.length <= 1) {
        return crearImagenCarta(imagenes[0] || carta.imagenDelantera);
    }
    
    // Si hay múltiples imágenes, crear un contenedor especial
    if (imagenes.length === 2) {
        // Para 2 imágenes: lado a lado
        contenedor.className = 'imagenes-container mb-6 flex gap-4 justify-center flex-wrap';
        imagenes.forEach((src, index) => {
            const img = crearImagenCarta(src, 'w-full h-auto rounded-lg shadow-sm max-w-xs max-h-48 object-cover');
            const wrapper = document.createElement('div');
            wrapper.className = 'flex-1 min-w-0';
            wrapper.appendChild(img);
            contenedor.appendChild(wrapper);
        });
    } else {
        // Para 3+ imágenes: disposición en grid
        contenedor.className = 'imagenes-container mb-6 grid gap-3 justify-center';
        contenedor.style.gridTemplateColumns = `repeat(${Math.min(imagenes.length, 3)}, 1fr)`;
        
        imagenes.forEach(src => {
            const img = crearImagenCarta(src, 'w-full h-auto rounded-lg shadow-sm max-h-40 object-cover');
            contenedor.appendChild(img);
        });
    }
    
    return contenedor;
}

function sacarCarta(tipoMazo) {
    // ===== VALIDACIÓN: DADO TIRO =====
    if (!dadoTiradoEnTurno) {
        mostrarMensaje('⛔ Debes tirar el dado antes de sacar una carta.', 'error');
        return;
    }
    
    // ===== VALIDACIÓN: SOLO UNA CARTA POR TURNO =====
    if (cartaSacadaEnTurno) {
        mostrarMensaje('⛔ Ya sacaste una carta en este turno. Espera tu siguiente turno.', 'error');
        return;
    }
    
    if (mazos[tipoMazo].length === 0) {
        mostrarMensajeVacio(tipoMazo);
        return;
    }

    // Marcar que ya se sacó una carta en este turno
    cartaSacadaEnTurno = true;
    
    // Deshabilitar mazos para evitar sacar más cartas
    deshabilitarMazos();
    
    console.log('🃏 DEBUG: Carta sacada - turno bloqueado hasta siguiente jugador');

    // Detener contador anterior si existe
    detenerContador();
    
    // Resetear estado de pregunta respondida
    preguntaRespondida = false;

    const indiceAleatorio = Math.floor(Math.random() * mazos[tipoMazo].length);
    const carta = mazos[tipoMazo].splice(indiceAleatorio, 1)[0];
    
    // ===== LÓGICA ESPECIAL PARA COMODINES =====
    if (tipoMazo === 'comodines') {
        const jugadorActual = jugadores[turnoActual];
        if (jugadorActual) {
            // Actualizar contador después de remover la carta del mazo
            actualizarContadores();
            
            // Verificar si es un comodín de uso inmediato
            const nombreComodin = carta.nombre.toLowerCase();
            
            if (nombreComodin === '¡ganas un punto gratis!') {
                // Aplicar efecto inmediatamente - no guardar en inventario
                modificarPuntuacion(jugadorActual, 1);
                actualizarPanelJugadores();
                
                // Mostrar mensaje de punto ganado
                mostrarMensaje(`🌟 ${jugadorActual} ganó 1 punto gratis inmediatamente! Total: ${puntuaciones[jugadorActual]}`, 'success');
                crearEfectosPuntuacion(jugadorActual, '+1', 'positivo');
                
                // Mostrar carta brevemente indicando que se aplicó
                mostrarCartaComodinInstantaneo(carta, jugadorActual, 'Punto aplicado inmediatamente');
                return;
            } else {
                // Otros comodines se guardan en el inventario
                agregarComodinAlInventario(jugadorActual, carta);
                mostrarCartaComodinTemporal(carta, jugadorActual);
                return;
            }
        }
    }
    
    // Guardar datos de la carta actual globalmente
    window.cartaActualData = carta;
    
    const cartaActual = document.getElementById('carta-actual');
    
    // Limpiar todo el contenido y clases anteriores
    cartaActual.className = '';
    cartaActual.removeAttribute('style');
    
    // Aplicar las clases base
    cartaActual.classList.add('slide-in');
    
    // Aplicar el estilo según el tipo de mazo
    if (tipoMazo === 'comodines') {
        cartaActual.classList.add('carta-comodines');
    } else if (tipoMazo === 'datos') {
        cartaActual.classList.add('carta-datos');
    } else if (tipoMazo === 'preguntas') {
        cartaActual.classList.add('carta-preguntas');
    }
    
    // Mostrar la carta
    cartaActual.style.display = 'block';
    
    // Establecer el nuevo contenido
    const titulo = cartaActual.querySelector('.carta-titulo');
    const texto = cartaActual.querySelector('.carta-texto');
    const respuestaInputContainer = cartaActual.querySelector('.respuesta-input-container');
    const respuesta = cartaActual.querySelector('.respuesta');
    
    titulo.textContent = '';
    texto.textContent = '';
    respuestaInputContainer.innerHTML = '';
    respuesta.textContent = '';
    respuesta.style.display = 'none';
    respuesta.className = 'respuesta hidden';
    
    titulo.className = 'carta-titulo';
    texto.className = 'carta-texto';
    titulo.textContent = carta.nombre;
    texto.textContent = carta.pregunta || carta.texto;

    // ===== AGREGAR IMAGEN PARA TODAS LAS CARTAS =====
    const imagenCarta = crearImagenesCartas(carta);
    respuestaInputContainer.appendChild(imagenCarta);

    // ===== INICIAR CONTADOR SOLO PARA CARTAS DE PREGUNTA =====
    if (tipoMazo === 'preguntas') {
        // Habilitar interacciones
        habilitarInteracciones();
        
        // Iniciar contador de tiempo (45 segundos)
        // NOTA: El contador se oculta automáticamente en vista móvil y tablet (CSS max-width: 1024px)
        // Solo aparece en pantallas de escritorio para cartas de pregunta
        iniciarContador();
        
        if (carta.tipo === 'Pregunta') {
            // Mostrar primero un botón para revelar la respuesta
            const btnRevelar = document.createElement('button');
            btnRevelar.className = 'btn-respuesta';
            btnRevelar.textContent = 'Mostrar Respuesta';
            btnRevelar.onclick = () => {
                // Detener contador al mostrar respuesta
                detenerContador();
                
                // Mostrar la respuesta
                respuesta.textContent = carta.respuesta;
                respuesta.className = 'respuesta';
                respuesta.style.display = 'block';
                btnRevelar.style.display = 'none';
                
                // Crear contenedor para botones de autoevaluación
                const botonesContainer = document.createElement('div');
                botonesContainer.className = 'flex justify-center gap-8 mt-6';
                
                // Botón para respuesta correcta
                const btnCorrecto = document.createElement('button');
                btnCorrecto.className = 'bg-green-500 hover:bg-green-600 text-white font-black text-xl py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105';
                btnCorrecto.textContent = '✅ Acerté';
                btnCorrecto.onclick = () => {
                    console.log('✅ DEBUG: Click en botón "Acerté" detectado');
                    
                    // Prevenir múltiples clics
                    if (preguntaRespondida) {
                        console.log('⚠️ DEBUG: Pregunta ya respondida, ignorando clic');
                        return;
                    }
                    preguntaRespondida = true;
                    
                    // Deshabilitar botones inmediatamente
                    btnCorrecto.style.pointerEvents = 'none';
                    btnIncorrecto.style.pointerEvents = 'none';
                    btnCorrecto.style.opacity = '1';
                    btnIncorrecto.style.opacity = '0.5';
                    btnCorrecto.disabled = true;
                    btnIncorrecto.disabled = true;
                    
                    // Asignar punto al jugador actual
                    if (jugadores.length > 0 && turnoActual < jugadores.length) {
                        const jugadorActual = jugadores[turnoActual];
                        
                        console.log('🎯 DEBUG: Asignando punto a jugador:', jugadorActual);
                        console.log('🎯 DEBUG: Puntuaciones antes:', JSON.stringify(puntuaciones));
                        
                        if (!puntuaciones[jugadorActual]) {
                            puntuaciones[jugadorActual] = 0;
                        }
                        puntuaciones[jugadorActual]++;
                        
                        console.log('🎯 DEBUG: Puntuaciones después:', JSON.stringify(puntuaciones));
                        console.log('🎯 DEBUG: Nuevo total del jugador:', puntuaciones[jugadorActual]);
                        
                        // Actualizar panel
                        actualizarPanelJugadores();
                        
                        // Mostrar mensaje de punto ganado
                        mostrarMensaje(`🎉 ¡${jugadorActual} ganó 1 punto! Total: ${puntuaciones[jugadorActual]}`, 'success');
                        crearEfectosPuntuacion(jugadorActual, '+1', 'positivo');
                        
                        // Verificar si alguien ha ganado
                        setTimeout(() => {
                            console.log('🏆 DEBUG: Verificando victoria con puntuaciones:', JSON.stringify(puntuaciones));
                            verificarVictoria();
                        }, 1000);
                    } else {
                        console.log('❌ DEBUG: No se pudo asignar punto - jugadores:', jugadores.length, 'turnoActual:', turnoActual);
                    }
                    
                    // Cambio automático al siguiente turno
                    console.log('🎮 DEBUG: Programando setTimeout para cambio de turno automático (correcta) en 2 segundos...');
                    setTimeout(() => {
                        try {
                            console.log('🎮 DEBUG: Iniciando cambio automático de turno después de autoevaluación correcta');
                            console.log('🎮 DEBUG: Turno actual antes del cambio:', turnoActual, 'Jugador:', jugadores[turnoActual]);
                            siguienteTurno();
                            console.log('🎮 DEBUG: Turno actual después del cambio:', turnoActual, 'Jugador:', jugadores[turnoActual]);
                            console.log('🎮 DEBUG: Ocultando carta');
                            cartaActual.style.display = 'none';
                        } catch (error) {
                            console.error('❌ DEBUG: Error en setTimeout de autoevaluación correcta:', error);
                        }
                    }, 2000);
                };
                
                // Botón para respuesta incorrecta
                const btnIncorrecto = document.createElement('button');
                btnIncorrecto.className = 'bg-red-500 hover:bg-red-600 text-white font-black text-xl py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105';
                btnIncorrecto.textContent = '❌ Fallé';
                btnIncorrecto.onclick = () => {
                    console.log('❌ DEBUG: Click en botón "Fallé" detectado');
                    
                    // Prevenir múltiples clics
                    if (preguntaRespondida) {
                        console.log('⚠️ DEBUG: Pregunta ya respondida, ignorando clic');
                        return;
                    }
                    preguntaRespondida = true;
                    
                    // Deshabilitar botones inmediatamente
                    btnCorrecto.style.pointerEvents = 'none';
                    btnIncorrecto.style.pointerEvents = 'none';
                    btnIncorrecto.style.opacity = '1';
                    btnCorrecto.style.opacity = '0.5';
                    btnCorrecto.disabled = true;
                    btnIncorrecto.disabled = true;
                    
                    // No asignar puntos
                    mostrarMensaje('😔 No se suma punto. ¡Mejor suerte la próxima vez!', 'info');
                    
                    // Cambio automático al siguiente turno
                    console.log('🎮 DEBUG: Programando setTimeout para cambio de turno automático (incorrecta) en 2 segundos...');
                    setTimeout(() => {
                        try {
                            console.log('🎮 DEBUG: Iniciando cambio automático de turno después de autoevaluación incorrecta');
                            console.log('🎮 DEBUG: Turno actual antes del cambio:', turnoActual, 'Jugador:', jugadores[turnoActual]);
                            siguienteTurno();
                            console.log('🎮 DEBUG: Turno actual después del cambio:', turnoActual, 'Jugador:', jugadores[turnoActual]);
                            console.log('🎮 DEBUG: Ocultando carta');
                            cartaActual.style.display = 'none';
                        } catch (error) {
                            console.error('❌ DEBUG: Error en setTimeout de autoevaluación incorrecta:', error);
                        }
                    }, 2000);
                };
                
                // Agregar botones al contenedor
                botonesContainer.appendChild(btnCorrecto);
                botonesContainer.appendChild(btnIncorrecto);
                
                // Agregar contenedor después de la respuesta
                respuestaInputContainer.appendChild(botonesContainer);
            };
            respuestaInputContainer.appendChild(btnRevelar);
        } else if (carta.tipo === 'Verdadero/Falso') {
            const vfDiv = document.createElement('div');
            vfDiv.className = 'flex justify-center gap-8 mt-6';
            vfDiv.innerHTML = `
                <button class="bg-green-500 hover:bg-green-600 text-white font-black text-xl py-4 px-12 rounded-lg transition duration-300 transform hover:scale-105" onclick="verificarRespuestaConContador(true, '${carta.respuesta}')">Verdadero</button>
                <button class="bg-red-500 hover:bg-red-600 text-white font-black text-xl py-4 px-12 rounded-lg transition duration-300 transform hover:scale-105" onclick="verificarRespuestaConContador(false, '${carta.respuesta}')">Falso</button>
            `;
            respuestaInputContainer.appendChild(vfDiv);
        } else if (carta.alternativas) {
            const opcionesDiv = document.createElement('div');
            opcionesDiv.className = 'space-y-4 mt-6';
            carta.alternativas.forEach(alternativa => {
                const opcion = document.createElement('div');
                opcion.className = 'opcion';
                opcion.textContent = alternativa;
                opcion.onclick = () => verificarRespuestaConContador(alternativa, carta.respuesta);
                opcionesDiv.appendChild(opcion);
            });
            respuestaInputContainer.appendChild(opcionesDiv);
        }
    }

    mazos[tipoMazo].splice(indiceAleatorio, 1);
    actualizarContadores();
    
    // ===== AGREGAR BOTÓN DE SIGUIENTE TURNO PARA COMODINES Y DATOS CURIOSOS =====
    if (tipoMazo === 'comodines' || tipoMazo === 'datos') {
        // Primero, eliminar cualquier botón anterior que pueda existir
        const btnAnterior = document.getElementById('btn-siguiente-turno-externo');
        if (btnAnterior) {
            btnAnterior.remove();
        }
        
        const btnSiguienteTurno = document.createElement('button');
        btnSiguienteTurno.id = 'btn-siguiente-turno-externo';
        btnSiguienteTurno.className = 'btn-siguiente-turno-carta';
        btnSiguienteTurno.innerHTML = '⏭️ Siguiente Turno';
        btnSiguienteTurno.onclick = () => {
            console.log('🎮 Cambio manual de turno desde carta');
            siguienteTurno();
            // Ocultar la carta y el botón después de cambiar turno
            cartaActual.style.display = 'none';
            btnSiguienteTurno.remove();
        };
        
        // Insertar el botón después del elemento carta-actual
        cartaActual.parentNode.insertBefore(btnSiguienteTurno, cartaActual.nextSibling);
    }
    
    // Scroll automático hacia la carta después de un breve delay para que la animación se complete
    setTimeout(() => {
        // Verificar si el elemento es visible en pantalla
        const rect = cartaActual.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        // Solo hacer scroll si la carta no está completamente visible
        if (!isVisible) {
            // Calcular posición con offset para mejor visualización
            const offsetTop = cartaActual.getBoundingClientRect().top + window.pageYOffset - 100; // 100px de margen superior
            
            // Asegurar que no vaya más arriba que el inicio del documento
            const finalPosition = Math.max(0, offsetTop);
            
            window.scrollTo({
                top: finalPosition,
                behavior: 'smooth'
            });
        }
    }, 300); // Delay para permitir que la animación slide-in se complete
}

function verificarRespuestaConContador(respuestaUsuario, respuestaCorrecta) {
    // Prevenir respuestas múltiples
    if (preguntaRespondida) {
        return;
    }
    
    // Marcar pregunta como respondida inmediatamente
    preguntaRespondida = true;
    
    // Detener contador al responder
    detenerContador();
    
    // Convertir la respuesta del usuario a string y normalizarla
    const respuestaUsuarioStr = respuestaUsuario.toString().toLowerCase().trim();
    const respuestaCorrectaStr = respuestaCorrecta.toString().toLowerCase().trim();
    
    // Manejar casos especiales para Verdadero/Falso
    const esCorrecta = (respuestaUsuarioStr === 'true' && respuestaCorrectaStr === 'verdadero') ||
                      (respuestaUsuarioStr === 'false' && respuestaCorrectaStr === 'falso') ||
                      respuestaUsuarioStr === respuestaCorrectaStr;
    
    mostrarRespuesta(respuestaCorrecta, esCorrecta);

    // ===== SISTEMA DE PUNTUACIÓN AUTOMÁTICA =====
    if (esCorrecta && jugadores.length > 0 && turnoActual < jugadores.length) {
        const jugadorActual = jugadores[turnoActual];
        
        // Sumar punto al jugador actual
        if (!puntuaciones[jugadorActual]) {
            puntuaciones[jugadorActual] = 0;
        }
        puntuaciones[jugadorActual]++;
        
        // Actualizar panel
        actualizarPanelJugadores();
        
        // Mostrar mensaje de punto ganado
        setTimeout(() => {
            mostrarMensaje(`🎉 ¡${jugadorActual} ganó 1 punto! Total: ${puntuaciones[jugadorActual]}`, 'success');
            crearEfectosPuntuacion(jugadorActual, '+1', 'positivo');
        }, 1000);
        
        // Verificar si alguien ha ganado (7 puntos)
        setTimeout(() => {
            verificarVictoria();
        }, 1500);
    }

    // Deshabilitar botones después de responder
    document.querySelectorAll('.opcion, .btn-vf, button[onclick*="verificarRespuesta"], button[onclick*="verificarRespuestaConContador"]').forEach(elemento => {
        elemento.style.pointerEvents = 'none';
        
        // Para opciones de texto
        if (elemento.classList.contains('opcion')) {
            if (elemento.textContent === respuestaCorrecta) {
                elemento.classList.add('correcta');
            } else {
                elemento.classList.add('incorrecta');
            }
        }
        
        // Para botones de Verdadero/Falso
        if (elemento.onclick && elemento.onclick.toString().includes('verificarRespuestaConContador')) {
            const esVerdadero = elemento.textContent.toLowerCase().includes('verdadero');
            const esFalso = elemento.textContent.toLowerCase().includes('falso');
            const respuestaCorrectaLower = respuestaCorrecta.toLowerCase();
            
            if ((esVerdadero && respuestaCorrectaLower === 'verdadero') || 
                (esFalso && respuestaCorrectaLower === 'falso')) {
                elemento.classList.add('correcta');
            } else if (esVerdadero || esFalso) {
                elemento.classList.add('incorrecta');
            }
        }
    });

    // ===== CAMBIO AUTOMÁTICO AL SIGUIENTE TURNO DESPUÉS DE RESPONDER =====
    setTimeout(() => {
        console.log('🎮 Cambio automático de turno después de responder pregunta');
        siguienteTurno();
        // Ocultar la carta después de cambiar turno
        const cartaActual = document.getElementById('carta-actual');
        cartaActual.style.display = 'none';
    }, 3000); // 3 segundos para que el jugador vea el resultado
}

// Cargar los mazos cuando se inicie la página
cargarMazos();

// Sistema de jugadores y turnos
let jugadores = [];
let turnoActual = 0;
let puntuaciones = {}; // Nuevo sistema de puntuaciones

// Sistema de inventario de comodines para cada jugador
let inventariosComodines = {}; // Almacena el inventario de comodines de cada jugador
let mazoDescartados = []; // Cartas de comodín descartadas que pueden reutilizarse
let orden = 1; // 1 = normal, -1 = reversa (para el efecto reversa)

// Sistema de contador de tiempo
let contadorActivo = false;
let tiempoRestante = 45;
let intervalContador = null;
let tiempoInicialContador = 45;

// Variable para controlar respuestas múltiples
let preguntaRespondida = false;

// Variable para controlar una carta por turno
let cartaSacadaEnTurno = false;

// Variable para controlar si el dado ha sido tirado en el turno actual
let dadoTiradoEnTurno = false;

// Variables para el sistema de prohibición/intercepción de comodines
let comodinEnProceso = null;
let jugadorUsandoComodin = null;
let esperandoProhibicion = false;
let tiempoLimiteProhibicion = null;

// Modal de eliminación
let jugadorAEliminar = null;
let indiceJugadorAEliminar = -1;

// Modal de reordenamiento
let nuevoOrdenJugadores = [];
let ordenOriginal = [];

// Validar nombres de jugadores en tiempo real
function validarJugadores() {
    const inputs = document.querySelectorAll('.jugador-input');
    const jugadoresValidos = [];
    const nombresDuplicados = new Set();
    const nombresVistos = new Set();
    
    // Resetear estilos de todos los inputs
    inputs.forEach(input => {
        input.classList.remove('input-error', 'input-duplicado');
        input.title = '';
    });
    
    // Verificar cada input
    inputs.forEach(input => {
        const nombre = input.value.trim().toLowerCase();
        
        if (nombre.length >= 2) {
            // Verificar si el nombre ya existe
            if (nombresVistos.has(nombre)) {
                nombresDuplicados.add(nombre);
            } else {
                nombresVistos.add(nombre);
                jugadoresValidos.push(input.value.trim()); // Usar valor original con mayúsculas
            }
        }
    });
    
    // Marcar inputs duplicados
    inputs.forEach(input => {
        const nombre = input.value.trim().toLowerCase();
        
        if (nombre.length < 2 && nombre.length > 0) {
            input.classList.add('input-error');
            input.title = 'El nombre debe tener al menos 2 caracteres';
        } else if (nombresDuplicados.has(nombre)) {
            input.classList.add('input-duplicado');
            input.title = 'Este nombre ya está en uso';
        }
    });
    
    const btnIniciar = document.getElementById('btnIniciarJuego');
    const contador = document.getElementById('jugadoresCount');
    
    // Calcular jugadores válidos únicos
    const jugadoresUnicos = jugadoresValidos.length;
    const hayDuplicados = nombresDuplicados.size > 0;
    
    contador.textContent = `${jugadoresUnicos} jugador${jugadoresUnicos !== 1 ? 'es' : ''} válido${jugadoresUnicos !== 1 ? 's' : ''}`;
    
    if (hayDuplicados) {
        contador.textContent += ` (${nombresDuplicados.size} nombre${nombresDuplicados.size !== 1 ? 's' : ''} duplicado${nombresDuplicados.size !== 1 ? 's' : ''})`;
        contador.style.color = '#ff6b6b';
    } else {
        contador.style.color = '';
    }
    
    if (jugadoresUnicos >= 2 && !hayDuplicados) {
        btnIniciar.disabled = false;
        btnIniciar.textContent = '🚀 Iniciar Juego';
        btnIniciar.className = 'btn-iniciar-juego';
    } else {
        btnIniciar.disabled = true;
        if (hayDuplicados) {
            btnIniciar.textContent = '❌ Nombres duplicados detectados';
            btnIniciar.className = 'btn-iniciar-juego error';
        } else {
            btnIniciar.textContent = `Faltan ${2 - jugadoresUnicos} jugador${2 - jugadoresUnicos !== 1 ? 'es' : ''}`;
            btnIniciar.className = 'btn-iniciar-juego';
        }
    }
    
    // Mostrar/ocultar botones de eliminar
    const containers = document.querySelectorAll('.jugador-input-container');
    containers.forEach((container, index) => {
        const btnRemover = container.querySelector('.btn-remove-jugador');
        btnRemover.style.display = containers.length > 2 ? 'block' : 'none';
    });
}

function agregarJugador() {
    const container = document.getElementById('jugadoresContainer');
    const numeroJugador = container.children.length + 1;
    
    if (numeroJugador <= 8) { // Máximo 8 jugadores
        const nuevoJugador = document.createElement('div');
        nuevoJugador.className = 'jugador-input-container';
        nuevoJugador.innerHTML = `
            <input type="text" class="jugador-input" placeholder="Nombre del Jugador ${numeroJugador}" maxlength="20">
            <button type="button" class="btn-remove-jugador" onclick="removerJugador(this)">×</button>
        `;
        
        container.appendChild(nuevoJugador);
        
        // Añadir evento de validación al nuevo input
        const nuevoInput = nuevoJugador.querySelector('.jugador-input');
        nuevoInput.addEventListener('input', validarJugadores);
        
        validarJugadores();
        
        // Enfocar el nuevo input
        nuevoInput.focus();
    }
}

function removerJugador(boton) {
    const container = boton.closest('.jugador-input-container');
    container.remove();
    
    // Reordenar placeholders
    const inputs = document.querySelectorAll('.jugador-input');
    inputs.forEach((input, index) => {
        input.placeholder = `Nombre del Jugador ${index + 1}`;
    });
    
    validarJugadores();
}

function iniciarJuego() {
    const inputs = document.querySelectorAll('.jugador-input');
    jugadores = [];
    
    inputs.forEach(input => {
        const nombre = input.value.trim();
        if (nombre.length >= 2) {
            jugadores.push(nombre);
        }
    });
    
    if (jugadores.length >= 2) {
        // Ocultar popup de configuración
        document.getElementById('configOverlay').style.display = 'none';
        
        // Mezclar jugadores aleatoriamente
        mezclarJugadores();
        
        // Mostrar pantalla de orden aleatorio
        mostrarOrdenAleatorio();
    }
}

// Función para mezclar array aleatoriamente (algoritmo Fisher-Yates)
function mezclarJugadores() {
    for (let i = jugadores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [jugadores[i], jugadores[j]] = [jugadores[j], jugadores[i]];
    }
}

function mostrarOrdenAleatorio() {
    const overlay = document.getElementById('ordenOverlay');
    const listaOrden = document.getElementById('listaOrden');
    
    // Limpiar lista
    listaOrden.innerHTML = '';
    
    // Crear elementos para cada jugador
    jugadores.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = 'jugador-orden';
        item.innerHTML = `
            <span class="numero-orden">${index + 1}</span>
            <span>${jugador}</span>
        `;
        listaOrden.appendChild(item);
    });
    
    // Mostrar overlay
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function reordenarJugadores() {
    mezclarJugadores();
    mostrarOrdenAleatorio();
}

function confirmarOrden() {
    // Ocultar pantalla de orden
    document.getElementById('ordenOverlay').style.display = 'none';
    
    // Mostrar panel de jugadores
    document.getElementById('panelJugadores').style.display = 'block';
    
    // Inicializar el juego
    actualizarPanelJugadores();
    turnoActual = 0;
    actualizarTurnoActual();
    
    // Mostrar popup del primer turno
    mostrarPopupTurno();
    
    // Permitir scroll en el body
    document.body.style.overflow = 'auto';
}

// Función para dar comodines iniciales de prueba (eliminar en producción)
function darComodinesIniciales() {
    // Solo dar comodines si hay comodines disponibles en el mazo
    if (mazos.comodines.length === 0) return;
    
    jugadores.forEach(nombreJugador => {
        // Dar 2-3 comodines aleatorios a cada jugador para pruebas
        const cantidadComodines = Math.floor(Math.random() * 2) + 2; // 2 o 3 comodines
        
        for (let i = 0; i < cantidadComodines && mazos.comodines.length > 0; i++) {
            const indiceAleatorio = Math.floor(Math.random() * mazos.comodines.length);
            const comodin = mazos.comodines.splice(indiceAleatorio, 1)[0];
            
            if (!inventariosComodines[nombreJugador]) {
                inventariosComodines[nombreJugador] = [];
            }
            inventariosComodines[nombreJugador].push(comodin);
        }
    });
    
    // Actualizar contadores de cartas
    actualizarContadores();
    
    // Mostrar mensaje informativo
    mostrarMensaje('¡Cada jugador recibió comodines iniciales para empezar! 🃏', 'info');
}

function actualizarPanelJugadores() {
    const listaJugadores = document.getElementById('listaJugadores');
    listaJugadores.innerHTML = '';
    
    // Inicializar puntuaciones si no existen
    jugadores.forEach(jugador => {
        if (puntuaciones[jugador] === undefined) {
            puntuaciones[jugador] = 0;
        }
        // Inicializar inventario de comodines si no existe
        if (inventariosComodines[jugador] === undefined) {
            inventariosComodines[jugador] = [];
        }
    });
    
    // Ordenar jugadores por puntuación para mostrar ranking
    const jugadoresOrdenados = [...jugadores].map((jugador, index) => ({
        nombre: jugador,
        indiceOriginal: index,
        puntuacion: puntuaciones[jugador] || 0
    })).sort((a, b) => b.puntuacion - a.puntuacion);

    jugadoresOrdenados.forEach((jugadorData, rankingIndex) => {
        const { nombre, indiceOriginal, puntuacion } = jugadorData;
        
        // Generar colores únicos para cada jugador basados en su índice original
        const colores = [
            '667eea', '764ba2', '4ecdc4', '44a08d', 'ff6b6b', 
            'ee5a24', 'ffa500', 'ff1744', '9c27b0', '673ab7',
            '3f51b5', '2196f3', '00bcd4', '009688', '4caf50'
        ];
        const colorFondo = colores[indiceOriginal % colores.length];
        
        // Crear URL de UI Avatars
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=${colorFondo}&color=fff&size=90&bold=true&format=png`;
        
        // Determinar medalla según ranking
        let medallaIcono = '';
        let medallaClass = '';
        if (rankingIndex === 0 && puntuacion > 0) {
            medallaIcono = '🥇';
            medallaClass = 'primer-lugar';
        } else if (rankingIndex === 1 && puntuacion > 0) {
            medallaIcono = '🥈';
            medallaClass = 'segundo-lugar';
        } else if (rankingIndex === 2 && puntuacion > 0) {
            medallaIcono = '🥉';
            medallaClass = 'tercer-lugar';
        }
        
        const item = document.createElement('div');
        item.className = `jugador-item ${medallaClass}`;
        if (indiceOriginal === turnoActual) {
            item.classList.add('activo');
        }
        
        item.innerHTML = `
            <img src="${avatarUrl}" alt="${nombre}" class="jugador-avatar" />
            <div class="jugador-info">
                <div class="jugador-nombre">
                    ${medallaIcono} ${nombre}
                </div>
                <div class="jugador-puntuacion">
                    💎 ${puntuacion} ${puntuacion === 1 ? 'punto' : 'puntos'}
                </div>
                <div class="comodines-inventario">
                    ${generarVisualizacionComodines(nombre)}
                </div>
            </div>
            <div class="jugador-ranking">#${rankingIndex + 1}</div>
            <button class="btn-remover-jugador" onclick="removerJugadorEnPartida(${indiceOriginal})" title="Eliminar jugador">×</button>
        `;
        item.id = `jugador-${indiceOriginal}`;
        listaJugadores.appendChild(item);
    });
}

// Función para generar la visualización de comodines en miniatura
function generarVisualizacionComodines(nombreJugador) {
    const inventario = inventariosComodines[nombreJugador] || [];
    
    if (inventario.length === 0) {
        return '<div class="sin-comodines">🃏 Sin comodines</div>';
    }
    
    // Contabilizar comodines por tipo
    const conteoComodines = {};
    const comodinesPorTipo = {};
    inventario.forEach(comodin => {
        const tipo = comodin.nombre.toLowerCase();
        conteoComodines[tipo] = (conteoComodines[tipo] || 0) + 1;
        if (!comodinesPorTipo[tipo]) {
            comodinesPorTipo[tipo] = comodin; // Guardar una instancia para mostrar detalles
        }
    });
    
    // Crear representación visual en miniatura
    let visualizacion = '<div class="comodines-lista">';
    
    Object.entries(conteoComodines).forEach(([tipo, cantidad]) => {
        const icono = obtenerIconoComodin(tipo);
        const comodinData = comodinesPorTipo[tipo];
        
        visualizacion += `
            <div class="comodin-miniatura" title="${tipo}" onclick="mostrarComodinVisualizacion('${nombreJugador}', '${tipo}')">
                <span class="comodin-icono">${icono}</span>
                ${cantidad > 1 ? `<span class="comodin-cantidad">${cantidad}</span>` : ''}
            </div>
        `;
    });
    
    visualizacion += '</div>';
    return visualizacion;
}

// Función para obtener el ícono según el tipo de comodín
function obtenerIconoComodin(tipo) {
    const iconos = {
        '¡no!,¡te lo prohíbo!': '🚫',
        '¡ganas un punto gratis!': '⭐',
        '¡resta un punto a un contrincante!': '💥',
        '¡reversa!': '🔄',
        '¡eres un ladrón de comodines!': '🦹',
        'escapa de la cárcel': '🔓',
        'construyendo el comodín': '🔨'
    };
    
    return iconos[tipo] || '🃏';
}

function confirmarNuevoJugador() {
    // Implementar lógica para confirmar nuevo jugador
}

function mostrarMensajeValidacion(texto, tipo) {
    const mensaje = document.getElementById('mensajeValidacion');
    mensaje.textContent = texto;
    mensaje.className = `mensaje-validacion ${tipo} show`;
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        mensaje.className = 'mensaje-validacion';
    }, 3000);
}

function validarInputNuevoJugador() {
    const nombreInput = document.getElementById('nombreNuevoJugador');
    const btnAgregar = document.getElementById('btnAgregarJugador');
    const container = document.getElementById('inputContainer');
    
    const nombre = nombreInput.value.trim();
    
    if (nombre.length >= 2 && !jugadores.includes(nombre) && jugadores.length < 8) {
        btnAgregar.disabled = false;
        container.classList.add('focused');
    } else {
        btnAgregar.disabled = true;
        container.classList.remove('focused');
    }
}

// Gestión de jugadores durante la partida (funciones obsoletas eliminadas)
function mostrarAgregarJugador() {
    // Función eliminada - ahora el input siempre está visible
}

function cancelarNuevoJugador() {
    // Función eliminada - ahora no hay botón cancelar
}

function removerJugadorEnPartida(index) {
    if (jugadores.length <= 2) {
        mostrarMensaje('Debe haber al menos 2 jugadores', 'error');
        return;
    }
    
    // Guardar información del jugador a eliminar
    jugadorAEliminar = jugadores[index];
    indiceJugadorAEliminar = index;
    
    // Mostrar modal de confirmación
    mostrarModalEliminar();
}

function reordenarEnPartida() {
    if (jugadores.length < 2) {
        mostrarMensaje('Necesitas al menos 2 jugadores para reordenar', 'error');
        return;
    }
    
    // Guardar orden original
    ordenOriginal = [...jugadores];
    
    // Generar nuevo orden
    generarNuevoOrdenInicial();
    
    // Mostrar modal de confirmación
    mostrarModalReordenar();
}

function siguienteTurno() {
    console.log('🎮 DEBUG siguienteTurno(): INICIANDO función');
    
    // Resetear estado del dado
    dadoTiradoEnTurno = false;
    
    // Deshabilitar acciones del juego hasta que se tire el dado
    deshabilitarAccionesJuego();
    
    // Reanudar turno (permitir sacar una nueva carta)
    reanudarTurno();
    
    // Validar que hay jugadores
    if (jugadores.length === 0) {
        console.log('🎮 DEBUG siguienteTurno(): ERROR - No hay jugadores');
        mostrarMensaje('No hay jugadores en el juego', 'error');
        return;
    }
    
    console.log('🎮 DEBUG siguienteTurno(): Turno actual ANTES del cambio:', turnoActual);
    console.log('🎮 DEBUG siguienteTurno(): Jugador actual ANTES del cambio:', jugadores[turnoActual]);
    console.log('🎮 DEBUG siguienteTurno(): Total de jugadores:', jugadores.length);
    
    // Avanzar al siguiente turno con módulo para ciclar
    turnoActual = (turnoActual + 1) % jugadores.length;
    
    console.log('🎮 DEBUG siguienteTurno(): Turno actual DESPUÉS del cambio:', turnoActual);
    console.log('🎮 DEBUG siguienteTurno(): Jugador actual DESPUÉS del cambio:', jugadores[turnoActual]);
    
    // Actualizar UI
    console.log('🎮 DEBUG siguienteTurno(): Llamando actualizarTurnoActual()');
    actualizarTurnoActual();
    
    console.log('🎮 DEBUG siguienteTurno(): Llamando mostrarPopupTurno()');
    mostrarPopupTurno();
    
    // Mostrar mensaje para tirar el dado
    mostrarMensaje('🎲 ¡Tira el dado para comenzar tu turno!', 'info');
    
    console.log('🎮 DEBUG siguienteTurno(): FINALIZANDO función');
}

function actualizarTurnoActual() {
    // Validar que turnoActual esté en rango válido
    if (turnoActual >= jugadores.length) {
        turnoActual = 0;
    }
    if (turnoActual < 0) {
        turnoActual = 0;
    }
    
    // Validar que hay jugadores
    if (jugadores.length === 0) {
        return;
    }
    
    const jugadorActual = document.getElementById('jugadorActual');
    const turnoActualDiv = document.getElementById('turnoActual');
    
    // Actualizar elementos del DOM solo si existen
    if (jugadorActual) {
        jugadorActual.textContent = jugadores[turnoActual];
    }
    
    if (turnoActualDiv) {
        turnoActualDiv.innerHTML = `
            🎯 Turno #${turnoActual + 1}: <span id="jugadorActual">${jugadores[turnoActual]}</span>
        `;
    }
    
    // Actualizar estilos de jugadores
    document.querySelectorAll('.jugador-item').forEach((item, index) => {
        if (index === turnoActual) {
            item.classList.add('activo');
        } else {
            item.classList.remove('activo');
        }
    });
}

// Función para mostrar mensajes temporales
function mostrarMensaje(texto, tipo = 'info') {
    const mensaje = document.createElement('div');
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        animation: slideDown 0.3s ease-out;
    `;
    
    switch(tipo) {
        case 'success':
            mensaje.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
            break;
        case 'error':
            mensaje.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            break;
        default:
            mensaje.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    mensaje.textContent = texto;
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        mensaje.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(() => mensaje.remove(), 300);
    }, 3000);
}

// Añadir evento Enter al input de nuevo jugador
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.jugador-input');
    inputs.forEach(input => {
        input.addEventListener('input', validarJugadores);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!document.getElementById('btnIniciarJuego').disabled) {
                    iniciarJuego();
                }
            }
        });
    });
    
    // Eventos para input de nuevo jugador
    const inputNuevo = document.getElementById('nombreNuevoJugador');
    const containerNuevo = document.getElementById('inputContainer');
    
    if (inputNuevo && containerNuevo) {
        // Validación en tiempo real
        inputNuevo.addEventListener('input', validarInputNuevoJugador);
        
        // Enter para agregar
        inputNuevo.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!document.getElementById('btnAgregarJugador').disabled) {
                    agregarNuevoJugador();
                }
            }
        });
        
        // Efectos de focus
        inputNuevo.addEventListener('focus', function() {
            containerNuevo.classList.add('focused');
        });
        
        inputNuevo.addEventListener('blur', function() {
            if (inputNuevo.value.trim().length === 0) {
                containerNuevo.classList.remove('focused');
            }
        });
        
        // Validación inicial
        validarInputNuevoJugador();
    }
    
    // Bloquear scroll inicial
    document.body.style.overflow = 'hidden';
});

// Funcionalidad del popup del dado
function abrirPopupDado() {
    const overlay = document.getElementById('dadoPopupOverlay');
    if (!overlay) {
        console.error('❌ No se encontró el elemento dadoPopupOverlay');
        return;
    }
    
    // Resetear el dado antes de mostrar
    const cube = document.getElementById('dadoCube');
    const numero = document.getElementById('numeroDadoPopup');
    
    if (cube && numero) {
        cube.classList.remove('lanzando');
        numero.textContent = '🎲';
        cube.style.background = 'linear-gradient(145deg, #ffffff, #f0f0f0)';
        cube.style.color = '#333';
        cube.style.animation = '';
    }
    
    // Mostrar el popup
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Lanzar el dado automáticamente después de un pequeño retraso
    // para que se vea bien la transición del popup
    setTimeout(() => {
        lanzarDadoPopup();
    }, 500); // Aumento el delay para mejor experiencia visual
}

function cerrarPopupDado() {
    const overlay = document.getElementById('dadoPopupOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function lanzarDadoPopup() {
    const dadoCube = document.getElementById('dadoCube');
    const numeroDado = document.getElementById('numeroDadoPopup');
    
    if (!dadoCube || !numeroDado) {
        console.error('❌ Elementos del dado no encontrados');
        return;
    }
    
    // Evitar múltiples clics mientras se está lanzando
    if (dadoCube.classList.contains('lanzando')) {
        return;
    }
    
    // Generar el número final UNA SOLA VEZ
    const numeroFinal = Math.floor(Math.random() * 6) + 1;
    
    // Añadir clase de animación
    dadoCube.classList.add('lanzando');
    
    // Mostrar símbolo de lanzamiento
    numeroDado.textContent = '✨';
    
    // Crear partículas de explosión
    crearParticulas(dadoCube);
    
    // Después de la animación, mostrar resultado final
    setTimeout(() => {
        numeroDado.textContent = numeroFinal;
        
        // Resetear estilos del dado
        dadoCube.style.background = 'linear-gradient(145deg, #ffffff, #f0f0f0)';
        dadoCube.style.color = '#333';
        
        // Efecto especial según el número
        if (numeroFinal === 6) {
            dadoCube.style.background = 'linear-gradient(135deg, #ffd700, #ffed4e)';
            dadoCube.style.color = '#333';
            crearConfetti();
        } else if (numeroFinal === 1) {
            dadoCube.style.background = 'rgba(255, 107, 107, 0.3)';
            dadoCube.style.color = 'white';
        }
        
        // Remover clase de animación
        dadoCube.classList.remove('lanzando');
        
        // Efecto de shake en el dado
        setTimeout(() => {
            dadoCube.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                dadoCube.style.animation = '';
                
                // Marcar que el dado ha sido tirado en este turno
                dadoTiradoEnTurno = true;
                
                // Habilitar acciones del juego
                habilitarAccionesJuego();
                
                // Mostrar mensaje de éxito
                mostrarMensaje('¡Dado tirado! Puedes continuar con tu turno.', 'success');
                
                // Cerrar el popup del dado después de un breve delay
                setTimeout(() => {
                    cerrarPopupDado();
                }, 4000);
            }, 500);
        }, 200);
        
    }, 1500);
}

function crearParticulas(elemento) {
    const rect = elemento.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particula = document.createElement('div');
        particula.className = 'particle';
        particula.style.left = centerX + 'px';
        particula.style.top = centerY + 'px';
        
        const angulo = (i / 12) * 2 * Math.PI;
        const velocidad = 100 + Math.random() * 50;
        const deltaX = Math.cos(angulo) * velocidad;
        const deltaY = Math.sin(angulo) * velocidad;
        
        particula.style.setProperty('--deltaX', deltaX + 'px');
        particula.style.setProperty('--deltaY', deltaY + 'px');
        
        document.body.appendChild(particula);
        
        setTimeout(() => {
            particula.remove();
        }, 1000);
    }
}

function crearConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Cerrar popup al hacer clic en el overlay
document.getElementById('dadoPopupOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarPopupDado();
    }
});

// Funciones para el popup de turno
function mostrarPopupTurno() {
    // Validar que hay jugadores
    if (jugadores.length === 0) {
        mostrarMensaje('No hay jugadores en el juego', 'error');
        return;
    }
    
    // Validar que turnoActual esté en rango
    if (turnoActual >= jugadores.length) {
        turnoActual = 0;
    }
    
    const overlay = document.getElementById('turnoPopupOverlay');
    const numero = document.getElementById('turnoPopupNumero');
    const jugador = document.getElementById('turnoPopupJugador');
    const mensaje = document.getElementById('turnoPopupMensaje');
    
    // Verificar que los elementos existen
    if (!overlay || !numero || !jugador || !mensaje) {
        console.error('Elementos del popup de turno no encontrados');
        return;
    }
    
    // Actualizar contenido del popup
    numero.textContent = turnoActual + 1;
    const nombreJugadorActual = jugadores[turnoActual];
    jugador.textContent = nombreJugadorActual;
    
    // Mensajes variados para hacer más dinámico
    const mensajes = [
        '¡Es tu momento de brillar!',
        '¡Demuestra tu conocimiento!',
        '¡Vamos, que puedes con esto!',
        '¡Tu turno para ganar!',
        '¡Hora de demostrar lo que sabes!',
        '¡Dale que va tu turno!',
        '¡A por todas!'
    ];
    
    mensaje.textContent = mensajes[Math.floor(Math.random() * mensajes.length)];
    
    // Cargar comodines del jugador actual
    cargarComodinesEnPopup(nombreJugadorActual);
    
    // Mostrar popup con efectos
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Crear efectos de brillo
    crearEfectosBrillo();
}

// Función para cargar los comodines del jugador en el popup
function cargarComodinesEnPopup(nombreJugador) {
    const listaComodines = document.getElementById('popupComodinesLista');
    const inventario = inventariosComodines[nombreJugador] || [];
    
    if (inventario.length === 0) {
        listaComodines.innerHTML = `
            <div class="popup-sin-comodines">
                🃏 No tienes comodines disponibles
            </div>
        `;
        return;
    }
    
    // Agrupar comodines por tipo para mostrar cantidad
    const comodinesAgrupados = {};
    inventario.forEach(comodin => {
        const key = comodin.nombre.toLowerCase();
        if (!comodinesAgrupados[key]) {
            comodinesAgrupados[key] = {
                carta: comodin,
                cantidad: 0
            };
        }
        comodinesAgrupados[key].cantidad++;
    });
    
    // Crear elementos HTML para cada tipo de comodín
    listaComodines.innerHTML = '';
    Object.entries(comodinesAgrupados).forEach(([tipo, data]) => {
        const comodinElement = document.createElement('div');
        comodinElement.className = 'popup-comodin';
        comodinElement.onclick = () => usarComodin(data.carta, nombreJugador);
        
        const icono = obtenerIconoComodin(tipo);
        const nombreSimplificado = simplificarNombreComodin(data.carta.nombre);
        
        comodinElement.innerHTML = `
            <div class="popup-comodin-icono">${icono}</div>
            <div class="popup-comodin-nombre">${nombreSimplificado}</div>
            ${data.cantidad > 1 ? `<div class="comodin-cantidad">${data.cantidad}</div>` : ''}
        `;
        
        listaComodines.appendChild(comodinElement);
    });
}

// Función para simplificar nombres de comodines para la UI
function simplificarNombreComodin(nombre) {
    const nombres = {
        '¡NO!,¡TE LO PROHÍBO!': 'Prohibir',
        '¡ganas un punto gratis!': 'Punto Gratis',
        '¡resta un punto a un contrincante!': 'Restar Punto',
        '¡reversa!': 'Reversa',
        '¡eres un ladrón de comodines!': 'Ladrón',
        'ESCAPA DE LA CÁRCEL': 'Escapar',
        'construyendo el comodín': 'Construir'
    };
    
    return nombres[nombre] || nombre;
}

// Función para continuar sin usar comodín
function continuarSinComodin() {
    // Cerrar popup de turno
    cerrarPopupTurno();
    
    // Pequeño delay para que se cierre suavemente el popup de turno
    setTimeout(() => {
        // Abrir popup del dado automáticamente
        abrirPopupDado();
    }, 300);
}

function cerrarPopupTurno() {
    const overlay = document.getElementById('turnoPopupOverlay');
    
    // Animación de salida
    const popup = overlay.querySelector('.turno-popup');
    popup.style.animation = 'turnoPopupExit 0.3s ease-out forwards';
    
    setTimeout(() => {
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        popup.style.animation = '';
    }, 300);
}

function saltarTurno() {
    cerrarPopupTurno();
    setTimeout(() => {
        siguienteTurno();
    }, 300);
}

function crearEfectosBrillo() {
    const popup = document.querySelector('.turno-popup');
    
    // Verificar que el popup existe
    if (!popup) return;
    
    // Limpiar efectos anteriores
    popup.querySelectorAll('.turno-popup-sparkle').forEach(el => el.remove());
    
    // Crear múltiples efectos de brillo
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'turno-popup-sparkle';
        
        // Posición aleatoria
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        
        // Delay aleatorio para la animación
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        
        popup.appendChild(sparkle);
        
        // Remover después de la animación
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 4000);
    }
}

// Cerrar popup al hacer clic en el overlay
document.addEventListener('click', function(e) {
    if (e.target.id === 'turnoPopupOverlay') {
        cerrarPopupTurno();
    }
});

// Cerrar popup con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('turnoPopupOverlay').classList.contains('show')) {
        cerrarPopupTurno();
    }
});

// ========== SISTEMA DE CONTADOR DE TIEMPO ==========

function iniciarContador() {
    if (contadorActivo) {
        detenerContador();
    }
    
    contadorActivo = true;
    tiempoRestante = tiempoInicialContador;
    
    // Mostrar contador
    const contador = document.getElementById('contadorTiempo');
    contador.classList.add('show');
    
    // Actualizar display inicial
    actualizarDisplayContador();
    
    // Iniciar intervalo
    intervalContador = setInterval(() => {
        if (contadorActivo) {
            tiempoRestante--;
            actualizarDisplayContador();
            
            if (tiempoRestante <= 0) {
                tiempoAgotado();
            }
        }
    }, 1000);
}

function detenerContador() {
    contadorActivo = false;
    
    if (intervalContador) {
        clearInterval(intervalContador);
        intervalContador = null;
    }
    
    // Ocultar contador
    const contador = document.getElementById('contadorTiempo');
    contador.classList.remove('show');
    
    // Resetear display
    tiempoRestante = tiempoInicialContador;
    actualizarDisplayContador();
}

function pausarContador() {
    // Función eliminada - ya no se necesita pausa
}

function reanudarContador() {
    // Función eliminada - ya no se necesita pausa
}

function togglePausarContador() {
    // Función eliminada - ya no se necesita pausa
}

function actualizarDisplayContador() {
    const numeroEl = document.getElementById('contadorNumero');
    const circuloEl = document.getElementById('contadorCirculo');
    const contadorEl = document.getElementById('contadorTiempo');
    
    // Actualizar número
    numeroEl.textContent = tiempoRestante;
    
    // Calcular progreso (360 grados total)
    const progreso = ((tiempoInicialContador - tiempoRestante) / tiempoInicialContador) * 360;
    circuloEl.style.setProperty('--progress', `${progreso}deg`);
    
    // Cambiar estados visuales según el tiempo
    circuloEl.className = 'contador-circulo';
    contadorEl.className = 'contador-tiempo show';
    
    if (tiempoRestante > 20) {
        circuloEl.classList.add('normal');
    } else if (tiempoRestante > 10) {
        circuloEl.classList.add('warning');
        contadorEl.classList.add('warning');
    } else if (tiempoRestante > 0) {
        circuloEl.classList.add('danger');
        contadorEl.classList.add('danger');
    } else {
        contadorEl.classList.add('expired');
    }
}

function tiempoAgotado() {
    // Marcar pregunta como respondida para evitar respuestas después del tiempo agotado
    preguntaRespondida = true;
    
    detenerContador();
    
    // Mostrar mensaje
    mostrarMensaje('⏰ ¡Tiempo agotado! Respuesta incorrecta', 'error');
    
    // Mostrar respuesta automáticamente
    const respuestaDiv = document.querySelector('.respuesta');
    if (respuestaDiv) {
        // Buscar la respuesta en la carta actual
        const cartaActual = window.cartaActualData;
        if (cartaActual && cartaActual.respuesta) {
            respuestaDiv.textContent = 'Tiempo agotado';
            respuestaDiv.className = 'respuesta mt-6 p-4 rounded-lg bg-red-100 text-red-800';
            respuestaDiv.style.display = 'block';
            
            const respuestaCorrectaDiv = document.createElement('div');
            respuestaCorrectaDiv.className = 'mt-2 text-sm italic text-gray-600';
            respuestaCorrectaDiv.textContent = `La respuesta correcta era: ${cartaActual.respuesta}`;
            respuestaDiv.appendChild(respuestaCorrectaDiv);
        }
    }
    
    // Deshabilitar interacciones
    deshabilitarInteracciones();
    
    // ===== CAMBIO AUTOMÁTICO AL SIGUIENTE TURNO CUANDO SE AGOTA EL TIEMPO =====
    setTimeout(() => {
        console.log('🎮 Cambio automático de turno por tiempo agotado');
        siguienteTurno();
        // Ocultar la carta después de cambiar turno
        const cartaActual = document.getElementById('carta-actual');
        cartaActual.style.display = 'none';
    }, 3000); // 3 segundos para que el jugador vea la respuesta correcta
}

function deshabilitarInteracciones() {
    // Deshabilitar botones y opciones
    document.querySelectorAll('.opcion, .btn-respuesta, button[onclick*="verificarRespuesta"], button[onclick*="verificarRespuestaConContador"]').forEach(elemento => {
        elemento.style.pointerEvents = 'none';
        elemento.style.opacity = '0.5';
    });
}

function habilitarInteracciones() {
    // Rehabilitar botones y opciones
    document.querySelectorAll('.opcion, .btn-respuesta, button[onclick*="verificarRespuesta"]').forEach(elemento => {
        elemento.style.pointerEvents = 'auto';
        elemento.style.opacity = '1';
    });
}

// ========== SISTEMA DE MODAL DE ELIMINACIÓN ==========

function mostrarModalEliminar() {
    const overlay = document.getElementById('modalEliminarOverlay');
    const nombre1 = document.getElementById('modalJugadorNombre');
    const nombre2 = document.getElementById('modalJugadorNombre2');
    
    // Configurar nombres
    nombre1.textContent = jugadorAEliminar;
    nombre2.textContent = jugadorAEliminar;
    
    // Mostrar paso 1
    document.getElementById('modalPaso1').style.display = 'block';
    document.getElementById('modalPaso2').style.display = 'none';
    
    // Mostrar modal
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Efecto de partículas de advertencia
    setTimeout(() => {
        crearParticulasAdvertencia();
    }, 500);
}

function cerrarModalEliminar() {
    const overlay = document.getElementById('modalEliminarOverlay');
    
    // Animación de salida
    const modal = overlay.querySelector('.modal-eliminar');
    modal.style.transform = 'scale(0.8) translateY(50px)';
    modal.style.opacity = '0.5';
    
    setTimeout(() => {
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Resetear variables
        jugadorAEliminar = null;
        indiceJugadorAEliminar = -1;
        
        // Resetear modal
        modal.style.transform = '';
        modal.style.opacity = '';
    }, 300);
}

function mostrarPaso2() {
    // Ocultar paso 1
    document.getElementById('modalPaso1').style.display = 'none';
    
    // Mostrar paso 2 con animación
    const paso2 = document.getElementById('modalPaso2');
    paso2.style.display = 'block';
    paso2.style.opacity = '0';
    paso2.style.transform = 'translateY(30px)';
    
    // Aplicar transición suave
    setTimeout(() => {
        paso2.style.transition = 'all 0.4s ease';
        paso2.style.opacity = '1';
        paso2.style.transform = 'translateY(0)';
    }, 50);
    
    // Crear más partículas de advertencia
    setTimeout(() => {
        crearParticulasAdvertencia();
    }, 200);
}

function confirmarEliminarJugador() {
    if (indiceJugadorAEliminar === -1 || !jugadorAEliminar) {
        cerrarModalEliminar();
        return;
    }
    
    const index = indiceJugadorAEliminar;
    const nombreEliminado = jugadorAEliminar;
    
    // Ajustar el turno actual según el jugador eliminado
    if (index < turnoActual) {
        // Si eliminamos un jugador antes del turno actual, decrementar turno
        turnoActual = turnoActual - 1;
    } else if (index === turnoActual) {
        // Si eliminamos al jugador actual, mantener el mismo índice
        // (el siguiente jugador tomará ese índice)
        // No cambiar turnoActual, pero verificar que no exceda el límite
    }
    // Si index > turnoActual, no afecta el turno actual
    
    // Remover jugador
    jugadores.splice(index, 1);
    
    // Asegurar que turnoActual esté dentro del rango válido
    if (turnoActual >= jugadores.length) {
        turnoActual = 0; // Volver al primer jugador
    }
    
    // Si turnoActual es negativo (no debería pasar, pero por seguridad)
    if (turnoActual < 0) {
        turnoActual = 0;
    }
    
    // Cerrar modal
    cerrarModalEliminar();
    
    // Actualizar panel
    actualizarPanelJugadores();
    actualizarTurnoActual();
    
    // Mostrar mensaje de confirmación
    mostrarMensaje(`${nombreEliminado} ha sido eliminado del juego`, 'info');
    
    // Efecto de confetti negativo (partículas rojas)
    crearConfettiEliminacion();
}

function crearParticulasAdvertencia() {
    const modal = document.querySelector('.modal-eliminar');
    if (!modal) return;
    
    const rect = modal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particula = document.createElement('div');
        particula.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: #ff6b6b;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10003;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        const angulo = (i / 8) * 2 * Math.PI;
        const velocidad = 80 + Math.random() * 40;
        const deltaX = Math.cos(angulo) * velocidad;
        const deltaY = Math.sin(angulo) * velocidad;
        
        particula.style.animation = `particulaAdvertencia 1.5s ease-out forwards`;
        particula.style.setProperty('--deltaX', deltaX + 'px');
        particula.style.setProperty('--deltaY', deltaY + 'px');
        
        document.body.appendChild(particula);
        
        setTimeout(() => {
            if (particula.parentNode) {
                particula.remove();
            }
        }, 1500);
    }
}

function crearConfettiEliminacion() {
    const colors = ['#ff6b6b', '#ee5a24', '#d63031', '#b91c1c'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
}

// Cerrar modal al hacer clic en el overlay
document.addEventListener('click', function(e) {
    if (e.target.id === 'modalEliminarOverlay') {
        cerrarModalEliminar();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('modalEliminarOverlay').classList.contains('show')) {
        cerrarModalEliminar();
    }
});

// ========== SISTEMA DE MODAL DE REORDENAMIENTO ==========

function generarNuevoOrdenInicial() {
    // Crear copia y mezclar
    nuevoOrdenJugadores = [...jugadores];
    
    // Mezclar usando algoritmo Fisher-Yates
    for (let i = nuevoOrdenJugadores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nuevoOrdenJugadores[i], nuevoOrdenJugadores[j]] = [nuevoOrdenJugadores[j], nuevoOrdenJugadores[i]];
    }
}

function mostrarModalReordenar() {
    const overlay = document.getElementById('modalReordenarOverlay');
    
    // Mostrar paso 1
    document.getElementById('modalReordenarPaso1').style.display = 'block';
    document.getElementById('modalReordenarPaso2').style.display = 'none';
    
    // Llenar comparación de órdenes
    llenarComparacionOrdenes();
    
    // Mostrar modal
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Efecto de partículas
    setTimeout(() => {
        crearParticulasReordenamiento();
    }, 500);
}

function cerrarModalReordenar() {
    const overlay = document.getElementById('modalReordenarOverlay');
    
    // Animación de salida
    const modal = overlay.querySelector('.modal-reordenar');
    modal.style.transform = 'scale(0.8) translateY(50px)';
    modal.style.opacity = '0.5';
    
    setTimeout(() => {
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Resetear variables
        nuevoOrdenJugadores = [];
        ordenOriginal = [];
        
        // Resetear modal
        modal.style.transform = '';
        modal.style.opacity = '';
    }, 300);
}

function llenarComparacionOrdenes() {
    const ordenActualLista = document.getElementById('ordenActualLista');
    const ordenNuevoLista = document.getElementById('ordenNuevoLista');
    
    // Limpiar listas
    ordenActualLista.innerHTML = '';
    ordenNuevoLista.innerHTML = '';
    
    // Llenar orden actual
    ordenOriginal.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = 'orden-item';
        item.innerHTML = `
            <span class="orden-numero">${index + 1}</span>
            <span>${jugador}</span>
        `;
        if (index === turnoActual) {
            item.style.background = 'rgba(78, 205, 196, 0.2)';
            item.style.fontWeight = '700';
        }
        ordenActualLista.appendChild(item);
    });
    
    // Llenar nuevo orden
    nuevoOrdenJugadores.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = 'orden-item';
        item.innerHTML = `
            <span class="orden-numero">${index + 1}</span>
            <span>${jugador}</span>
        `;
        ordenNuevoLista.appendChild(item);
    });
}

function generarNuevoOrden() {
    // Generar nuevo orden aleatorio
    generarNuevoOrdenInicial();
    
    // Actualizar vista
    llenarComparacionOrdenes();
    
    // Efecto visual en el botón
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '🎲 ¡Mezclando!';
    btn.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
    
    // Crear efecto de partículas
    crearParticulasReordenamiento();
}

function mostrarPaso2Reordenar() {
    // Ocultar paso 1
    document.getElementById('modalReordenarPaso1').style.display = 'none';
    
    // Mostrar paso 2 con animación
    const paso2 = document.getElementById('modalReordenarPaso2');
    paso2.style.display = 'block';
    paso2.style.opacity = '0';
    paso2.style.transform = 'translateY(30px)';
    
    // Llenar vista previa detallada
    llenarVistaPrevia();
    
    setTimeout(() => {
        paso2.style.transition = 'all 0.4s ease';
        paso2.style.opacity = '1';
        paso2.style.transform = 'translateY(0)';
    }, 50);
    
    // Crear más partículas
    setTimeout(() => {
        crearParticulasReordenamiento();
    }, 200);
}

function llenarVistaPrevia() {
    const listaOrdenPrevia = document.getElementById('listaOrdenPrevia');
    listaOrdenPrevia.innerHTML = '';
    
    nuevoOrdenJugadores.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = 'jugador-orden-previa';
        
        // Encontrar al jugador actual en el nuevo orden
        const esJugadorActual = jugador === ordenOriginal[turnoActual];
        if (esJugadorActual) {
            item.classList.add('actual');
        }
        
        item.innerHTML = `
            <span class="numero-orden-previa">${index + 1}</span>
            <span>${jugador}</span>
            ${esJugadorActual ? '<span style="margin-left: auto; color: #4ecdc4; font-weight: 700;">👑 Turno actual</span>' : ''}
        `;
        
        listaOrdenPrevia.appendChild(item);
    });
}

function confirmarReordenarJugadores() {
    if (nuevoOrdenJugadores.length === 0) {
        cerrarModalReordenar();
        return;
    }
    
    // Encontrar la nueva posición del jugador que estaba jugando
    const jugadorActualNombre = ordenOriginal[turnoActual];
    const nuevaPosicion = nuevoOrdenJugadores.indexOf(jugadorActualNombre);
    
    // Aplicar el nuevo orden
    jugadores.splice(0, jugadores.length, ...nuevoOrdenJugadores);
    
    // Actualizar turno actual
    if (nuevaPosicion !== -1) {
        turnoActual = nuevaPosicion;
    } else {
        // Si algo sale mal, resetear a 0
        turnoActual = 0;
    }
    
    // Cerrar modal
    cerrarModalReordenar();
    
    // Actualizar panel
    actualizarPanelJugadores();
    actualizarTurnoActual();
    
    // Mostrar mensaje de confirmación
    mostrarMensaje('¡Orden de jugadores mezclado exitosamente!', 'success');
    
    // Efecto de confetti colorido
    crearConfettiReordenamiento();
}

function crearParticulasReordenamiento() {
    const modal = document.querySelector('.modal-reordenar');
    if (!modal) return;
    
    const rect = modal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particula = document.createElement('div');
        particula.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10003;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        const angulo = (i / 12) * 2 * Math.PI;
        const velocidad = 100 + Math.random() * 50;
        const deltaX = Math.cos(angulo) * velocidad;
        const deltaY = Math.sin(angulo) * velocidad;
        
        particula.style.animation = `particulaReordenamiento 2s ease-out forwards`;
        particula.style.setProperty('--deltaX', deltaX + 'px');
        particula.style.setProperty('--deltaY', deltaY + 'px');
        
        document.body.appendChild(particula);
        
        setTimeout(() => {
            if (particula.parentNode) {
                particula.remove();
            }
        }, 2000);
    }
}

function crearConfettiReordenamiento() {
    const colors = ['#667eea', '#764ba2', '#4ecdc4', '#44a08d', '#ffd700', '#ff6b6b'];
    
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
}

// Cerrar modal al hacer clic en el overlay
document.addEventListener('click', function(e) {
    if (e.target.id === 'modalReordenarOverlay') {
        cerrarModalReordenar();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('modalReordenarOverlay').classList.contains('show')) {
        cerrarModalReordenar();
    }
});

// ========== FUNCIONES PARA TOGGLE DEL PANEL EN MÓVILES ==========

function togglePanel() {
    const panel = document.getElementById('panelJugadores');
    const overlay = document.getElementById('panelOverlay');
    const btn = document.getElementById('btnTogglePanel');
    
    if (panel.classList.contains('show')) {
        cerrarPanel();
    } else {
        abrirPanel();
    }
}

function abrirPanel() {
    const panel = document.getElementById('panelJugadores');
    const overlay = document.getElementById('panelOverlay');
    const btn = document.getElementById('btnTogglePanel');
    
    panel.classList.add('show');
    overlay.classList.add('show');
    btn.classList.add('panel-hidden');
    btn.textContent = '✖️';
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
}

function cerrarPanel() {
    const panel = document.getElementById('panelJugadores');
    const overlay = document.getElementById('panelOverlay');
    const btn = document.getElementById('btnTogglePanel');
    
    panel.classList.remove('show');
    overlay.classList.remove('show');
    btn.classList.remove('panel-hidden');
    btn.textContent = '👥';
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
}

// Cerrar panel con tecla Escape en móviles
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('panelJugadores').classList.contains('show')) {
        cerrarPanel();
    }
});

// Detectar cambios de tamaño de ventana para manejar responsive
window.addEventListener('resize', function() {
    const panel = document.getElementById('panelJugadores');
    const overlay = document.getElementById('panelOverlay');
    const btn = document.getElementById('btnTogglePanel');
    
    // Si la ventana es mayor a 768px, mostrar panel normalmente
    if (window.innerWidth > 768) {
        panel.classList.remove('show');
        overlay.classList.remove('show');
        btn.classList.remove('panel-hidden');
        btn.textContent = '👥';
        document.body.style.overflow = 'auto';
    }
});
// ========== FUNCIONES PARA POPUP DE CARTA MEJORADO ==========

let cartaActualData = null;
let cartaContador = 1;

function mostrarCartaEnPopup(carta, tipo) {
    cartaActualData = carta;
    
    const overlay = document.getElementById('cartaPopupOverlay');
    const popup = document.getElementById('cartaPopup');
    const badge = document.getElementById('cartaTipoBadge');
    const numero = document.getElementById('cartaNumero');
    const titulo = document.getElementById('cartaPopupTitulo');
    const texto = document.getElementById('cartaPopupTexto');
    const opciones = document.getElementById('cartaPopupOpciones');
    const respuesta = document.getElementById('cartaPopupRespuesta');
    const btnMostrarRespuesta = document.getElementById('btnMostrarRespuesta');

    // Configurar tipo de carta y estilos
    popup.className = `carta-popup ${tipo}`;
    
    // Configurar badge según el tipo
    const badgeTexts = {
        'comodines': 'COMODÍN',
        'preguntas': 'PREGUNTA',
        'datos': 'DATO CURIOSO'
    };
    badge.textContent = badgeTexts[tipo] || 'CARTA';
    
    // Configurar número de carta
    numero.textContent = `#${cartaContador++}`;
    
    // Configurar contenido
    titulo.textContent = carta.titulo || carta.pregunta || carta.dato || 'Carta';
    texto.textContent = carta.descripcion || carta.texto || carta.contenido || '';

    // Limpiar opciones y respuesta anteriores
    opciones.innerHTML = '';
    respuesta.innerHTML = '';
    respuesta.classList.add('hidden');
    btnMostrarRespuesta.style.display = 'none';

    // Configurar opciones según el tipo de carta
    if (carta.tipo === 'alternativas' && carta.opciones) {
        carta.opciones.forEach((opcion, index) => {
            const div = document.createElement('div');
            div.className = 'carta-popup-opcion';
            div.textContent = `${String.fromCharCode(65 + index)}. ${opcion}`;
            div.onclick = () => seleccionarOpcion(div, index);
            opciones.appendChild(div);
        });
        
        if (carta.respuesta_correcta !== undefined) {
            btnMostrarRespuesta.style.display = 'block';
        }
    } else if (carta.tipo === 'verdadero-falso') {
        ['Verdadero', 'Falso'].forEach((opcion, index) => {
            const div = document.createElement('div');
            div.className = 'carta-popup-opcion';
            div.textContent = opcion;
            div.onclick = () => seleccionarOpcion(div, index);
            opciones.appendChild(div);
        });
        
        if (carta.respuesta_correcta !== undefined) {
            btnMostrarRespuesta.style.display = 'block';
        }
    }

    // Mostrar popup con animación
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);

    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    // Efectos de sonido (opcional)
    crearEfectoParticulasPopup();
}

function seleccionarOpcion(elemento, index) {
    // Remover selección anterior
    document.querySelectorAll('.carta-popup-opcion').forEach(opt => {
        opt.classList.remove('seleccionada');
        opt.style.background = '';
        opt.style.color = '';
        opt.style.pointerEvents = 'auto';
    });
    
    // Marcar opción seleccionada
    elemento.classList.add('seleccionada');
    elemento.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
    elemento.style.color = 'white';
    elemento.style.transform = 'translateY(-2px)';
    elemento.style.boxShadow = '0 8px 25px rgba(78, 205, 196, 0.4)';
    
    // Verificar si la respuesta es correcta y asignar puntos
    if (cartaActualData && (cartaActualData.tipo === 'alternativas' || cartaActualData.tipo === 'verdadero-falso')) {
        const esCorrecta = index === cartaActualData.respuesta_correcta;
        
        setTimeout(() => {
            // Mostrar respuestas correctas e incorrectas visualmente
            document.querySelectorAll('.carta-popup-opcion').forEach((opt, idx) => {
                opt.style.pointerEvents = 'none';
                
                if (idx === cartaActualData.respuesta_correcta) {
                    opt.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
                    opt.style.color = 'white';
                    opt.style.border = '2px solid #2e7d32';
                    opt.style.transform = 'scale(1.05)';
                    opt.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.4)';
                } else if (idx === index && !esCorrecta) {
                    opt.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                    opt.style.color = 'white';
                    opt.style.border = '2px solid #c62828';
                    opt.style.opacity = '0.7';
                    opt.style.transform = 'scale(0.95)';
                } else if (idx !== cartaActualData.respuesta_correcta) {
                    opt.style.opacity = '0.5';
                    opt.style.transform = 'scale(0.98)';
                }
            });
            
            // Asignar punto si es correcta
            if (esCorrecta && jugadores.length > 0 && turnoActual < jugadores.length) {
                const jugadorActual = jugadores[turnoActual];
                
                if (!puntuaciones[jugadorActual]) {
                    puntuaciones[jugadorActual] = 0;
                }
                puntuaciones[jugadorActual]++;
                
                actualizarPanelJugadores();
                
                setTimeout(() => {
                    mostrarMensaje(`🎉 ¡${jugadorActual} ganó 1 punto! Total: ${puntuaciones[jugadorActual]}`, 'success');
                    crearEfectosPuntuacion(jugadorActual, '+1', 'positivo');
                }, 500);
                
                // Verificar victoria
                setTimeout(() => {
                    verificarVictoria();
                }, 1000);
            }
            
            // Mostrar respuesta automáticamente
            setTimeout(() => {
                mostrarRespuestaPopup();
            }, 1500);
            
        }, 300);
    }
}

function mostrarRespuestaPopup() {
    if (!cartaActualData) return;
    
    const respuesta = document.getElementById('cartaPopupRespuesta');
    const btnMostrarRespuesta = document.getElementById('btnMostrarRespuesta');
    
    let textoRespuesta = '';
    
    if (cartaActualData.tipo === 'alternativas' && cartaActualData.opciones) {
        const respuestaCorrecta = cartaActualData.opciones[cartaActualData.respuesta_correcta];
        textoRespuesta = `✅ Respuesta correcta: ${String.fromCharCode(65 + cartaActualData.respuesta_correcta)}. ${respuestaCorrecta}`;
    } else if (cartaActualData.tipo === 'verdadero-falso') {
        const respuestaCorrecta = cartaActualData.respuesta_correcta === 0 ? 'Verdadero' : 'Falso';
        textoRespuesta = `✅ Respuesta correcta: ${respuestaCorrecta}`;
    } else if (cartaActualData.respuesta) {
        textoRespuesta = `💡 Respuesta: ${cartaActualData.respuesta}`;
    }
    
    if (cartaActualData.explicacion) {
        textoRespuesta += `\n\n📝 Explicación: ${cartaActualData.explicacion}`;
    }
    
    respuesta.innerHTML = textoRespuesta.replace(/\n/g, '<br>');
    respuesta.classList.remove('hidden');
    btnMostrarRespuesta.style.display = 'none';
    
    // Scroll suave hacia la respuesta
    respuesta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cerrarPopupCarta() {
    const overlay = document.getElementById('cartaPopupOverlay');
    
    overlay.classList.remove('show');
    
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Si era una carta de pregunta, cambiar turno automáticamente
        if (cartaActualData && (cartaActualData.tipo === 'alternativas' || cartaActualData.tipo === 'verdadero-falso')) {
            console.log('🎮 Cambio automático de turno después de pregunta en popup');
            setTimeout(() => {
                siguienteTurno();
            }, 500);
        }
        
        cartaActualData = null;
    }, 400);
}

function crearEfectoParticulasPopup() {
    const popup = document.getElementById('cartaPopup');
    const rect = popup.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['#667eea', '#764ba2', '#4ecdc4', '#44a08d', '#ffd89b', '#ff9a9e'];
    
    for (let i = 0; i < 15; i++) {
        const particula = document.createElement('div');
        particula.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10001;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        const angulo = (i / 15) * 2 * Math.PI;
        const velocidad = 100 + Math.random() * 100;
        const deltaX = Math.cos(angulo) * velocidad;
        const deltaY = Math.sin(angulo) * velocidad;
        
        particula.style.animation = `particulaPopup 1.5s ease-out forwards`;
        particula.style.setProperty('--deltaX', deltaX + 'px');
        particula.style.setProperty('--deltaY', deltaY + 'px');
        
        document.body.appendChild(particula);
        
        setTimeout(() => {
            if (particula.parentNode) {
                particula.remove();
            }
        }, 1500);
    }
}

// Cerrar popup con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('cartaPopupOverlay').classList.contains('show')) {
        cerrarPopupCarta();
    }
});

// Cerrar popup al hacer clic en el overlay
document.addEventListener('click', function(e) {
    if (e.target.id === 'cartaPopupOverlay') {
        cerrarPopupCarta();
    }
});

// Agregar la animación CSS para las partículas (se puede agregar dinámicamente)
if (!document.querySelector('#particulas-style')) {
    const style = document.createElement('style');
    style.id = 'particulas-style';
    style.textContent = `
        @keyframes particulaPopup {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--deltaX), var(--deltaY)) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========== SISTEMA DE PUNTUACIÓN ==========

function modificarPuntuacion(nombreJugador, cambio) {
    if (!puntuaciones[nombreJugador]) {
        puntuaciones[nombreJugador] = 0;
    }
    
    // Evitar puntuaciones negativas
    const nuevaPuntuacion = puntuaciones[nombreJugador] + cambio;
    if (nuevaPuntuacion < 0) {
        puntuaciones[nombreJugador] = 0;
    } else {
        puntuaciones[nombreJugador] = nuevaPuntuacion;
    }
    
    // Actualizar panel con efectos visuales
    actualizarPanelJugadores();
    
    // Mostrar mensaje de puntuación
    if (cambio > 0) {
        mostrarMensaje(`🎉 +${cambio} punto para ${nombreJugador}!`, 'success');
        crearEfectosPuntuacion(nombreJugador, '+' + cambio, 'positivo');
    } else if (cambio < 0) {
        mostrarMensaje(`📉 ${cambio} punto para ${nombreJugador}`, 'warning');
        crearEfectosPuntuacion(nombreJugador, cambio.toString(), 'negativo');
    }
    
    // Verificar si hay nuevo líder
    verificarNuevoLider();
    
    // Verificar si alguien ha ganado después de modificar puntuación manual
    setTimeout(() => {
        verificarVictoria();
    }, 500);
}

function verificarNuevoLider() {
    const jugadoresOrdenados = Object.entries(puntuaciones)
        .sort(([,a], [,b]) => b - a);
    
    if (jugadoresOrdenados.length > 0) {
        const [lider, puntuacionLider] = jugadoresOrdenados[0];
        
        // Si hay empate en el primer lugar, no hay líder único
        const hayEmpate = jugadoresOrdenados.filter(([, puntos]) => puntos === puntuacionLider).length > 1;
        
        if (puntuacionLider > 0 && !hayEmpate) {
            // Verificar si es nuevo líder
            const liderAnterior = window.liderActual;
            if (liderAnterior !== lider) {
                window.liderActual = lider;
                setTimeout(() => {
                    mostrarMensaje(`👑 ¡${lider} es el nuevo líder con ${puntuacionLider} puntos!`, 'leader');
                    crearEfectosLiderazgo(lider);
                }, 500);
            }
        }
    }
}

function crearEfectosPuntuacion(nombreJugador, cambio, tipo) {
    // Buscar el índice del jugador en el array
    const indiceJugador = jugadores.indexOf(nombreJugador);
    if (indiceJugador === -1) {
        console.log('⚠️ DEBUG: Jugador no encontrado para efectos de puntuación:', nombreJugador);
        return;
    }
    
    // Buscar el elemento usando el ID basado en el índice
    const jugadorElement = document.getElementById(`jugador-${indiceJugador}`);
    if (!jugadorElement) {
        console.log('⚠️ DEBUG: Elemento DOM no encontrado para jugador:', nombreJugador, 'índice:', indiceJugador);
        return;
    }
    
    const efecto = document.createElement('div');
    efecto.className = `efecto-puntuacion ${tipo}`;
    efecto.textContent = cambio;
    efecto.style.cssText = `
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        font-size: 1.5rem;
        font-weight: 900;
        color: ${tipo === 'positivo' ? '#4ecdc4' : '#ff6b6b'};
        pointer-events: none;
        z-index: 1000;
        animation: efecto-puntuacion 2s ease-out forwards;
    `;
    
    jugadorElement.style.position = 'relative';
    jugadorElement.appendChild(efecto);
    
    setTimeout(() => {
        if (efecto.parentNode) {
            efecto.parentNode.removeChild(efecto);
        }
    }, 2000);
}

function crearEfectosLiderazgo(nombreLider) {
    // Buscar el índice del jugador en el array
    const indiceJugador = jugadores.indexOf(nombreLider);
    if (indiceJugador === -1) {
        console.log('⚠️ DEBUG: Jugador no encontrado para efectos de liderazgo:', nombreLider);
        return;
    }
    
    // Buscar el elemento usando el ID basado en el índice
    const jugadorElement = document.getElementById(`jugador-${indiceJugador}`);
    if (!jugadorElement) {
        console.log('⚠️ DEBUG: Elemento DOM no encontrado para liderazgo:', nombreLider, 'índice:', indiceJugador);
        return;
    }
    
    // Efecto de coronación
    jugadorElement.style.animation = 'coronacion 1s ease-out';
    
    // Crear corona flotante temporal
    const corona = document.createElement('div');
    corona.textContent = '👑';
    corona.style.cssText = `
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2rem;
        animation: corona-flotante 3s ease-in-out;
        pointer-events: none;
        z-index: 1001;
    `;
    
    jugadorElement.style.position = 'relative';
    jugadorElement.appendChild(corona);
    
    setTimeout(() => {
        if (corona.parentNode) {
            corona.parentNode.removeChild(corona);
        }
        jugadorElement.style.animation = '';
    }, 3000);
}

function obtenerRankingJugadores() {
    return Object.entries(puntuaciones)
        .sort(([,a], [,b]) => b - a)
        .map(([nombre, puntos], index) => ({
            posicion: index + 1,
            nombre,
            puntos
        }));
}

function reiniciarPuntuaciones() {
    if (confirm('¿Estás seguro de que quieres reiniciar todas las puntuaciones?')) {
        Object.keys(puntuaciones).forEach(jugador => {
            puntuaciones[jugador] = 0;
        });
        window.liderActual = null;
        actualizarPanelJugadores();
        mostrarMensaje('🔄 Puntuaciones reiniciadas', 'info');
    }
}

function agregarNuevoJugador() {
    const nombreInput = document.getElementById('nombreNuevoJugador');
    const btnAgregar = document.getElementById('btnAgregarJugador');
    const container = document.getElementById('inputContainer');
    const mensajeValidacion = document.getElementById('mensajeValidacion');
    
    const nombre = nombreInput.value.trim();
    
    // Limpiar mensaje anterior
    mensajeValidacion.className = 'mensaje-validacion';
    
    if (nombre.length < 2) {
        mostrarMensajeValidacion('El nombre debe tener al menos 2 caracteres', 'error');
        return;
    }
    
    if (jugadores.includes(nombre)) {
        mostrarMensajeValidacion('Ya existe un jugador con ese nombre', 'error');
        return;
    }
    
    if (jugadores.length >= 8) {
        mostrarMensajeValidacion('Máximo 8 jugadores permitidos', 'error');
        return;
    }
    
    // Añadir jugador al final de la lista
    jugadores.push(nombre);
    
    // Inicializar puntuación
    puntuaciones[nombre] = 0;
    
    // Actualizar panel
    actualizarPanelJugadores();
    actualizarTurnoActual();
    
    // Limpiar input
    nombreInput.value = '';
    
    // Mostrar mensaje de éxito
    mostrarMensajeValidacion(`¡${nombre} se ha unido al juego!`, 'success');
    mostrarMensaje(`¡${nombre} se ha unido al juego!`, 'success');
    
    // Efecto visual en el botón
    btnAgregar.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
    setTimeout(() => {
        btnAgregar.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
    }, 1000);
}

// ========== SISTEMA DE VICTORIA (META 7 PUNTOS) ==========

function verificarVictoria() {
    const META_PUNTOS = 7;
    
    console.log('🏆 DEBUG verificarVictoria: META_PUNTOS =', META_PUNTOS);
    console.log('🏆 DEBUG verificarVictoria: puntuaciones actuales =', JSON.stringify(puntuaciones));
    
    // Encontrar jugadores que han llegado a la meta
    const ganadores = Object.entries(puntuaciones)
        .filter(([nombre, puntos]) => puntos >= META_PUNTOS)
        .sort(([,a], [,b]) => b - a); // Ordenar por puntuación descendente
    
    console.log('🏆 DEBUG verificarVictoria: jugadores que alcanzaron la meta =', ganadores);
    
    if (ganadores.length > 0) {
        const [nombreGanador, puntosGanador] = ganadores[0];
        
        console.log('🏆 DEBUG verificarVictoria: ¡GANADOR DETECTADO!', nombreGanador, 'con', puntosGanador, 'puntos');
        
        // Verificar si hay empate en el primer lugar
        const hayEmpate = ganadores.filter(([, puntos]) => puntos === puntosGanador).length > 1;
        
        if (hayEmpate) {
            // Mostrar empate
            const nombresEmpatados = ganadores
                .filter(([, puntos]) => puntos === puntosGanador)
                .map(([nombre]) => nombre);
            console.log('🏆 DEBUG verificarVictoria: EMPATE detectado:', nombresEmpatados);
            mostrarVictoriaConEmpate(nombresEmpatados, puntosGanador);
        } else {
            // Mostrar victoria individual
            console.log('🏆 DEBUG verificarVictoria: Victoria individual:', nombreGanador);
            mostrarVictoria(nombreGanador, puntosGanador);
        }
    } else {
        console.log('🏆 DEBUG verificarVictoria: Ningún jugador ha alcanzado la meta aún');
    }
}

function mostrarVictoria(nombreGanador, puntos) {
    const overlay = document.getElementById('victoriaOverlay');
    const titulo = document.getElementById('victoriaTitulo');
    const ganador = document.getElementById('victoriaGanador');
    const puntuacion = document.getElementById('victoriaPuntuacion');
    const ranking = document.getElementById('victoriaRanking');
    
    // Configurar contenido
    titulo.textContent = '¡VICTORIA!';
    ganador.textContent = nombreGanador;
    puntuacion.textContent = `${puntos} puntos`;
    
    // Generar ranking final
    const rankingFinal = Object.entries(puntuaciones)
        .sort(([,a], [,b]) => b - a)
        .map(([nombre, pts], index) => ({
            posicion: index + 1,
            nombre,
            puntos: pts,
            esGanador: nombre === nombreGanador
        }));
    
    ranking.innerHTML = '';
    rankingFinal.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = `ranking-item ${jugador.esGanador ? 'ganador' : ''}`;
        
        let emoji = '';
        if (index === 0) emoji = '🥇';
        else if (index === 1) emoji = '🥈';
        else if (index === 2) emoji = '🥉';
        else emoji = '🏅';
        
        item.innerHTML = `
            <span class="ranking-posicion">${emoji}</span>
            <span class="ranking-nombre">${jugador.nombre}</span>
            <span class="ranking-puntos">${jugador.puntos} pts</span>
        `;
        
        ranking.appendChild(item);
    });
    
    // Mostrar modal con efectos
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden';
    
    // Efectos de celebración
    setTimeout(() => {
        crearConfettiVictoria();
        crearFuegosArtificiales();
    }, 500);
    
    // Sonido de victoria (opcional)
    reproducirSonidoVictoria();
}

function mostrarVictoriaConEmpate(nombresEmpatados, puntos) {
    const overlay = document.getElementById('victoriaOverlay');
    const titulo = document.getElementById('victoriaTitulo');
    const ganador = document.getElementById('victoriaGanador');
    const puntuacion = document.getElementById('victoriaPuntuacion');
    const ranking = document.getElementById('victoriaRanking');
    
    // Configurar contenido para empate
    titulo.textContent = '¡EMPATE ÉPICO!';
    ganador.textContent = nombresEmpatados.join(' & ');
    puntuacion.textContent = `${puntos} puntos cada uno`;
    
    // Generar ranking final
    const rankingFinal = Object.entries(puntuaciones)
        .sort(([,a], [,b]) => b - a)
        .map(([nombre, pts], index) => ({
            posicion: index + 1,
            nombre,
            puntos: pts,
            esGanador: nombresEmpatados.includes(nombre)
        }));
    
    ranking.innerHTML = '';
    rankingFinal.forEach((jugador, index) => {
        const item = document.createElement('div');
        item.className = `ranking-item ${jugador.esGanador ? 'ganador empate' : ''}`;
        
        let emoji = '';
        if (jugador.esGanador) emoji = '👑';
        else if (index < nombresEmpatados.length + 1) emoji = '🥈';
        else if (index < nombresEmpatados.length + 2) emoji = '🥉';
        else emoji = '🏅';
        
        item.innerHTML = `
            <span class="ranking-posicion">${emoji}</span>
            <span class="ranking-nombre">${jugador.nombre}</span>
            <span class="ranking-puntos">${jugador.puntos} pts</span>
        `;
        
        ranking.appendChild(item);
    });
    
    // Mostrar modal con efectos
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden';
    
    // Efectos de celebración especiales para empate
    setTimeout(() => {
        crearConfettiVictoria();
        crearFuegosArtificiales();
        crearEfectosEmpate();
    }, 500);
}

function cerrarVictoria() {
    const overlay = document.getElementById('victoriaOverlay');
    
    overlay.classList.remove('show');
    
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 400);
}

function nuevoJuego() {
    // Reiniciar todas las variables del juego
    jugadores = [];
    turnoActual = 0;
    puntuaciones = {};
    window.liderActual = null;
    cartaContador = 1;
    preguntaRespondida = false; // Resetear estado de respuesta
    
    // Recargar mazos
    cargarMazos();
    
    // Ocultar modal de victoria
    cerrarVictoria();
    
    
    // Ocultar panel de jugadores
    document.getElementById('panelJugadores').style.display = 'none';
    
    // Limpiar carta actual
    const cartaActual = document.getElementById('carta-actual');
    cartaActual.style.display = 'none';
    cartaActual.innerHTML = '';
    
    // Mostrar pantalla de configuración
    document.getElementById('configOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Limpiar inputs de jugadores
    const container = document.getElementById('jugadoresContainer');
    container.innerHTML = `
        <div class="jugador-input-container">
            <input type="text" class="jugador-input" placeholder="Nombre del Jugador 1" maxlength="20">
            <button type="button" class="btn-remove-jugador" onclick="removerJugador(this)">×</button>
        </div>
        <div class="jugador-input-container">
            <input type="text" class="jugador-input" placeholder="Nombre del Jugador 2" maxlength="20">
            <button type="button" class="btn-remove-jugador" onclick="removerJugador(this)">×</button>
        </div>
    `;
    
    // Reconfigurar eventos de inputs
    const inputs = document.querySelectorAll('.jugador-input');
    inputs.forEach(input => {
        input.addEventListener('input', validarJugadores);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!document.getElementById('btnIniciarJuego').disabled) {
                    iniciarJuego();
                }
            }
        });
    });
    
    // Validar jugadores inicial
    validarJugadores();
    
    mostrarMensaje('🎮 Nuevo juego iniciado', 'success');
}

function crearConfettiVictoria() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10005;
            animation: confettiFallVictoria ${3 + Math.random() * 4}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 7000);
    }
}

function crearFuegosArtificiales() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ffd700'];
    
    // Crear múltiples explosiones
    for (let explosion = 0; explosion < 5; explosion++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2;
            
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10006;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                const angle = (i / 20) * 2 * Math.PI;
                const velocity = 100 + Math.random() * 100;
                const deltaX = Math.cos(angle) * velocity;
                const deltaY = Math.sin(angle) * velocity;
                
                particle.style.animation = `fuegosArtificiales 2s ease-out forwards`;
                particle.style.setProperty('--deltaX', deltaX + 'px');
                particle.style.setProperty('--deltaY', deltaY + 'px');
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 2000);
            }
        }, explosion * 800);
    }
}

function crearEfectosEmpate() {
    // Efectos especiales adicionales para empates
    const overlay = document.getElementById('victoriaOverlay');
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            overlay.style.animation = 'pulseEmpate 0.5s ease-in-out';
            setTimeout(() => {
                overlay.style.animation = '';
            }, 500);
        }, i * 600);
    }
}

function reproducirSonidoVictoria() {
    // Crear sonido de victoria usando Web Audio API (opcional)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Secuencia de notas para sonido de victoria
        const notes = [523.25, 659.25, 783.99, 1046.5]; // Do, Mi, Sol, Do
        
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 200);
        });
    } catch (error) {
        console.log('No se pudo reproducir sonido de victoria:', error);
    }
}

// ========== VERIFICACIÓN DE CARGA DEL DOM ==========

// Verificar que todas las funciones críticas estén disponibles al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM completamente cargado');
    
    // Verificar elementos críticos del dado
    const dadoTrigger = document.querySelector('.dado-trigger');
    const dadoOverlay = document.getElementById('dadoPopupOverlay');
    const dadoCube = document.getElementById('dadoCube');
    const numeroDado = document.getElementById('numeroDadoPopup');
    
    console.log('🔍 Verificando elementos del dado:');
    console.log('- Botón trigger:', dadoTrigger ? '✅' : '❌');
    console.log('- Overlay popup:', dadoOverlay ? '✅' : '❌');
    console.log('- Dado cube:', dadoCube ? '✅' : '❌');
    console.log('- Número dado:', numeroDado ? '✅' : '❌');
    
    // Verificar que las funciones estén definidas
    console.log('🔍 Verificando funciones:');
    console.log('- abrirPopupDado:', typeof abrirPopupDado === 'function' ? '✅' : '❌');
    console.log('- lanzarDadoPopup:', typeof lanzarDadoPopup === 'function' ? '✅' : '❌');
    
    if (dadoTrigger) {
        console.log('🎯 Configurando evento click adicional para el botón del dado...');
        // Agregar event listener adicional como backup
        dadoTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎲 Click detectado en botón del dado (evento adicional)');
            abrirPopupDado();
        });
    }
});

// También verificar inmediatamente si el DOM ya está cargado
if (document.readyState === 'loading') {
    console.log('⏳ DOM aún cargando...');
} else {
    console.log('✅ DOM ya está listo');
}

// Función de prueba para verificar desde la consola
window.testDado = function() {
    console.log('🧪 Función de prueba ejecutada');
    abrirPopupDado();
};

console.log('💡 Para probar manualmente, ejecuta: testDado() en la consola');

// Función para mostrar imagen en modal grande
function mostrarImagenEnModal(src, alt = 'Imagen de la carta') {
    // Crear overlay si no existe
    let overlay = document.getElementById('imagenModalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'imagenModalOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(5px);
            cursor: pointer;
        `;
        
        // Evento para cerrar al hacer clic en el overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                cerrarImagenModal();
            }
        });
        
        document.body.appendChild(overlay);
    }
    
    // Limpiar contenido anterior
    overlay.innerHTML = '';
    
    // Crear contenedor para la imagen
    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: imagenModalZoom 0.3s ease-out;
    `;
    
    // Crear imagen
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        cursor: default;
    `;
    
    // Crear botón de cerrar
    const btnCerrar = document.createElement('button');
    btnCerrar.innerHTML = '✕';
    btnCerrar.style.cssText = `
        position: absolute;
        top: -15px;
        right: -15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10001;
    `;
    
    btnCerrar.onmouseover = () => {
        btnCerrar.style.background = 'rgba(255, 255, 255, 1)';
        btnCerrar.style.transform = 'scale(1.1)';
    };
    
    btnCerrar.onmouseout = () => {
        btnCerrar.style.background = 'rgba(255, 255, 255, 0.9)';
        btnCerrar.style.transform = 'scale(1)';
    };
    
    btnCerrar.onclick = (e) => {
        e.stopPropagation();
        cerrarImagenModal();
    };
    
    // Crear texto de ayuda
    const ayuda = document.createElement('div');
    ayuda.textContent = 'Haz clic fuera de la imagen o presiona ESC para cerrar';
    ayuda.style.cssText = `
        margin-top: 15px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        padding: 8px 16px;
        border-radius: 20px;
        backdrop-filter: blur(10px);
    `;
    
    // Ensamblar modal
    container.appendChild(img);
    container.appendChild(btnCerrar);
    container.appendChild(ayuda);
    overlay.appendChild(container);
    
    // Mostrar modal
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Fade in
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#imagenModalStyles')) {
        const style = document.createElement('style');
        style.id = 'imagenModalStyles';
        style.textContent = `
            @keyframes imagenModalZoom {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function cerrarImagenModal() {
    const overlay = document.getElementById('imagenModalOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Cerrar popup de turno
        if (document.getElementById('turnoPopupOverlay').classList.contains('show')) {
            cerrarPopupTurno();
        }
        // Cerrar modal de eliminación
        else if (document.getElementById('modalEliminarOverlay').classList.contains('show')) {
            cerrarModalEliminar();
        }
        // Cerrar modal de reordenamiento
        else if (document.getElementById('modalReordenarOverlay').classList.contains('show')) {
            cerrarModalReordenar();
        }
        // Cerrar popup de carta
        else if (document.getElementById('cartaPopupOverlay').classList.contains('show')) {
            cerrarPopupCarta();
        }
        // Cerrar panel de jugadores en móviles
        else if (document.getElementById('panelJugadores').classList.contains('show')) {
            cerrarPanel();
        }
        // Cerrar modal de imagen
        else if (document.getElementById('imagenModalOverlay') && document.getElementById('imagenModalOverlay').style.display === 'flex') {
            cerrarImagenModal();
        }
        // Cerrar modal de visualización de comodín
        else if (document.querySelector('.comodin-visualizacion-overlay')) {
            cerrarComodinVisualizacion();
        }
        // Cerrar popup de prohibición
        else if (document.getElementById('prohibicionOverlay')) {
            permitirComodin(); // Al cerrar con Escape, se permite el comodín
        }
    }
});

// ========== SISTEMA DE USO DE COMODINES ==========

// Función principal para usar un comodín
function usarComodin(carta, nombreJugador) {
    // Verificar que el jugador tiene el comodín
    if (!tieneComodin(nombreJugador, carta)) {
        mostrarMensaje('No tienes este comodín disponible', 'error');
        return;
    }
    
    // Mostrar efecto visual de selección
    mostrarEfectoSeleccionComodin(carta);
    
    // Manejar el comodín de prohibición de manera especial
    const nombreComodin = carta.nombre.toLowerCase();
    if (nombreComodin === '¡no!,¡te lo prohíbo!') {
        mostrarMensaje('🚫 Este comodín solo se puede usar como reacción a otro comodín', 'info');
        return;
    }
    
    // Verificar si hay jugadores con comodín de prohibición
    const jugadoresConProhibicion = hayJugadoresConProhibicion(nombreJugador);
    
    if (jugadoresConProhibicion.length > 0) {
        // Hay jugadores que pueden interceptar
        console.log('🚫 DEBUG: Hay jugadores con prohibición, mostrando popup de intercepción');
        
        // Guardar estado para el sistema de prohibición
        comodinEnProceso = carta;
        jugadorUsandoComodin = nombreJugador;
        
        // Remover temporalmente el comodín del inventario
        removerComodinDelInventario(nombreJugador, carta);
        
        // Mostrar popup de intercepción
        mostrarPopupProhibicion(jugadoresConProhibicion, carta, nombreJugador);
        
    } else {
        // No hay interceptación posible, ejecutar directamente
        console.log('✅ DEBUG: No hay intercepción, ejecutando comodín directamente');
        ejecutarEfectoComodin(carta, nombreJugador);
    }
}

// Función para verificar si un jugador tiene un comodín específico
function tieneComodin(nombreJugador, carta) {
    const inventario = inventariosComodines[nombreJugador] || [];
    return inventario.some(comodin => 
        comodin.nombre === carta.nombre && comodin.id === carta.id
    );
}

// Función para remover un comodín del inventario
function removerComodinDelInventario(nombreJugador, carta) {
    const inventario = inventariosComodines[nombreJugador] || [];
    const index = inventario.findIndex(comodin => 
        comodin.nombre === carta.nombre && comodin.id === carta.id
    );
    
    if (index !== -1) {
        return inventario.splice(index, 1)[0];
    }
    return null;
}

// Función para mostrar efecto visual de selección
function mostrarEfectoSeleccionComodin(carta) {
    // Encontrar el elemento del comodín en el popup
    const comodines = document.querySelectorAll('.popup-comodin');
    comodines.forEach(element => {
        element.classList.add('seleccionado');
    });
    
    // Mostrar mensaje de uso
    mostrarMensaje(`🃏 Has usado: ${simplificarNombreComodin(carta.nombre)}`, 'success');
}

// ========== IMPLEMENTACIÓN DE EFECTOS DE COMODINES ==========

// 1. Punto Gratis - Suma 1 punto al jugador
function aplicarPuntoGratis(nombreJugador, carta) {
    // Remover comodín del inventario
    removerComodinDelInventario(nombreJugador, carta);
    
    // Agregar punto
    modificarPuntuacion(nombreJugador, 1);
    
    // Descartar carta (no se devuelve al mazo)
    mostrarMensaje(`${nombreJugador} ganó 1 punto gratis! 🌟`, 'success');
    
    // Actualizar UI y continuar
    actualizarPanelJugadores();
    setTimeout(() => {
        cerrarPopupTurno();
    }, 1500);
}

// 2. Restar Punto - Resta 1 punto a otro jugador
function aplicarRestarPunto(nombreJugador, carta) {
    // Cerrar popup de turno antes de mostrar selector
    cerrarPopupTurno();
    
    // Pequeño delay para que se cierre suavemente
    setTimeout(() => {
        // Mostrar selector de jugadores objetivo
        mostrarSelectorJugadores(nombreJugador, (jugadorObjetivo) => {
            if (puntuaciones[jugadorObjetivo] > 0) {
                // Remover comodín del inventario
                removerComodinDelInventario(nombreJugador, carta);
                
                // Restar punto
                modificarPuntuacion(jugadorObjetivo, -1);
                
                mostrarMensaje(`${nombreJugador} le restó 1 punto a ${jugadorObjetivo}! 💥`, 'warning');
                
                // Actualizar UI y continuar
                actualizarPanelJugadores();
                setTimeout(() => {
                    cerrarPopupTurno();
                }, 1500);
            } else {
                mostrarMensaje(`${jugadorObjetivo} no tiene puntos para restar`, 'info');
            }
        }, 'Elige a quién restarle un punto:');
    }, 300);
}

// 3. Reversa - Cambia el orden de turnos
function aplicarReversa(nombreJugador, carta) {
    // Remover comodín del inventario
    removerComodinDelInventario(nombreJugador, carta);
    
    // Cambiar orden de turnos
    orden *= -1;
    
    // Invertir array de jugadores para simular el efecto reversa
    jugadores.reverse();
    
    // Ajustar turno actual
    turnoActual = jugadores.length - 1 - turnoActual;
    
    mostrarMensaje(`${nombreJugador} cambió el orden de turnos! 🔄`, 'info');
    
    // Actualizar UI y continuar
    actualizarPanelJugadores();
    setTimeout(() => {
        cerrarPopupTurno();
    }, 1500);
}

// 4. Ladrón de Comodines - Roba un comodín aleatorio
function aplicarLadronComodines(nombreJugador, carta) {
    // Buscar jugadores con comodines
    const jugadoresConComodines = jugadores.filter(jugador => 
        jugador !== nombreJugador && 
        (inventariosComodines[jugador] || []).length > 0
    );
    
    if (jugadoresConComodines.length === 0) {
        mostrarMensaje('No hay jugadores con comodines para robar', 'info');
        return;
    }
    
    // Cerrar popup de turno antes de mostrar selector
    cerrarPopupTurno();
    
    // Pequeño delay para que se cierre suavemente
    setTimeout(() => {
        // Mostrar selector de jugadores objetivo
        mostrarSelectorJugadores(nombreJugador, (jugadorObjetivo) => {
            const inventarioObjetivo = inventariosComodines[jugadorObjetivo] || [];
            
            if (inventarioObjetivo.length === 0) {
                mostrarMensaje(`${jugadorObjetivo} no tiene comodines para robar`, 'info');
                return;
            }
            
            // Robar comodín aleatorio
            const indiceAleatorio = Math.floor(Math.random() * inventarioObjetivo.length);
            const comodinRobado = inventarioObjetivo.splice(indiceAleatorio, 1)[0];
            
            // Agregar al inventario del ladrón
            if (!inventariosComodines[nombreJugador]) {
                inventariosComodines[nombreJugador] = [];
            }
            inventariosComodines[nombreJugador].push(comodinRobado);
            
            // Remover comodín usado del inventario
            removerComodinDelInventario(nombreJugador, carta);
            
            // Descartar carta usada
            mostrarMensaje(`${nombreJugador} le robó un comodín a ${jugadorObjetivo}! 🦹`, 'warning');
            
            // Actualizar UI y continuar
            actualizarPanelJugadores();
            setTimeout(() => {
                cerrarPopupTurno();
            }, 1500);
            
        }, 'Elige a quién robarle un comodín:', jugadoresConComodines);
    }, 300);
}

// 5. Escapa de la Cárcel - Efecto especial para salir de la cárcel
function aplicarEscapeCarcel(nombreJugador, carta) {
    // Este comodín se usa cuando el jugador está en la cárcel
    // Por ahora solo mostramos el efecto, la implementación completa dependería del sistema de cárcel
    
    // Remover comodín del inventario
    removerComodinDelInventario(nombreJugador, carta);
    
    mostrarMensaje(`${nombreJugador} usó "Escapa de la Cárcel"! 🔓`, 'success');
    
    // Actualizar UI y continuar
    actualizarPanelJugadores();
    setTimeout(() => {
        cerrarPopupTurno();
    }, 1500);
}

// 6. Construyendo el Comodín - Necesita 2 copias para obtener un comodín aleatorio
function aplicarConstruirComodin(nombreJugador, carta) {
    const inventario = inventariosComodines[nombreJugador] || [];
    
    // Contar cuántas copias de "construyendo el comodín" tiene
    const copiasConstruir = inventario.filter(comodin => 
        comodin.nombre.toLowerCase() === 'construyendo el comodín'
    ).length;
    
    if (copiasConstruir < 2) {
        mostrarMensaje('Necesitas 2 cartas iguales para usar este comodín.', 'info');
        return;
    }
    
    // Mostrar menú de prohibición
    mostrarMenuProhibicion(nombreJugador, () => {
        // Callback que se ejecuta si no se prohibió el comodín
        // Remover 2 copias del inventario
        let removidas = 0;
        for (let i = inventario.length - 1; i >= 0 && removidas < 2; i--) {
            if (inventario[i].nombre.toLowerCase() === 'construyendo el comodín') {
                inventario.splice(i, 1);
                removidas++;
            }
        }
        
        // Obtener comodín aleatorio del mazo
        if (mazos.comodines.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * mazos.comodines.length);
            const nuevoComodin = mazos.comodines.splice(indiceAleatorio, 1)[0];
            
            // Agregar al inventario
            inventario.push(nuevoComodin);
            
            mostrarMensaje(`${nombreJugador} construyó un nuevo comodín: ${simplificarNombreComodin(nuevoComodin.nombre)}! 🔨`, 'success');
        } else {
            mostrarMensaje('No hay más comodines en el mazo para construir', 'warning');
        }
        
        // Actualizar UI y continuar
        actualizarPanelJugadores();
        setTimeout(() => {
            cerrarPopupTurno();
        }, 1500);
    });
}

// Función para mostrar el menú de prohibición
function mostrarMenuProhibicion(nombreJugador, callback) {
    // Crear overlay para el menú de prohibición
    const overlay = document.createElement('div');
    overlay.className = 'prohibicion-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Crear contenedor del menú
    const menu = document.createElement('div');
    menu.className = 'prohibicion-menu';
    menu.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        color: white;
        text-align: center;
        animation: slideInUp 0.4s ease-out;
    `;
    
    // Crear título
    const titulo = document.createElement('h2');
    titulo.textContent = '¡Te lo prohíbo!';
    titulo.style.cssText = `
        font-size: 2rem;
        margin-bottom: 1rem;
        color: white;
    `;
    
    // Crear mensaje
    const mensaje = document.createElement('p');
    mensaje.textContent = `${nombreJugador} está intentando construir un comodín. ¿Quieres prohibirlo?`;
    mensaje.style.cssText = `
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: rgba(255, 255, 255, 0.9);
    `;
    
    // Crear contenedor del contador
    const contadorContainer = document.createElement('div');
    contadorContainer.style.cssText = `
        margin-bottom: 2rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Crear contador
    const contador = document.createElement('div');
    contador.id = 'prohibicionContador';
    contador.style.cssText = `
        font-size: 2rem;
        font-weight: bold;
        color: #ffd700;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    `;
    
    // Crear barra de progreso
    const barraProgreso = document.createElement('div');
    barraProgreso.style.cssText = `
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        margin-top: 1rem;
        overflow: hidden;
    `;
    
    const progreso = document.createElement('div');
    progreso.style.cssText = `
        width: 100%;
        height: 100%;
        background: #ffd700;
        transition: width 1s linear;
    `;
    
    barraProgreso.appendChild(progreso);
    contadorContainer.appendChild(contador);
    contadorContainer.appendChild(barraProgreso);
    
    // Crear botones
    const botonesContainer = document.createElement('div');
    botonesContainer.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: center;
    `;
    
    const btnProhibir = document.createElement('button');
    btnProhibir.textContent = '¡Prohibir!';
    btnProhibir.style.cssText = `
        background: #ff4757;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
        max-width: 200px;
    `;
    
    const btnPermitir = document.createElement('button');
    btnPermitir.textContent = 'Permitir';
    btnPermitir.style.cssText = `
        background: #2ed573;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
        max-width: 200px;
    `;
    
    // Agregar elementos al DOM
    botonesContainer.appendChild(btnProhibir);
    botonesContainer.appendChild(btnPermitir);
    menu.appendChild(titulo);
    menu.appendChild(mensaje);
    menu.appendChild(contadorContainer);
    menu.appendChild(botonesContainer);
    overlay.appendChild(menu);
    document.body.appendChild(overlay);
    
    // Configurar contador regresivo
    let tiempoRestante = 20;
    contador.textContent = tiempoRestante;
    
    // Función para actualizar el contador y la barra de progreso
    const actualizarContador = () => {
        tiempoRestante--;
        contador.textContent = tiempoRestante;
        progreso.style.width = `${(tiempoRestante / 20) * 100}%`;
        
        // Efecto visual cuando quedan 5 segundos o menos
        if (tiempoRestante <= 5) {
            contador.style.color = '#ff4757';
            contador.style.animation = 'pulse 1s infinite';
        }
    };
    
    // Actualizar inmediatamente
    actualizarContador();
    
    // Configurar intervalo
    const interval = setInterval(() => {
        actualizarContador();
        
        if (tiempoRestante <= 0) {
            clearInterval(interval);
            overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                overlay.remove();
                callback(); // Ejecutar callback si se acaba el tiempo
            }, 500);
        }
    }, 1000);
    
    // Configurar botones
    btnProhibir.onclick = () => {
        clearInterval(interval);
        overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            overlay.remove();
            mostrarMensaje('¡El comodín ha sido prohibido!', 'warning');
        }, 500);
    };
    
    btnPermitir.onclick = () => {
        clearInterval(interval);
        overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            overlay.remove();
            callback(); // Ejecutar callback si se permite
        }, 500);
    };
}

// ========== SELECTOR DE JUGADORES PARA COMODINES ==========

// Función para mostrar un selector de jugadores
function mostrarSelectorJugadores(jugadorActual, callback, mensaje = 'Selecciona un jugador:', jugadoresPermitidos = null) {
    // Crear overlay para el selector
    const overlay = document.createElement('div');
    overlay.className = 'selector-jugadores-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Crear modal del selector
    const modal = document.createElement('div');
    modal.className = 'selector-jugadores-modal';
    modal.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        color: white;
        text-align: center;
        animation: slideInUp 0.4s ease-out;
    `;
    
    // Título del modal
    const titulo = document.createElement('div');
    titulo.style.cssText = `
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    `;
    titulo.textContent = mensaje;
    
    // Contenedor de jugadores
    const jugadoresContainer = document.createElement('div');
    jugadoresContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    `;
    
    // Determinar qué jugadores mostrar
    const jugadoresAMostrar = jugadoresPermitidos || jugadores.filter(j => j !== jugadorActual);
    
    // Crear botón para cada jugador
    jugadoresAMostrar.forEach(nombreJugador => {
        const botonJugador = document.createElement('button');
        botonJugador.style.cssText = `
            padding: 1rem 0.5rem;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        botonJugador.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👤</div>
            <div style="font-size: 0.9rem;">${nombreJugador}</div>
            <div style="font-size: 0.7rem; opacity: 0.8;">💎 ${puntuaciones[nombreJugador] || 0} pts</div>
        `;
        
        // Efectos hover
        botonJugador.onmouseover = () => {
            botonJugador.style.transform = 'translateY(-5px) scale(1.05)';
            botonJugador.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            botonJugador.style.background = 'rgba(255, 255, 255, 0.3)';
        };
        
        botonJugador.onmouseout = () => {
            botonJugador.style.transform = 'translateY(0) scale(1)';
            botonJugador.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            botonJugador.style.background = 'rgba(255, 255, 255, 0.2)';
        };
        
        // Evento click
        botonJugador.onclick = () => {
            // Animación de selección
            botonJugador.style.animation = 'comodinSelect 0.3s ease';
            
            setTimeout(() => {
                // Cerrar modal
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
                
                // Ejecutar callback
                callback(nombreJugador);
            }, 300);
        };
        
        jugadoresContainer.appendChild(botonJugador);
    });
    
    // Botón cancelar
    const botonCancelar = document.createElement('button');
    botonCancelar.style.cssText = `
        padding: 0.75rem 1.5rem;
        background: rgba(255, 71, 87, 0.8);
        border: none;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    botonCancelar.textContent = '✖️ Cancelar';
    
    botonCancelar.onmouseover = () => {
        botonCancelar.style.background = 'rgba(255, 71, 87, 1)';
        botonCancelar.style.transform = 'translateY(-2px)';
    };
    
    botonCancelar.onmouseout = () => {
        botonCancelar.style.background = 'rgba(255, 71, 87, 0.8)';
        botonCancelar.style.transform = 'translateY(0)';
    };
    
    botonCancelar.onclick = () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    };
    
    // Ensamblar modal
    modal.appendChild(titulo);
    modal.appendChild(jugadoresContainer);
    modal.appendChild(botonCancelar);
    overlay.appendChild(modal);
    
    // Agregar animaciones CSS si no existen
    if (!document.querySelector('#selectorAnimations')) {
        const style = document.createElement('style');
        style.id = 'selectorAnimations';
        style.textContent = `
            @keyframes slideInUp {
                0% { transform: translateY(50px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar al DOM
    document.body.appendChild(overlay);
}

// ========== FUNCIÓN PARA AGREGAR COMODINES AL INVENTARIO ==========

// Función para agregar un comodín al inventario de un jugador
function agregarComodinAlInventario(nombreJugador, comodin) {
    if (!inventariosComodines[nombreJugador]) {
        inventariosComodines[nombreJugador] = [];
    }
    
    inventariosComodines[nombreJugador].push(comodin);
    
    // Mostrar notificación
    mostrarMensaje(`${nombreJugador} obtuvo un comodín: ${simplificarNombreComodin(comodin.nombre)}! 🃏`, 'success');
    
    // Actualizar UI
    actualizarPanelJugadores();
}

// Función para mostrar temporalmente un comodín obtenido
function mostrarCartaComodinTemporal(carta, nombreJugador) {
    // Variable de control para evitar doble llamado a siguienteTurno
    let turnoYaCambiado = false;
    
    // Función auxiliar para cambiar turno solo una vez
    const cambiarTurnoSiNoSeHizo = () => {
        if (!turnoYaCambiado) {
            turnoYaCambiado = true;
            siguienteTurno();
        }
    };
    
    // Crear overlay temporal para mostrar el comodín obtenido
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Crear modal del comodín
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        color: white;
        text-align: center;
        animation: slideInUp 0.4s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Contenido del modal
    modal.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎁</div>
        <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
            ¡Comodín Obtenido!
        </div>
        <div style="font-size: 1.2rem; margin-bottom: 1rem; color: rgba(255, 255, 255, 0.9);">
            ${nombreJugador}
        </div>
        <div style="background: rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; backdrop-filter: blur(10px);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">
                ${obtenerIconoComodin(carta.nombre.toLowerCase())}
            </div>
            <div style="font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem;">
                ${simplificarNombreComodin(carta.nombre)}
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4;">
                ${carta.texto}
            </div>
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8; font-style: italic;">
            Este comodín se agregó a tu inventario. ¡Úsalo sabiamente!
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Crear efectos de partículas de celebración
    crearEfectosComodinObtenido(modal);
    
    // Auto-cerrar después de 8 segundos y pasar al siguiente turno
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            // Pasar al siguiente turno después de obtener el comodín (solo una vez)
            cambiarTurnoSiNoSeHizo();
        }, 300);
    }, 8000);
    
    // También permitir cerrar con clic y pasar al siguiente turno
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                // Pasar al siguiente turno al cerrar manualmente (solo una vez)
                cambiarTurnoSiNoSeHizo();
            }, 300);
        }
    };
}

// Función para crear efectos visuales cuando se obtiene un comodín
function crearEfectosComodinObtenido(elemento) {
    // Crear múltiples efectos de brillo
    for (let i = 0; i < 12; i++) {
        const efecto = document.createElement('div');
        efecto.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #ffd700 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: efectoComodin 2s ease-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        // Posición aleatoria alrededor del elemento
        const angle = (i / 12) * 2 * Math.PI;
        const radius = 50 + Math.random() * 30;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        efecto.style.left = `calc(50% + ${x}px)`;
        efecto.style.top = `calc(50% + ${y}px)`;
        
        elemento.appendChild(efecto);
        
        // Remover después de la animación
        setTimeout(() => {
            if (elemento.contains(efecto)) {
                elemento.removeChild(efecto);
            }
        }, 4000);
    }
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#efectoComodinStyles')) {
        const style = document.createElement('style');
        style.id = 'efectoComodinStyles';
        style.textContent = `
            @keyframes efectoComodin {
                0% { 
                    transform: scale(0) rotate(0deg); 
                    opacity: 1; 
                }
                50% { 
                    transform: scale(1.5) rotate(180deg); 
                    opacity: 0.8; 
                }
                100% { 
                    transform: scale(0) rotate(360deg); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Función para mostrar temporalmente un comodín que se aplicó inmediatamente
function mostrarCartaComodinInstantaneo(carta, nombreJugador, mensaje) {
    // Variable de control para evitar doble llamado a siguienteTurno
    let turnoYaCambiado = false;
    
    // Función auxiliar para cambiar turno solo una vez
    const cambiarTurnoSiNoSeHizo = () => {
        if (!turnoYaCambiado) {
            turnoYaCambiado = true;
            siguienteTurno();
        }
    };
    
    // Crear overlay temporal para mostrar el comodín aplicado
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Crear modal del comodín
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        color: white;
        text-align: center;
        animation: slideInUp 0.4s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Contenido del modal
    modal.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
        <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
            ¡Efecto Instantáneo!
        </div>
        <div style="font-size: 1.2rem; margin-bottom: 1rem; color: rgba(255, 255, 255, 0.9);">
            ${nombreJugador}
        </div>
        <div style="background: rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; backdrop-filter: blur(10px);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">
                ${obtenerIconoComodin(carta.nombre.toLowerCase())}
            </div>
            <div style="font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem;">
                ${simplificarNombreComodin(carta.nombre)}
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9; line-height: 1.4; margin-bottom: 0.5rem;">
                ${carta.texto}
            </div>
            <div style="font-size: 1rem; font-weight: bold; color: #ffd700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">
                ${mensaje}
            </div>
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8; font-style: italic;">
            El efecto se aplicó automáticamente. Pasando al siguiente turno...
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Crear efectos de partículas especiales para comodín instantáneo
    crearEfectosComodinInstantaneo(modal);
    
    // Auto-cerrar después de 3 segundos y pasar al siguiente turno
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            // Pasar al siguiente turno después del efecto instantáneo (solo una vez)
            cambiarTurnoSiNoSeHizo();
        }, 300);
    }, 3000);
    
    // También permitir cerrar con clic y pasar al siguiente turno
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                // Pasar al siguiente turno al cerrar manualmente (solo una vez)
                cambiarTurnoSiNoSeHizo();
            }, 300);
        }
    };
}

// Función para crear efectos visuales para comodines instantáneos
function crearEfectosComodinInstantaneo(elemento) {
    // Crear múltiples efectos de brillo dorado
    for (let i = 0; i < 15; i++) {
        const efecto = document.createElement('div');
        efecto.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #ffd700 0%, #ffed4e 50%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: efectoComodinInstantaneo 1.5s ease-out infinite;
            animation-delay: ${Math.random() * 1.5}s;
        `;
        
        // Posición aleatoria alrededor del elemento
        const angle = (i / 15) * 2 * Math.PI;
        const radius = 60 + Math.random() * 40;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        efecto.style.left = `calc(50% + ${x}px)`;
        efecto.style.top = `calc(50% + ${y}px)`;
        
        elemento.appendChild(efecto);
        
        // Remover después de la animación
        setTimeout(() => {
            if (elemento.contains(efecto)) {
                elemento.removeChild(efecto);
            }
        }, 3000);
    }
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#efectoComodinInstantaneoStyles')) {
        const style = document.createElement('style');
        style.id = 'efectoComodinInstantaneoStyles';
        style.textContent = `
            @keyframes efectoComodinInstantaneo {
                0% { 
                    transform: scale(0) rotate(0deg); 
                    opacity: 1; 
                }
                30% { 
                    transform: scale(1.8) rotate(120deg); 
                    opacity: 1; 
                }
                100% { 
                    transform: scale(0) rotate(360deg); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Función para mostrar un comodín solo para visualización (sin opción de uso)
function mostrarComodinVisualizacion(nombreJugador, tipoComodin) {
    const inventario = inventariosComodines[nombreJugador] || [];
    
    // Buscar un comodín de este tipo en el inventario
    const comodin = inventario.find(c => c.nombre.toLowerCase() === tipoComodin);
    
    if (!comodin) {
        mostrarMensaje('Comodín no encontrado en el inventario', 'error');
        return;
    }
    
    // Contar cuántos comodines de este tipo tiene
    const cantidad = inventario.filter(c => c.nombre.toLowerCase() === tipoComodin).length;
    
    // Crear overlay para el modal
    const overlay = document.createElement('div');
    overlay.className = 'comodin-visualizacion-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Crear modal del comodín
    const modal = document.createElement('div');
    modal.className = 'comodin-visualizacion-modal';
    modal.style.cssText = `
        background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 450px;
        width: 90%;
        color: white;
        text-align: center;
        animation: slideInUp 0.4s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.3);
        position: relative;
    `;
    
    // Contenido del modal
    modal.innerHTML = `
        <div style="position: absolute; top: 15px; right: 15px;">
            <button onclick="cerrarComodinVisualizacion()" style="
                width: 30px; 
                height: 30px; 
                border-radius: 50%; 
                background: rgba(255, 255, 255, 0.2); 
                border: none; 
                color: white; 
                font-size: 18px; 
                font-weight: bold; 
                cursor: pointer; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">×</button>
        </div>
        
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">${obtenerIconoComodin(tipoComodin)}</div>
        
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 8px 16px; margin-bottom: 1rem; display: inline-block;">
            <span style="font-size: 0.8rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">👁️ Solo Visualización</span>
        </div>
        
        <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
            ${simplificarNombreComodin(comodin.nombre)}
        </div>
        
        <div style="font-size: 1rem; margin-bottom: 1.5rem; color: rgba(255, 255, 255, 0.9);">
            Propietario: <strong>${nombreJugador}</strong>
            ${cantidad > 1 ? `<br><span style="font-size: 0.9rem; opacity: 0.8;">Tienes ${cantidad} de estos comodines</span>` : ''}
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; backdrop-filter: blur(10px);">
            <div style="font-size: 1rem; font-weight: bold; margin-bottom: 0.8rem; color: #ffd700;">
                📜 Descripción del Efecto:
            </div>
            <div style="font-size: 0.95rem; opacity: 0.95; line-height: 1.5; text-align: left;">
                ${comodin.texto || comodin.descripcion || 'Sin descripción disponible'}
            </div>
        </div>
        
        <div style="font-size: 0.85rem; opacity: 0.7; font-style: italic; margin-bottom: 1rem;">
            💡 Para usar este comodín, debes estar en tu turno y seleccionarlo en el inicio del turno
        </div>
        
        <button onclick="cerrarComodinVisualizacion()" style="
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        " onmouseover="
            this.style.background='rgba(255, 255, 255, 0.3)';
            this.style.borderColor='rgba(255, 255, 255, 0.5)';
            this.style.transform='translateY(-2px)';
        " onmouseout="
            this.style.background='rgba(255, 255, 255, 0.2)';
            this.style.borderColor='rgba(255, 255, 255, 0.3)';
            this.style.transform='translateY(0)';
        ">
            👁️ Entendido
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Evento para cerrar al hacer clic en el overlay
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            cerrarComodinVisualizacion();
        }
    };
    
    // Crear efectos visuales suaves
    crearEfectosVisualizacionComodin(modal);
}

// Función para cerrar el modal de visualización de comodín
function cerrarComodinVisualizacion() {
    const overlay = document.querySelector('.comodin-visualizacion-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
}

// Función para crear efectos visuales suaves en el modal de visualización
function crearEfectosVisualizacionComodin(elemento) {
    // Crear efectos de brillo suaves
    for (let i = 0; i < 6; i++) {
        const efecto = document.createElement('div');
        efecto.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: efectoVisualizacionSuave 3s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        
        // Posición aleatoria alrededor del elemento
        const angle = (i / 6) * 2 * Math.PI;
        const radius = 40 + Math.random() * 20;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        efecto.style.left = `calc(50% + ${x}px)`;
        efecto.style.top = `calc(50% + ${y}px)`;
        
        elemento.appendChild(efecto);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (elemento.contains(efecto)) {
                elemento.removeChild(efecto);
            }
        }, 5000);
    }
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#efectoVisualizacionSuaveStyles')) {
        const style = document.createElement('style');
        style.id = 'efectoVisualizacionSuaveStyles';
        style.textContent = `
            @keyframes efectoVisualizacionSuave {
                0%, 100% { 
                    transform: scale(0.5); 
                    opacity: 0.3; 
                }
                50% { 
                    transform: scale(1.2); 
                    opacity: 0.8; 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Función para obtener el ícono según el tipo de comodín

// Funciones para controlar el acceso a los mazos (una carta por turno)
function deshabilitarMazos() {
    const mazos = document.querySelectorAll('.mazo');
    mazos.forEach(mazo => {
        mazo.style.pointerEvents = 'none';
        mazo.style.opacity = '0.5';
        mazo.style.cursor = 'not-allowed';
        mazo.classList.add('mazo-deshabilitado');
    });
}

function habilitarMazos() {
    const mazos = document.querySelectorAll('.mazo');
    mazos.forEach(mazo => {
        mazo.style.pointerEvents = 'auto';
        mazo.style.opacity = '1';
        mazo.style.cursor = 'pointer';
        mazo.classList.remove('mazo-deshabilitado');
    });
}

function reanudarTurno() {
    cartaSacadaEnTurno = false;
    habilitarMazos();
    console.log('🎯 DEBUG: Turno reanudado - se puede sacar una nueva carta');
}

// ========== SISTEMA DE PROHIBICIÓN DE COMODINES ==========

// Función para verificar si hay jugadores con comodín de prohibición
function hayJugadoresConProhibicion(jugadorExcluido) {
    return jugadores.filter(jugador => 
        jugador !== jugadorExcluido && 
        tieneComodinProhibicion(jugador)
    );
}

// Función para verificar si un jugador tiene el comodín de prohibición
function tieneComodinProhibicion(nombreJugador) {
    const inventario = inventariosComodines[nombreJugador] || [];
    return inventario.some(comodin => 
        comodin.nombre.toLowerCase() === '¡no!,¡te lo prohíbo!'
    );
}

// Función para mostrar popup de intercepción a jugadores con prohibición
function mostrarPopupProhibicion(jugadoresConProhibicion, comodin, jugadorUsando) {
    esperandoProhibicion = true;
    
    // Crear overlay para intercepción
    const overlay = document.createElement('div');
    overlay.id = 'prohibicionOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(255, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Crear modal de intercepción
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        max-width: 500px;
        width: 90%;
        color: white;
        text-align: center;
        animation: slideInUp 0.4s ease-out;
        border: 3px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Lista de jugadores que pueden interceptar
    const listaJugadores = jugadoresConProhibicion.map(jugador => 
        `<span style="color: #ffd700; font-weight: bold;">${jugador}</span>`
    ).join(', ');
    
    modal.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem; animation: pulse 1s infinite;">🚫</div>
        <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 1rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">
            ¡INTERCEPCIÓN DISPONIBLE!
        </div>
        <div style="background: rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; backdrop-filter: blur(10px);">
            <div style="font-size: 1.2rem; margin-bottom: 0.8rem;">
                <strong>${jugadorUsando}</strong> está usando:
            </div>
            <div style="font-size: 1.1rem; font-weight: bold; color: #ffd700; margin-bottom: 0.8rem;">
                ${simplificarNombreComodin(comodin.nombre)}
            </div>
            <div style="font-size: 0.95rem; opacity: 0.9; line-height: 1.4;">
                ${comodin.texto || comodin.descripcion || ''}
            </div>
        </div>
        <div style="font-size: 1.1rem; margin-bottom: 1.5rem;">
            Jugadores que pueden interceptar:<br>
            ${listaJugadores}
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center; align-items: center;">
            <button id="btnUsar Prohibicion" style="
                padding: 1rem 2rem;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.1rem;
                backdrop-filter: blur(10px);
            ">
                🚫 ¡USAR PROHIBICIÓN!
            </button>
            <button id="btnPermitir" style="
                padding: 1rem 2rem;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.1rem;
                backdrop-filter: blur(10px);
            ">
                ✅ Permitir
            </button>
        </div>
        <div id="contadorProhibicion" style="
            font-size: 1rem; 
            opacity: 0.8; 
            margin-top: 1rem;
            animation: pulse 1s infinite;
        ">
            Tiempo restante: <span id="tiempoRestanteProhibicion">20</span> segundos
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Configurar botones
    const btnProhibir = document.getElementById('btnUsar Prohibicion');
    const btnPermitir = document.getElementById('btnPermitir');
    
    btnProhibir.onclick = () => usarProhibicion(jugadoresConProhibicion);
    btnPermitir.onclick = () => permitirComodin();
    
    // Hover effects
    [btnProhibir, btnPermitir].forEach(btn => {
        btn.onmouseover = () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        };
    });
    
    // Contador de tiempo (20 segundos para decidir)
    let tiempoRestante = 20;
    const spanTiempo = document.getElementById('tiempoRestanteProhibicion');
    
    tiempoLimiteProhibicion = setInterval(() => {
        tiempoRestante--;
        if (spanTiempo) {
            spanTiempo.textContent = tiempoRestante;
        }
 
        if (tiempoRestante <= 0) {
            // Tiempo agotado, permitir automáticamente
            permitirComodin();
        }
    }, 1000);
}

// Función para usar el comodín de prohibición
function usarProhibicion(jugadoresConProhibicion) {
    // Limpiar timeout
    if (tiempoLimiteProhibicion) {
        clearInterval(tiempoLimiteProhibicion);
        tiempoLimiteProhibicion = null;
    }
    
    // Si hay varios jugadores con prohibición, mostrar selector
    if (jugadoresConProhibicion.length > 1) {
        cerrarPopupProhibicion();
        mostrarSelectorJugadores(null, (jugadorProhibidor) => {
            ejecutarProhibicion(jugadorProhibidor);
        }, 'Selecciona quién usa la prohibición:', jugadoresConProhibicion);
    } else {
        ejecutarProhibicion(jugadoresConProhibicion[0]);
    }
}

// Función para ejecutar la prohibición
function ejecutarProhibicion(jugadorProhibidor) {
    // Encontrar y remover el comodín de prohibición del inventario
    const inventario = inventariosComodines[jugadorProhibidor] || [];
    const indiceProhibicion = inventario.findIndex(comodin => 
        comodin.nombre.toLowerCase() === '¡no!,¡te lo prohíbo!'
    );
    
    if (indiceProhibicion !== -1) {
        // Remover el comodín usado
        inventario.splice(indiceProhibicion, 1);
        
        // Mostrar mensaje de prohibición
        mostrarMensaje(`🚫 ${jugadorProhibidor} prohibió el comodín de ${jugadorUsandoComodin}!`, 'error');
        
        // Devolver el comodín original al mazo de comodines (NO al inventario del usuario)
        if (!mazos.comodines) {
            mazos.comodines = [];
        }
        mazos.comodines.push(comodinEnProceso);
        
        // Actualizar panel
        actualizarPanelJugadores();
        
        // Crear efectos visuales de prohibición
        crearEfectosProhibicion();
        
        // Cerrar popup y limpiar estado
        cerrarPopupProhibicion();
        limpiarEstadoProhibicion();
        
        // Mostrar mensaje final
        setTimeout(() => {
            mostrarMensaje(`El comodín fue bloqueado y devuelto a ${jugadorUsandoComodin}`, 'info');
        }, 1500);
    }
}

// Función para permitir el comodín (continuar normalmente)
function permitirComodin() {
    // Limpiar timeout
    if (tiempoLimiteProhibicion) {
        clearInterval(tiempoLimiteProhibicion);
        tiempoLimiteProhibicion = null;
    }
    
    cerrarPopupProhibicion();
    
    // Continuar con el efecto original del comodín
    ejecutarEfectoComodin(comodinEnProceso, jugadorUsandoComodin);
    
    limpiarEstadoProhibicion();
}

// Función para cerrar popup de prohibición
function cerrarPopupProhibicion() {
    const overlay = document.getElementById('prohibicionOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
}

// Función para limpiar estado de prohibición
function limpiarEstadoProhibicion() {
    comodinEnProceso = null;
    jugadorUsandoComodin = null;
    esperandoProhibicion = false;
    if (tiempoLimiteProhibicion) {
        clearInterval(tiempoLimiteProhibicion);
        tiempoLimiteProhibicion = null;
    }
}

// Función para crear efectos visuales de prohibición
function crearEfectosProhibicion() {
    // Crear múltiples elementos de prohibición
    for (let i = 0; i < 8; i++) {
        const efecto = document.createElement('div');
        efecto.style.cssText = `
            position: fixed;
            font-size: 3rem;
            color: #e74c3c;
            pointer-events: none;
            z-index: 10003;
            animation: efectoProhibicion 2s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        efecto.textContent = '🚫';
        
        // Posición aleatoria en la pantalla
        efecto.style.left = Math.random() * window.innerWidth + 'px';
        efecto.style.top = Math.random() * window.innerHeight + 'px';
        
        document.body.appendChild(efecto);
        
        // Remover después de la animación
        setTimeout(() => {
            if (document.body.contains(efecto)) {
                document.body.removeChild(efecto);
            }
        }, 2500);
    }
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#efectoProhibicionStyles')) {
        const style = document.createElement('style');
        style.id = 'efectoProhibicionStyles';
        style.textContent = `
            @keyframes efectoProhibicion {
                0% { 
                    transform: scale(0) rotate(0deg); 
                    opacity: 1; 
                }
                50% { 
                    transform: scale(1.5) rotate(180deg); 
                    opacity: 0.8; 
                }
                100% { 
                    transform: scale(0) rotate(360deg); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Función principal para ejecutar efectos de comodines (separada para el sistema de prohibición)
function ejecutarEfectoComodin(carta, nombreJugador) {
    const nombreComodin = carta.nombre.toLowerCase();
    
    switch (nombreComodin) {
        case '¡ganas un punto gratis!':
            aplicarPuntoGratis(nombreJugador, carta);
            break;
            
        case '¡resta un punto a un contrincante!':
            aplicarRestarPunto(nombreJugador, carta);
            break;
            
        case '¡reversa!':
            aplicarReversa(nombreJugador, carta);
            break;
            
        case '¡eres un ladrón de comodines!':
            aplicarLadronComodines(nombreJugador, carta);
            break;
            
        case 'escapa de la cárcel':
            aplicarEscapeCarcel(nombreJugador, carta);
            break;
            
        case 'construyendo el comodín':
            aplicarConstruirComodin(nombreJugador, carta);
            break;
            
        default:
            mostrarMensaje('Tipo de comodín no reconocido', 'error');
            return;
    }
}

// Función para habilitar las acciones del juego
function habilitarAccionesJuego() {
    // Habilitar botones de mazos
    document.querySelectorAll('.mazo').forEach(mazo => {
        mazo.style.pointerEvents = 'auto';
        mazo.style.opacity = '1';
    });
    
    // Habilitar botones de comodines
    document.querySelectorAll('.btn-comodin').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    // Habilitar botón de siguiente turno
    const btnSiguienteTurno = document.querySelector('.btn-siguiente-turno');
    if (btnSiguienteTurno) {
        btnSiguienteTurno.disabled = false;
        btnSiguienteTurno.style.opacity = '1';
    }
}

// Función para deshabilitar las acciones del juego
function deshabilitarAccionesJuego() {
    // Deshabilitar botones de mazos
    document.querySelectorAll('.mazo').forEach(mazo => {
        mazo.style.pointerEvents = 'none';
        mazo.style.opacity = '0.5';
    });
    
    // Deshabilitar botones de comodines
    document.querySelectorAll('.btn-comodin').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
    
    // Deshabilitar botón de siguiente turno
    const btnSiguienteTurno = document.querySelector('.btn-siguiente-turno');
    if (btnSiguienteTurno) {
        btnSiguienteTurno.disabled = true;
        btnSiguienteTurno.style.opacity = '0.5';
    }
    
    // Asegurar que el botón del dado esté visible y accesible
    const dadoTrigger = document.querySelector('.dado-trigger');
    if (dadoTrigger) {
        dadoTrigger.style.pointerEvents = 'auto';
        dadoTrigger.style.opacity = '1';
    }
}

