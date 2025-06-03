# 🎮 GrafiCando - Juego de Cartas Interactivo

Una aplicación web interactiva de juego de cartas con múltiples mazos, gestión de jugadores y funcionalidades avanzadas.

## 🌟 Características Principales

- **🎲 Dado Auto-lanzable**: Sistema de dado con animaciones épicas
- **⏰ Contador de Tiempo**: Contador compacto para cartas de pregunta (45 segundos)
- **👥 Gestión de Jugadores**: Sistema completo de administración de jugadores
- **🎯 Tres Tipos de Mazos**:
  - 🃏 **Comodines**: Cartas especiales
  - ❓ **Preguntas**: Con contador de tiempo automático
  - 📚 **Datos Curiosos**: Información interesante

## 🚀 Funcionalidades

### 🎮 Sistema de Juego
- Configuración inicial de jugadores (mínimo 2)
- Orden aleatorio de turnos
- Sistema de puntuación
- Anuncios de turno con efectos visuales

### 📱 Diseño Responsive
- **Móviles**: Interfaz optimizada con panel colapsable
- **Tablets**: Tamaños intermedios adaptativos
- **Desktop**: Experiencia completa con todas las funcionalidades

### ⚡ Características Técnicas
- **Auto-recarga**: Servidor con live-reload para desarrollo
- **Animaciones**: Efectos visuales avanzados con CSS
- **Gestión de Estado**: JavaScript vanilla optimizado
- **UI/UX**: Diseño moderno con gradientes y efectos

## 🛠️ Instalación y Uso

### Requisitos
- Navegador web moderno
- Node.js (para el servidor de desarrollo)

### Instalación
1. Clona este repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd GrafiCando-main
   ```

2. Inicia el servidor local:
   ```bash
   npx live-server --port=8080 --open=/index.html
   ```

3. Abre tu navegador en `http://localhost:8080`

## 🎯 Cómo Jugar

1. **Configuración**: Ingresa los nombres de los jugadores (mínimo 2)
2. **Orden**: El sistema mezclará automáticamente el orden de turnos
3. **Juego**: 
   - Haz clic en cualquier mazo para sacar una carta
   - Las cartas de pregunta activan el contador automáticamente
   - Usa el dado 🎲 cuando sea necesario
4. **Gestión**: Agrega o elimina jugadores durante la partida

## 📂 Estructura del Proyecto

```
GrafiCando-main/
├── index.html          # Archivo principal HTML
├── styles.css          # Estilos CSS con animaciones
├── main.js             # Lógica principal del juego
├── img/                # Imágenes de las cartas
│   └── parteTrasera/   # Imágenes traseras de los mazos
├── README.md           # Este archivo
└── .gitignore          # Archivos excluidos de Git
```

## 🎨 Características Visuales

- **Animaciones suaves**: Transiciones CSS optimizadas
- **Efectos de partículas**: Sistema de partículas para eventos especiales
- **Gradientes modernos**: Paleta de colores atractiva
- **Iconos emoji**: Interfaz amigable y expresiva

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Animaciones y diseño responsive
- **JavaScript ES6+**: Lógica del juego
- **Tailwind CSS**: Framework de utilidades CSS
- **Live Server**: Servidor de desarrollo con hot-reload

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎉 Créditos

Desarrollado con ❤️ para crear experiencias de juego divertidas e interactivas.

---

⭐ ¡No olvides darle una estrella al proyecto si te gusta!
