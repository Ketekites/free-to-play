'use strict'

// https://www.freetogame.com/api-doc /////////////////////////////////////////////

// VARIABLES /////////////////////////////////////////////

var plataforma, genero, sort;
var click = false;

// SOLICITUD /////////////////////////////////////////////

function solicitud(value){
    return {
        "async": true,
        "crossDomain": true,
        "url": 'https://free-to-play-games-database.p.rapidapi.com/api/'+value+'',
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
            "x-rapidapi-key": "7ced91a298msha34e43f43240611p1beb66jsne7d357fe4ce1"
        }
    };
};

// PINTAR DATOS /////////////////////////////////////////////

// Pintamos en el header el total de juegos de PC y Web
function pintarTotales(plataforma,response){
    $('#'+plataforma+'').append('<p id="totalheader">'+response.length+'</p>');
};
// Pintamos los juegos que nos llegan en un response
function pintarRespuesta(response,sortby){
    response.forEach(element => {
        if(sortby != "release-date") {
            $("#contenido").append('<article><div class="tarjeta" id="elemento'+element.id+'"><img src="'+element.thumbnail+'"><p>'+element.title+'</p></div><div id="descripcion">'+element.short_description+'</div><div id="tags"><p class="genero" id="genero'+element.id+'">'+element.genre+'</p><p class="plataforma" id="plataforma'+element.id+'">'+element.platform+'</p></div></article>');
        } else {
            $("#contenido").append('<article><div class="tarjeta" id="elemento'+element.id+'"><img src="'+element.thumbnail+'"><p>'+element.title+'</p></div><div id="descripcion">'+element.short_description+'</div><div id="tags"><p class="releasedate" id="filtro'+element.id+'">'+element.release_date+'</p><p class="genero" id="genero'+element.id+'">'+element.genre+'</p><p class="plataforma" id="plataforma'+element.id+'">'+element.platform+'</p></div></article>');
        };
    });
};
// Pintamos un juego concreto
function pintarDetalleJuego(id) {
    // Vaciamos el contenido del section actual y creamos el section juego
    vaciarContenido(document.getElementsByTagName("section")[1].id,"juego");
    // Solicitamos un juego por su id...
    $.get(solicitud('game?id='+id),function(response){;
        // ...y lo pintamos
        // Controlamos los juegos que no del detalle de los requisitos
        // La funcion arrayImagenes pinta las imagenes que haya disponibles (si es que las hay)
        if(!response.minimum_system_requirements) {
            $("#juego").append('<article id="infoimagenes"><section id="thumbnail"><img src="'+response.thumbnail+'"></section><h1 id="h1gris">Galería de imágenes</h1><section id="imagenes">'+arrayImagenes(response.screenshots)+'</section></article><article id="infojuego"><h1>'+response.title+'</h1><section id="sobre"><div>Género<p>'+response.genre+'</p></div><div>Plataforma<p>'+response.platform+'</p></div><div>Estreno<p>'+response.release_date+'</p></div><div>Estado<p>'+response.status+'</p></div><div>Publicado por<p>'+response.publisher+'</p></div><div>Desarrollado por<p>'+response.developer+'</p></div></section><h1>Descripción</h1><section id="descripcionjuego">'+response.description+'</section><section><h1>Requisitos mínimos</h1><p>No hay requisitos que mostrar</p></section></article>');
        } else {
            $("#juego").append('<article id="infoimagenes"><section id="thumbnail"><img src="'+response.thumbnail+'"></section><h1 id="h1gris">Galería de imágenes</h1><section id="imagenes">'+arrayImagenes(response.screenshots)+'</section></article><article id="infojuego"><h1>'+response.title+'</h1><section id="sobre"><div>Género<p>'+response.genre+'</p></div><div>Plataforma<p>'+response.platform+'</p></div><div>Estreno<p>'+response.release_date+'</p></div><div>Estado<p>'+response.status+'</p></div><div>Publicado por<p>'+response.publisher+'</p></div><div>Desarrollado por<p>'+response.developer+'</p></div></section><h1>Descripción</h1><section id="descripcionjuego">'+response.description+'</section><h1>Requisitos mínimos</h1><section id="sobre"><div>Sistema Operativo<p>'+response.minimum_system_requirements.os+'</p></div><div>Procesador<p>'+response.minimum_system_requirements.processor+'</p></div><div>Gráfica<p>'+response.minimum_system_requirements.graphics+'</p></div><div>Memoria<p>'+response.minimum_system_requirements.memory+'</p></div><div>Espacio en disco<p>'+response.minimum_system_requirements.storage+'</p></div></section></article>');
            // Añadimos por css una imagen de fondo escogida al azar entre las disponibles
            $("body").append('<style>body::before{content: ""; background: url('+response.screenshots[Math.floor(Math.random()*response.screenshots.length)].image+'); background-size: cover; position: fixed !important; top: 0px; bottom: 0px; left: 0px; right: 0px; opacity: 0.3; z-index: -1;}</style>');
            // Asignamos el evento click a las imagenes para poder visualizarlas a mayor tamaño
            for (let index = 0; index < response.screenshots.length; index++) {            
                $("#juego").on("click",'#imagen'+index,function(){
                    if(!click){
                        $('#imagen'+index).css("transform","scale(4.0)");
                        $('#imagen'+index).css("z-index","4");
                        click=!click;
                    } else {
                        $('#imagen'+index).css("transform","scale(1.0)");
                        $('#imagen'+index).css("z-index","0");
                        click=!click;
                    };
                });
            };
        };
    });
};
// Pintamos los juegos por género
function pintarJuegosPorGenero(genre){
    // Controlamos algunos generos cuyos nombres cambian en las peticiones
    switch (genre) {
        case " MMORPG":
            genero = "mmorpg";
            break;
        case "Card Game":
            genero = "card";
            break;
        case "Action RPG":
            genero = "action-rpg";
            break;
        case "ARPG":
            genero = "action-rpg";
            break;
        case "Battle Royale":
            genero = "battle-royale";
            break;
        default:
            genero = genre;
            break;
    };
    // Si seleccionamos la opción "Todos" en el select, se recarga la pagina...
    if(genero === "Todos") {
        window.location.reload();
    } else {
        // ...sino, vaciamos el article actual, creamos el article contenido y pintamos los juegos por género
        vaciarContenido(document.getElementsByTagName("section")[1].id,"contenido");
        $("#contenido").append('<article id="tarjetafiltro">Ordenado por género '+genre+'</article>');
        $.get(solicitud('games?category='+genero.toLowerCase()),function(response){
            pintarRespuesta(response);
        });
    };
};
// Pintamos los juegos por plataforma
function pintarJuegosPorPlataforma(platform){
    // Controlamos las plataformas cuyos nombres cambian en las peticiones
    switch (platform) {
        case "PC (Windows)":
            plataforma = "pc";
            break;
        case "Web Browser":
            plataforma = "browser";
            break;
        default:
            plataforma = "all";
            break;
    };
    // Vaciamos el article actual, creamos el article contenido y pintamos los juegos por plataforma
    vaciarContenido(document.getElementsByTagName("section")[1].id,"contenido");
    $("#contenido").append('<article id="tarjetafiltro">Ordenado por '+platform+'</article>');
    $.get(solicitud('games?platform='+plataforma.toLowerCase()),function(response){
        pintarRespuesta(response);
    });
};
// Pintamos los juegos ordenados por popularidad, orden alfabetico o fecha de lanzamiento
function pintarJuegosOrdenadoPor(sortby){
    // Controlamos los nombres de los filtros
    switch (sortby) {
        case "popularity":
            sort = "Popularidad";
            break;
        case "alphabetical":
            sort = "Orden Alfabético";
            break;
        default:
            sort = "Fecha de Lanzamiento";
            break;
    };
    // Vaciamos el article actual, creamos el article contenido y pintamos los juegos ordenados
    vaciarContenido(document.getElementsByTagName("section")[1].id,"contenido");
    $("#contenido").append('<article id="tarjetafiltro">Ordenado por '+sort+'</article>');
    $.get(solicitud('games?sort-by='+sortby),function(response){
        pintarRespuesta(response,sortby);
    });
};

