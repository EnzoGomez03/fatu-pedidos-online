const PRECIO_UNICO_BANDEJA = 2500;

const productos = [
    {
        id: 1,
        nombre: "Conitos",
        nombrePedido : "Bandeja de Conitos",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x9",
        variantes: [
            { id: "negro", nombre: "Chocolate negro", imagen: "assets/img/conitosFatu.jpeg" },
            { id: "blanco", nombre: "Chocolate blanco", imagen: "assets/img/ConitosBlanco.jpeg" },
            { id: "bandera", nombre: "Bandera Argentina", imagen: "assets/img/ConitosBandera.jpeg" },
            { id: "rosa", nombre: "Chocolate rosa", imagen: "assets/img/ConitosRosa.jpeg" }
        ]
    },
    {
        id: 2,
        nombre: "Alfajores",
        nombrePedido: "Bandeja de Alfajores",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x9",
        variantes: [
            { id: "maicena", nombre: "De maicena", imagen: "assets/img/alfajoresFatu.jpeg" },
            { id: "negro", nombre: "Negros", imagen: "assets/img/AlfajorNegroFatu.jpeg" },
            { id: "blanco", nombre: "Blancos", imagen: "assets/img/AlfajorBlancoFatu.jpeg" },
            { id: "colores", nombre: "De colores", imagen: "assets/img/AlfajorColoresFatu.jpeg" }
        ]
    },
    {
        id: 3,
        nombre: "Palmeritas",
        nombrePedido: "Bandeja de Palmeritas",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x15",
        imagen: "assets/img/palmeritasFatu.jpeg"
    },
    {
        id: 4,
        nombre: "Rosquitas",
        nombrePedido: "Bandeja de Rosquitas",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x10",
        variantes: [
            { id: "espolvoreada", nombre: "Espolvoreadas", imagen: "assets/img/RosquitasEspolvoreadaFatu.jpeg" },
            { id: "argentina", nombre: "Bandera Argentina", imagen: "assets/img/RosquitaArgentinaFatu.jpeg" },
            { id: "blanca_rosa", nombre: "Blancas mitad rosa", imagen: "assets/img/RosquitaBlancaRosaFatu.jpeg" },
            { id: "mitad_negra_blanca", nombre: "Mitad negra y blanca", imagen: "assets/img/rosquitasFatu.jpeg" }
        ]
    },
    {
        id: 5,
        nombre: "Cañones",
        nombrePedido: "Bandeja de Cañones",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x9 - Con azúcar impalpable",
        imagen: "assets/img/CanonesFatu.jpeg"
    },
    {
        id: 6,
        nombre: "Pepas",
        nombrePedido:"Bandeja de Pepas",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x21",
        variantes: [
            { id: "simple", nombre: "Simples", imagen: "assets/img/PepaSimpleFatu.jpeg" },
            { id: "fileteada", nombre: "Fileteadas", imagen: "assets/img/PepaFileteadaFatu.jpeg" }
        ]
    },
    {
        id: 7,
        nombre: "Merengues",
        nombrePedido: "Bandeja Merengues",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x8",
        imagen: "assets/img/MerenguesFatu.jpeg"
    },
    {
        id: 8,
        nombre: "Bastoncitos",
        nombrePedido:"Bandeja de Bastoncitos",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x11",
        imagen: "assets/img/BastoncitosFatu.jpeg"
    },
    {
        id: 9,
        nombre: "Cuadradas",
        nombrePedido:"Bandeja de Cuadradas",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x8",
        imagen: "assets/img/CuadradasFatu.jpeg"
    },
    {
        id: 10,
        nombre: "Polvorones",
        nombrePedido: "Bandeja de Polvorones",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Bandeja x12",
        imagen: "assets/img/PolvoronesFatu.jpeg"
    },
    {
        id: 11,
        nombre: "Trilogía",
        nombrePedido:"Bandeja de Trilogía",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Combinada: blancos, naturales y con chocolate y maní",
        imagen: "assets/img/TrilogiaFatu.jpeg"
    },
    {
        id: 12,
        nombre: "Surtidas",
        nombrePedido: "Bandeja de surtidas",
        precio: PRECIO_UNICO_BANDEJA,
        descripcion: "Variedad al azar (incluye 4 alfajores blancos + 4 negros)",
        imagen: "assets/img/BandejaSurtidaFatu.jpeg"
    }
];