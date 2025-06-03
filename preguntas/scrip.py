import json
from collections import defaultdict

# Lista de imágenes
imagenes = [
    "https://i.postimg.cc/Kc1hzJBV/pagina-10-img-1.png",
    "https://i.postimg.cc/fRj6FFQ3/pagina-13-img-1.png",
    "https://i.postimg.cc/mrL0GwTm/pagina-14-img-1.png",
    "https://i.postimg.cc/43Wj49ds/pagina-15-img-1.png",
    "https://i.postimg.cc/bJdWZwDb/pagina-16-img-1.png",
    "https://i.postimg.cc/mDqqCWCn/pagina-17-img-1.png",
    "https://i.postimg.cc/gjZ7KtK2/pagina-18-img-1.png",
    "https://i.postimg.cc/3rsVw7K4/pagina-19-img-1.png",
    "https://i.postimg.cc/N0jPnjxV/pagina-1-img-1.png",
    "https://i.postimg.cc/NfRV9VMN/pagina-20-img-1.png",
    "https://i.postimg.cc/6pwPd04B/pagina-21-img-1.png",
    "https://i.postimg.cc/k4VYnYzv/pagina-22-img-1.png",
    "https://i.postimg.cc/dVBxnyGr/pagina-23-img-1.png",
    "https://i.postimg.cc/7h0BzGxC/pagina-24-img-1.png",
    "https://i.postimg.cc/W4YfccW4/pagina-2-img-1.png",
    "https://i.postimg.cc/cHV96MNy/pagina-3-img-1.png",
    "https://i.postimg.cc/v8V2kjWQ/pagina-4-img-1.png",
    "https://i.postimg.cc/gkbtWDD3/pagina-5-img-1.png",
    "https://i.postimg.cc/Hs0ZsyZR/pagina-6-img-1.png",
    "https://i.postimg.cc/cLXFfNNc/pagina-7-img-1.png",
    "https://i.postimg.cc/C5B7gZZP/pagina-8-img-1.png",
    "https://i.postimg.cc/sxkcDV7V/pagina-9-img-1.png",
    "https://i.postimg.cc/bwdrgQt2/pagina-25-img-1.png",
    "https://i.postimg.cc/mrHDfBVL/pagina-26-img-1.png",
    "https://i.postimg.cc/fRFLrJcq/pagina-27-img-1.png",
    "https://i.postimg.cc/tTGg9wmh/pagina-28-img-1.png",
    "https://i.postimg.cc/0QGyjnLh/pagina-29-img-1.png",
    "https://i.postimg.cc/8c1P6WGc/pagina-30-img-1.png",
    "https://i.postimg.cc/ZnVYFRYc/pagina-31-img-1.png",
    "https://i.postimg.cc/pVZdt0QF/pagina-32-img-1.png",
    "https://i.postimg.cc/HsvsrVhW/pagina-33-img-1.png",
    "https://i.postimg.cc/28SSj4TX/pagina-34-img-1.png",
    "https://i.postimg.cc/nhsVBpy4/pagina-35-img-1.png",
    "https://i.postimg.cc/rwvV97Tv/pagina-36-img-1.png",
    "https://i.postimg.cc/25hz9T83/pagina-37-img-1.png",
    "https://i.postimg.cc/vTHbBs76/pagina-38-img-1.png",
    "https://i.postimg.cc/B63JrDXp/pagina-39-img-1.png",
    "https://i.postimg.cc/k4y7q4Sm/pagina-39-img-2.png",
    "https://i.postimg.cc/L5CRgbvQ/pagina-40-img-1.png",
    "https://i.postimg.cc/J7PRFsm3/pagina-40-img-2.png",
    "https://i.postimg.cc/VLvzPzLx/pagina-41-img-1.png",
    "https://i.postimg.cc/m2nBbKPt/pagina-41-img-2.png",
    "https://i.postimg.cc/Vkb154t4/pagina-42-img-1.png",
    "https://i.postimg.cc/s2dzWS9z/pagina-42-img-2.png",
    "https://i.postimg.cc/6QrXf3Yv/pagina-43-img-2.png",
    "https://i.postimg.cc/ncXfwT3Z/pagina-44-img-1.jpg",
    "https://i.postimg.cc/HnhDk7sf/pagina-45-img-1.jpg",
    "https://i.postimg.cc/bYCjT4H3/pagina-46-img-1.jpg",
    "https://i.postimg.cc/5NDWcvrz/pagina-47-img-1.jpg",
    "https://i.postimg.cc/gj5QWFgp/pagina-48-img-1.jpg",
    "https://i.postimg.cc/zfSsRQGw/pagina-49-img-1.jpg",
    "https://i.postimg.cc/9FRsB0fQ/pagina-50-img-1.jpg",
    "https://i.postimg.cc/x8qhhTyg/pagina-51-img-1.jpg",
    "https://i.postimg.cc/c4p2kWKM/pagina-52-img-1.jpg",
    "https://i.postimg.cc/DyLBZXZL/pagina-54-img-1.jpg",
    "https://i.postimg.cc/XYgLK69v/pagina-55-img-1.jpg",
    "https://i.postimg.cc/tTszH1w1/pagina-56-img-1.jpg",
    "https://i.postimg.cc/ryt9nr53/pagina-57-img-1.jpg",
    "https://i.postimg.cc/xdxP7GxD/pagina-58-img-1.jpg",
    "https://i.postimg.cc/XYxKGc0G/pagina-59-img-1.jpg",
    "https://i.postimg.cc/903y5LyS/pagina-60-img-1.jpg",
    "https://i.postimg.cc/9Mwyn6wZ/pagina-61-img-1.jpg",
    "https://i.postimg.cc/SNfC37RT/pagina-62-img-1.jpg",
    "https://i.postimg.cc/Y2g1fwHw/pagina-63-img-1.jpg",
    "https://i.postimg.cc/nhVBJjQH/pagina-64-img-1.jpg",
    "https://i.postimg.cc/8Cjv72H9/pagina-65-img-1.jpg",
    "https://i.postimg.cc/TPFDgtNw/pagina-66-img-1.jpg",
    "https://i.postimg.cc/2yfLXVDN/pagina-67-img-1.jpg",
    "https://i.postimg.cc/G2DsQv6j/pagina-68-img-1.jpg",
    "https://i.postimg.cc/J7bkHcNr/pagina-69-img-1.jpg",
    "https://i.postimg.cc/Wz6qRTNF/pagina-70-img-1.jpg",
    "https://i.postimg.cc/52tYrhZy/pagina-71-img-1.jpg",
    "https://i.postimg.cc/ncpQ4j2v/pagina-72-img-1.jpg",
    "https://i.postimg.cc/0jxr0FY8/pagina-73-img-1.jpg",
    "https://i.postimg.cc/T3HLvk69/pagina-74-img-1.jpg",
    "https://i.postimg.cc/q7htJ8Bd/pagina-75-img-1.jpg",
    "https://i.postimg.cc/FR07cNJW/pagina-76-img-1.jpg",
    "https://i.postimg.cc/fyKy2CCY/pagina-77-img-1.jpg",
]