// OTROS /////////////////////////////////////////////

// Se vacia el article actual y se crea otro a peticion
function vaciarContenido(borrar,crear){
    $('#'+borrar+'').empty();
    document.getElementsByTagName("section")[1].setAttribute("id",crear);
};
// Recorremos el array de imagenes y las devuelvo encadenadas
function arrayImagenes(screenshots){
    if(screenshots.length > 0){
        var resultado = "";
        for (let index = 0; index < screenshots.length; index++) {
            resultado += '<div><img id="imagen'+index+'" src="'+screenshots[index].image+'"></div>';
        };
        return resultado;
    } else {
        return "No hay imágenes que mostrar";
    };
};

$(document).ready(function(event){
    // Solicitamos el numero total de juegos por platforma PC y lo pintamos en la cabecera plataforma
    $.get(solicitud("games?platform=pc"),function(response){
        pintarTotales("ordenador",response);
    });
    // Solicitamos el numero total de juegos por platforma BROWSER y lo pintamos en la cabecera
    $.get(solicitud("games?platform=browser"),function(response){
        pintarTotales("browser",response);
    });
    // Solicitamos el listado completo de juegos...
    $.get(solicitud("games"),function(response){
        // Pintamos el total de juegos de PC o Web
        pintarTotales("totales",response);
        // ...y lo pintamos
        response.forEach(element => {
            // Cada juego tendra su propio id
            $("#contenido").append('<article><div class="tarjeta" id="elemento'+element.id+'"><img src="'+element.thumbnail+'"><p>'+element.title+'</p></div><div id="descripcion">'+element.short_description+'</div><div id="tags"><p class="genero" id="genero'+element.id+'">'+element.genre+'</p><p class="plataforma" id="plataforma'+element.id+'">'+element.platform+'</p></div></article>');
            // Eventos asignados a elementos creados dinamicamente /////////////////////////////////////////////            
            // Al hacer click en la imagen y/o titulo pinta el detalle del juego
            $("#contenido").on("click","#elemento"+element.id,function(){
                pintarDetalleJuego(element.id);
            });
            // Al hacer click en el tag del género pinta los juegos por género
            $("#contenido").on("click",'#genero'+element.id,function(){
                pintarJuegosPorGenero($('#genero'+element.id).text());
            });
            // Al hacer click en el tag de la plataforma pinta los juegos por plataforma
            $("#contenido").on("click",'#plataforma'+element.id,function(){
                pintarJuegosPorPlataforma($('#plataforma'+element.id).text());
            });
        });
    });
    // Eventos /////////////////////////////////////////////
    // Filtramos por el valor que contiene la opcion escogida en el select
    $("#selectgenero").change(function(){
        pintarJuegosPorGenero($("#selectgenero").attr("selected", "selected").val());
    });
    // Filtramos por PC
    $("#filtropc").click(function(){
        pintarJuegosPorPlataforma("PC (Windows)");
    });
    // Filtrar por Web
    $("#filtrobrowser").click(function(){
        pintarJuegosPorPlataforma("Web Browser");
    });
    // Filtrar por popularidad
    $("#filtropopularidad").click(function(){
        pintarJuegosOrdenadoPor("popularity");
    });
    // Filtrar por orden alfabetico
    $("#filtroaz").click(function(){
        pintarJuegosOrdenadoPor("alphabetical");
    });
    // Filtrar por fecha de lanzamiento
    $("#filtrofecha").click(function(){
        pintarJuegosOrdenadoPor("release-date");
    });
    event.preventDefault;
});