# Diccionario: número de página -> lista de URLs
pagina_to_urls = defaultdict(list)

for url in imagenes:
    try:
        numero = int(url.split("pagina-")[1].split("-img")[0])
        pagina_to_urls[numero].append(url)
    except:
        continue

# Lista de preguntas (ejemplo)
datos = [
    {
        "id": 1,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el siguiente gráfico, ¿Cuál es el deporte que más prefieren los estudiantes del 8vo básico?",
        "respuesta": "Fútbol",
        "imagenDelantera": "https://i.postimg.cc/N0jPnjxV/pagina-1-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 2,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "La cafetería de la escuela registró las ventas (en pesos chilenos) de diferentes tipos de alimentos durante la primera semana de clases. ¿Qué alimento fue el más vendido y que alimento fue el menos vendido según el gráfico de barras?",
        "respuesta": "Empanada y Huevo duro respectivamente",
        "imagenDelantera": "https://i.postimg.cc/W4YfccW4/pagina-2-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 3,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "En un curso de 40 estudiantes, se les preguntó cuál es su asignatura favorita. El gráfico de barras muestra cuántos prefieren Matemáticas, Ciencias, Lenguaje e Historia. Según el gráfico, ¿qué asignatura tiene más estudiantes que la prefieren y cuál tiene menos?",
        "respuesta": "Lenguaje y ciencias respectivamente",
        "imagenDelantera": "https://i.postimg.cc/cHV96MNy/pagina-3-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 4,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "En un curso de 37 estudiantes, se realizó una encuesta sobre la frecuencia de uso de redes sociales. Según el gráfico de barras, ¿Cuál es la opción más común y cuál es la menos frecuente?",
        "respuesta": "\"Todos los días\" y \"Casi nunca\" respectivamente",
        "imagenDelantera": "https://i.postimg.cc/v8V2kjWQ/pagina-4-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 5,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "En una encuesta realizada a 38 estudiantes de 7mo básico sobre sus servicios de streaming favoritos, se recogieron las siguientes respuestas. ¿Qué servicio de streaming es el favorito entre los estudiantes y cuál es el menos preferido?",
        "respuesta": "Netflix, HBO+, y Twitch respectivamente",
        "imagenDelantera": "https://i.postimg.cc/gkbtWDD3/pagina-5-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 6,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "En una encuesta realizada a 50 personas sobre sus desayunos preferidos, se recogieron las siguientes respuestas. ¿Cuál es el desayuno que tiene el doble de preferencias que el menos popular?",
        "respuesta": "Frutas",
        "imagenDelantera": "https://i.postimg.cc/Hs0ZsyZR/pagina-6-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 7,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el siguiente gráfico, en Antofagasta, ¿Qué mes del año 2023 promedió la temperatura más alta?",
        "respuesta": "Febrero",
        "imagenDelantera": "https://i.postimg.cc/cLXFfNNc/pagina-7-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 8,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Se realizó un seguimiento del crecimiento de una planta cada semana durante un mes, y se mostró en un gráfico de líneas. Observando el gráfico, ¿en qué semana se produjo el mayor aumento en la altura de la planta con respecto a la semana anterior?",
        "respuesta": "Semana 3",
        "imagenDelantera": "https://i.postimg.cc/C5B7gZZP/pagina-8-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 9,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Se registró el promedio de coronas obtenidas en Clash Royale por un grupo de estudiantes durante una semana y se mostró en un gráfico lineal. Observando el gráfico, ¿en qué día de la semana se obtuvo el promedio más alto de coronas?",
        "respuesta": "Viernes",
        "imagenDelantera": "https://i.postimg.cc/sxkcDV7V/pagina-9-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 10,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "En el gráfico se muestra el consumo diario de agua en litros de una persona durante una semana. Si el consumo promedio de agua recomendado por día es de 3 litros, ¿cuántos días de la semana la persona consumió menos de esa cantidad?",
        "respuesta": "4 días (Lunes, miércoles, jueves y viernes)",
        "imagenDelantera": "https://i.postimg.cc/Kc1hzJBV/pagina-10-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 11,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Un estudiante del tercero medio A está vendiendo dulces para poder costearse un instrumento musical, en su primera semana vendiendo hizo un gráfico con las ventas por día de cada uno de los dulces que vendió. Analizando el gráfico, ¿Qué dulce generó menos ganancias durante la semana?",
        "respuesta": "Bonobon",
        "imagenDelantera": "https://i.postimg.cc/T2BMWgcP/pagina-11-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 12,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el gráfico, ¿Cúal es el animal que menos prefieren en el séptimo básico A?",
        "respuesta": "Erizos",
        "imagenDelantera": "https://i.postimg.cc/vH9R7TPt/pagina-12-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 13,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Se le preguntó a 35 estudiantes de segundo medio que actividad extracurricular preferían. Analizando el gráfico, ¿qué actividad extracurricular es la más preferida?",
        "respuesta": "La danza y el dibujo",
        "imagenDelantera": "https://i.postimg.cc/fRj6FFQ3/pagina-13-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 14,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "En un primero medio de 32 estudiantes se realizó una encuesta para saber cual es el juego favorito del curso. Analizando el gráfico, mencione los juegos en orden de: menor preferencia a mayor preferencia.",
        "respuesta": "Free fire, COD MOBILE, Clash Royale, Brawl Stars, Roblox",
        "imagenDelantera": "https://i.postimg.cc/mrL0GwTm/pagina-14-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 15,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "El siguiente pictograma muestra seis países y la cantidad de lanzamientos de cohetes que han hecho el año 2022. Analizando el gráfico, ¿Cuántos lanzamientos en total han hecho los dos países con más lanzamientos?.",
        "respuesta": "56 lanzamientos en total (Entre Rusia y EE.UU)",
        "imagenDelantera": "https://i.postimg.cc/43Wj49ds/pagina-15-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 16,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "El siguiente pictograma muestra la estatura de la familia Simpson. Analizando el gráfico. ¿Quiénes poseen la misma altura?, además, ¿Quién es el miembro de la familia más alto/a?.",
        "respuesta": "Bart y Lisa poseen la misma altura, además Marge es la más alta",
        "imagenDelantera": "https://i.postimg.cc/bJdWZwDb/pagina-16-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 17,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el siguiente gráfico, ¿Cuál es la fruta que más se prefiere?",
        "respuesta": "Naranja",
        "imagenDelantera": "https://i.postimg.cc/mDqqCWCn/pagina-17-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 18,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el siguiente gráfico, ¿Cuál es el método de transporte que más se utiliza para ir al colegio?",
        "respuesta": "Micro",
        "imagenDelantera": "https://i.postimg.cc/gjZ7KtK2/pagina-18-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 19,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "En una fiesta, unos amigos eligieron entre diferentes sabores de pizza. ¿Qué sabor de pizza prefirieron más estudiantes según el gráfico?, ¿Qué sabor de pizza prefieren menos?.",
        "respuesta": "Napolitana y pesto respectivamente",
        "imagenDelantera": "https://i.postimg.cc/3rsVw7K4/pagina-19-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 20,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Según el gráfico que muestra las edades de los estudiantes, ¿cuántos estudiantes tienen 12 años en el curso?.",
        "respuesta": "20 Estudiantes",
        "imagenDelantera": "https://i.postimg.cc/NfRV9VMN/pagina-20-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 21,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Se hizo una encuesta a 2225 aficionados al KPOP en la región de Antofagasta, preguntándoles cuáles son su grupo de kpop preferido. Analizando el gráfico, ¿Qué porcentaje de aficionados prefiere New Jeans o Seventeen?",
        "respuesta": "41,5% de los aficionados prefiere New Jeans o Seventeen",
        "imagenDelantera": "https://i.postimg.cc/6pwPd04B/pagina-21-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 22,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el gráfico, ¿Qué comunas de la región metropolitana tienen un porcentaje de mujeres que trabaja como servicio doméstico puertas adentro mayor al 10%? Nombre al menos dos.",
        "respuesta": "Lo Barnechea, Vitacura, Las Condes, Colina",
        "imagenDelantera": "https://i.postimg.cc/k4VYnYzv/pagina-22-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 23,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el gráfico, ¿Qué zona (norte, centro o sur) de la ciudad de Antofagasta tiene mayor porcentaje de población de adultos?",
        "respuesta": "Zona sur",
        "imagenDelantera": "https://i.postimg.cc/dVBxnyGr/pagina-23-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 24,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el gráfico, ¿Qué comunas de la región metropolitana tuvieron una temperatura media más baja en comparación a las comunas que su temperatura media fue mayor a 33.1 grados? Nombre al menos dos.",
        "respuesta": "Vitacura, Lo Barnechea, Las Condes, Providencia, Peñalolén",
        "imagenDelantera": "https://i.postimg.cc/7h0BzGxC/pagina-24-img-1.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 25,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el gráfico. ¿Cuáles usos y destinos del suelo se encuentran más frecuentemente a lo largo de toda la ciudad?.",
        "respuesta": "Habitacional, comercio y servicios",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 26,
        "nombre": "Analiza el gráfico",
        "tipo": "Pregunta",
        "pregunta": "Analizando el gráfico. ¿En qué zona de la ciudad se observan los puntajes más bajos y más altos?",
        "respuesta": "Zona centro (puntajes bajos) y zona sur (puntajes altos)",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 27,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando la cantidad de hermanos que tenían. ¿Cuántos niños fueron encuestados?",
        "respuesta": "20",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 28,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando la cantidad de hermanos que tenían. ¿Cuántos niños tienen dos hermanos?",
        "respuesta": "7",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 29,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando la cantidad de hermanos que tenían.¿Cuántos niños tienen al menos dos hermanos?",
        "respuesta": "10",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 30,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando la cantidad de hermanos que tenían.¿Cuántos niños tienen tres hermanos?",
        "respuesta": "3",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 31,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando el deporte que más prefieren.¿Cuál es la moda de la variable deporte?",
        "respuesta": "Fútbol",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 32,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando el deporte que más prefieren.¿Qué porcentaje de niños prefiere el fútbol? ",
        "respuesta": "35%",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 33,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando el deporte que más prefieren.¿Qué porcentaje de niños prefiere natación? ",
        "respuesta": "30%",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 34,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando el deporte que más prefieren.¿Cuántos niños fueron encuestados?",
        "respuesta": "20",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 35,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando el deporte que más prefieren.¿Cuál es la moda de los datos anteriores?",
        "respuesta": "Un hermano",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 36,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "Se realizó una encuesta a niños de la ciudad de antofagasta preguntando el deporte que más prefieren.¿Cuántos hermanos, en promedio, tienen los niños encuestados?",
        "alternativas": "a. 1, b. 1,3,c. 1,4,d. 1,5,e. 2",
        "respuesta": "b",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 37,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "¿Cuál es la moda en la tabla anterior?",
        "respuesta": "4",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 38,
        "nombre": "Analiza la tabla",
        "tipo": "Pregunta",
        "pregunta": "¿Qué gráfico sería más adecuado para representar los datos?",
        "alternativas": " a. Barras.b. Circular.c. Líneas.d. Barras agrupadas.",
        "respuesta": "a",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 39,
        "nombre": "VERDADERO O FALSO",
        "tipo": "Verdadero/Falso",
        "pregunta": "Los dos gráficos que se presentan contienen la misma información",
        "respuesta": "Falso",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 40,
        "nombre": "VERDADERO O FALSO",
        "tipo": "Verdadero/Falso",
        "pregunta": "Los dos gráficos que se presentan contienen la misma información",
        "respuesta": "Verdadero",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 41,
        "nombre": "VERDADERO O FALSO",
        "tipo": "Verdadero/Falso",
        "pregunta": "Los dos gráficos que se presentan contienen la misma información",
        "respuesta": "Verdadero",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 42,
        "nombre": "VERDADERO O FALSO",
        "tipo": "Verdadero/Falso",
        "pregunta": "Los dos gráficos que se presentan contienen la misma información",
        "respuesta": "Falso",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 43,
        "nombre": "VERDADERO O FALSO",
        "tipo": "Verdadero/Falso",
        "pregunta": "Los dos gráficos que se presentan contienen la misma información",
        "respuesta": "Falso",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 44,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "El total de objetos bajo consideración del que se selecciona una muestra se llama:",
        "alternativas": [
            "Población",
            "Descripción",
            "Parámetro",
            "Estadística"
        ],
        "respuesta": "Población",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 45,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "La parte del universo escogida para hacer el análisis estadístico se llama:",
        "alternativas": [
            "Ejemplo",
            "Selección",
            "Muestra",
            "Censo"
        ],
        "respuesta": "Muestra",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 46,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "El proceso estadístico incluye todos los siguientes aspectos EXCEPTO:",
        "alternativas": [
            "Recolección de datos",
            "Representación de datos",
            "Toma de decisiones",
            "Presentación de recomendaciones"
        ],
        "respuesta": "Presentación de recomendaciones",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 47,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Cuál de las siguientes alternativas representa un dato cualitativo?",
        "alternativas": [
            "Preferencia de marca de refresco",
            "Tiempo que demora un estudiante en realizar una prueba",
            "La edad de las personas que asisten a un concierto",
            "El peso de las personas después de hacer ejercicios"
        ],
        "respuesta": "Preferencia de marca de refresco",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 48,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Cuál de las siguientes alternativas representa un dato cuantitativo?",
        "alternativas": [
            "Preferencias musicales de los alumnos del 7mo A",
            "La estatura de los jugadores de la selección chilena de fútbol",
            "Nivel de complejidad de una evaluación en matemáticas",
            "Estado de avance de la remodelación de un edificio"
        ],
        "respuesta": "La estatura de los jugadores de la selección chilena de fútbol",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 49,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Cuál de las siguientes afirmaciones es falsa?",
        "alternativas": [
            "Una muestra está contenida en la población",
            "La masa de una persona es una variable cuantitativa",
            "El promedio es el dato que más se repite",
            "Para obtener la mediana de una muestra esta debe estar ordenada de menor a mayor",
            "La variable es la característica que se desea medir"
        ],
        "respuesta": "El promedio es el dato que más se repite",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 50,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Se quiere recopilar información sobre la cantidad de horas a la semana que dedica la gente a ver televisión. ¿Cuál de las siguientes preguntas sería la más adecuada?",
        "alternativas": [
            "¿Ves televisión todos los días?",
            "¿Cuántos días a la semana ves televisión?",
            "¿Qué tipo de programas televisivos dedicas a ver?",
            "¿Cuántas horas a la semana dedicas a ver televisión?",
            "¿Es aconsejable ver televisión todos los días?"
        ],
        "respuesta": "¿Cuántas horas a la semana dedicas a ver televisión?",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 51,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Cuál de las siguientes alternativas no corresponde a una variable cualitativa?",
        "alternativas": [
            "Color de pelo",
            "Raza de un perro",
            "Lugar de nacimiento",
            "Cantidad de hermanos",
            "Color favorito"
        ],
        "respuesta": "Cantidad de hermanos",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 52,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "En un curso de 45 estudiantes, 25 son mujeres. En una muestra proporcional de 9 estudiantes, ¿cuántos hombres habrá?",
        "alternativas": [
            "4 hombres",
            "5 hombres",
            "6 hombres",
            "7 hombres"
        ],
        "respuesta": "4 hombres",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 53,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "El rango de los datos 6, 4, 8, 10, 3, 2, 4, 5, 6, 4 es:",
        "alternativas": [
            "2",
            "7",
            "8",
            "12"
        ],
        "respuesta": "8",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 54,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "La media de un grupo de datos es:",
        "alternativas": [
            "Mayor frecuencia absoluta",
            "El promedio de los datos",
            "Dato de mayor frecuencia absoluta",
            "Dato central entre los datos ordenados"
        ],
        "respuesta": "El promedio de los datos",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 55,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "La moda de un grupo de datos es:",
        "alternativas": [
            "Mayor frecuencia absoluta",
            "Mayor frecuencia relativa",
            "Dato de mayor frecuencia absoluta",
            "Dato central entre los datos ordenados"
        ],
        "respuesta": "Dato de mayor frecuencia absoluta",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 56,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Cuál corresponde a un experimento aleatorio?",
        "alternativas": [
            "Salida del sol",
            "Lanzar un dado",
            "Colocar hielo al agua caliente",
            "Medir la masa corporal con una balanza"
        ],
        "respuesta": "Lanzar un dado",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 57,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Si se elige al azar un número del 1 al 15, ¿cuál es la probabilidad de que sea un múltiplo de 3?",
        "alternativas": [
            "1 de 15",
            "3 de 15",
            "5 de 15",
            "7 de 15"
        ],
        "respuesta": "5 de 15",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 58,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "En una muestra de pacientes, el número de varones dividido entre el total de pacientes es:",
        "alternativas": [
            "Una frecuencia relativa",
            "Una frecuencia absoluta",
            "Una variable cuantitativa",
            "Una variable cualitativa",
            "Un valor de la variable"
        ],
        "respuesta": "Una frecuencia relativa",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 59,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Cuál de las siguientes medidas define mejor la tendencia central de los datos: 5, 4, 42, 4, 6?",
        "alternativas": [
            "La mediana",
            "La media",
            "El sesgo",
            "El rango",
            "La proporción"
        ],
        "respuesta": "La mediana",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 60,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "La mediana de un grupo de datos es:",
        "alternativas": [
            "Mayor frecuencia absoluta",
            "El promedio de los datos",
            "Dato de mayor frecuencia absoluta",
            "Dato central entre los datos ordenados"
        ],
        "respuesta": "Dato central entre los datos ordenados",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 61,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Las siguientes son las medidas de tendencias central, excepto:",
        "alternativas": [
            "La media",
            "La moda",
            "La mediana",
            "El rango"
        ],
        "respuesta": "El rango",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 62,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Las medidas de tendencia central, en cuanto a la información que ofrecen sobre una variable numérica, preferimos:",
        "alternativas": [
            "Media, mediana, moda",
            "Moda, media, mediana",
            "Media, moda, mediana",
            "No se puede en general recomendar una como mejor que las otras",
            "Todo lo anterior es falso"
        ],
        "respuesta": "No se puede en general recomendar una como mejor que las otras",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 63,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Respecto a la moda, es incorrecto:",
        "alternativas": [
            "La moda puede ser no única",
            "La moda es el valor con mayor frecuencia",
            "Es posible que una distribución no tenga moda",
            "La moda siempre está en el centro de los datos ordenados"
        ],
        "respuesta": "La moda siempre está en el centro de los datos ordenados",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 64,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Respecto a la media, es incorrecto:",
        "alternativas": [
            "La media es el promedio de todos los valores en un conjunto de datos",
            "La media puede cambiar si se modifica alguno de los datos en el conjunto",
            "La media siempre es el número del medio cuando los datos están ordenados"
        ],
        "respuesta": "La media siempre es el número del medio cuando los datos están ordenados",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 65,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Señale cuál de las siguientes afirmaciones es falsa:",
        "alternativas": [
            "La aparición o no de bacterias en un cultivo es una variable dicotómica",
            "La estatura de un individuo es una variable cuantitativa discreta",
            "El lugar que ocupa una persona entre sus hermanos es una variable ordinal",
            "El estado civil es una variable cualitativa"
        ],
        "respuesta": "La estatura de un individuo es una variable cuantitativa discreta",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 66,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Cuál de las siguientes características no se corresponde con el concepto de mediana?",
        "alternativas": [
            "Es el valor que equilibra el conjunto de datos",
            "No se ve afectada por los valores extremos",
            "Deja por debajo el mismo número de datos que por encima",
            "Es el segundo cuartil"
        ],
        "respuesta": "Es el valor que equilibra el conjunto de datos",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 67,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Respecto a la mediana, es incorrecto:",
        "alternativas": [
            "La mediana es el valor que está en el centro cuando los datos están ordenados",
            "La mediana puede ser el valor promedio de dos números si hay un número par de datos",
            "La mediana siempre es el valor más frecuente en un conjunto de datos"
        ],
        "respuesta": "La mediana siempre es el valor más frecuente en un conjunto de datos",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 68,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Los gráficos de barras son útiles para mostrar:",
        "alternativas": [
            "La distribución de una sola categoría dentro de un grupo",
            "La comparación de diferentes categorías en un solo conjunto de datos",
            "Cómo se agrupan los datos en intervalos de tiempo",
            "La relación entre dos variables numéricas",
            "La proporción de un grupo en relación con el total"
        ],
        "respuesta": "La comparación de diferentes categorías en un solo conjunto de datos",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 69,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Para qué es más útil un gráfico lineal?",
        "alternativas": [
            "Mostrar la distribución de una sola categoría",
            "Comparar diferentes categorías en un solo conjunto de datos",
            "Representar cómo cambian los datos a lo largo del tiempo",
            "Mostrar la frecuencia de diferentes categorías"
        ],
        "respuesta": "Representar cómo cambian los datos a lo largo del tiempo",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 70,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Los gráficos circulares son muy útiles para comparar:",
        "alternativas": [
            "Cómo se distribuye una sola categoría dentro de un grupo",
            "Cómo se comparan dos variables numéricas",
            "Las diferencias entre dos tipos de datos cualitativos",
            "Cómo varía una variable en diferentes grupos",
            "La relación entre dos conjuntos de datos diferentes"
        ],
        "respuesta": "Cómo se distribuye una sola categoría dentro de un grupo",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 71,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "En cierta población se observa la distribución de los grupos sanguíneos. Si queremos resumir la información obtenida podemos utilizar:",
        "alternativas": [
            "Moda",
            "Mediana",
            "Frecuencias acumuladas absolutas",
            "Frecuencias relativas",
            "Nada de lo anterior"
        ],
        "respuesta": "Frecuencias relativas",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 72,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Qué representa mejor un pictograma?",
        "alternativas": [
            "La relación entre dos variables numéricas",
            "La frecuencia de diferentes categorías utilizando imágenes o símbolos",
            "Cómo se distribuyen los datos en intervalos",
            "La comparación de categorías usando barras verticales"
        ],
        "respuesta": "La frecuencia de diferentes categorías utilizando imágenes o símbolos",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 73,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Para qué se utiliza un mapa coroplético?",
        "alternativas": [
            "Mostrar cómo cambian los datos a lo largo del tiempo en un gráfico",
            "Comparar la frecuencia de diferentes categorías usando gráficos de barras",
            "Representar datos geográficos y la intensidad de una variable en diferentes regiones"
        ],
        "respuesta": "Representar datos geográficos y la intensidad de una variable en diferentes regiones",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 74,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "¿Respecto a los gráficos de barras, es incorrecto:",
        "alternativas": [
            "Permiten comparar diferentes categorías de datos",
            "Utilizan barras verticales u horizontales para mostrar la frecuencia de cada categoría",
            "Son útiles para mostrar la evolución de una variable a lo largo del tiempo"
        ],
        "respuesta": "Son útiles para mostrar la evolución de una variable a lo largo del tiempo",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 75,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Respecto a los gráficos lineales, es incorrecto:",
        "alternativas": [
            "Son útiles para mostrar cómo cambian los datos a lo largo del tiempo",
            "Pueden representar datos en intervalos de tiempo continuos",
            "Utilizan líneas para conectar puntos de datos y mostrar tendencias",
            "Son ideales para comparar frecuencias de diferentes categorías"
        ],
        "respuesta": "Son ideales para comparar frecuencias de diferentes categorías",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 76,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Respecto a los pictogramas, es incorrecto:",
        "alternativas": [
            "Utilizan imágenes o símbolos para representar la cantidad de datos",
            "Son útiles para comparar diferentes categorías visualmente",
            "La cantidad representada por cada imagen o símbolo puede variar según la escala",
            "Son ideales para mostrar cómo cambian los datos a lo largo del tiempo"
        ],
        "respuesta": "Son ideales para mostrar cómo cambian los datos a lo largo del tiempo",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 77,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Respecto a los gráficos circulares, es incorrecto:",
        "alternativas": [
            "Muestran la proporción de cada categoría dentro de un todo",
            "Son útiles para comparar la cantidad de diferentes categorías en un solo gráfico",
            "Cada sector representa una parte proporcional del total",
            "Son más adecuados para representar distribuciones de una sola variable"
        ],
        "respuesta": "Son útiles para comparar la cantidad de diferentes categorías en un solo gráfico",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    },
    {
        "id": 78,
        "nombre": "CONCEPTOS",
        "tipo": "Alternativas",
        "pregunta": "Respecto a los mapas coropléticos, es incorrecto:",
        "alternativas": [
            "Representan la intensidad de una variable en diferentes áreas geográficas",
            "Utilizan colores o patrones para mostrar variaciones en datos geográficos",
            "Son útiles para comparar frecuencias de categorías dentro de un gráfico"
        ],
        "respuesta": "Utilizan colores o patrones para mostrar variaciones en datos geográficos",
        "imagenDelantera": "https://ejemplo.com/imagen-delantera.png",
        "imagenTrasera": "https://ejemplo.com/imagen-trasera.png"
    }
]

# Actualizar imágenes
for item in datos:
    id_ = item["id"]
    imagenes_pagina = pagina_to_urls.get(id_, [])

    if len(imagenes_pagina) > 0:
        item["imagenDelantera"] = imagenes_pagina[0]
    if len(imagenes_pagina) > 1:
        item["imagenTrasera2"] = imagenes_pagina[1]

# Mostrar resultado
print(json.dumps(datos, indent=2, ensure_ascii=False))
