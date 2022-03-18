
//CARRITO DE COMPRAS

let carritoDeCompras = [];
let stockProductos = [];

//CONTENEDORES
//PRODUCTOS EN STOCK
const contenedorProductos = document.getElementById("contenedorProductos");
//MENU CARRITO DE COMPRAS
const contenedorCarrito = document.getElementById("contenedorCarrito");
const precioTotal = document.getElementById("precioTotal");
//CONTADOR DEL CARRITO EN EL NAVEGADOR
const contadorCarrito = document.getElementById("contadorCarrito");
//FILTRO POR MARCA DE NOTEBOOK
const selecNote = document.getElementById("selecNote");
//BUSCADOR
const formBuscador = document.getElementById("formularioBuscador");
const buscador = document.getElementById("buscador");
const btnBuscador = document.getElementById("btnBuscar");
//FINALIZAR COMPRA
const finalizarCompra = document.getElementById("finalizarCompra");


//IMAGEN DE CARGA
contenedorProductos.innerHTML = `
<div class="containerGif">
    <img class="gifCarga"  src="/assets/gif/giphy.gif">
</div>`


//MOSTRAR PRODUCTOS EN STOCK 

fetch('../js/stock.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item =>{
            stockProductos.push(item)
            
        })
        //DESCUENTO 10% EN LOS PRODUCTOS SELECCIONADOS
        stockProductos = stockProductos.map((el)=>{
            return{
                id: el.id,
                marca: el.marca,
                nombre: el.nombre,
                procesador: el.procesador,
                memoria: el.memoria,
                almacenamiento: el.almacenamiento,
                pantalla: el.pantalla,
                tipo: el.tipo,
                cantidad:1,
                desc:el.desc,
                precio: el.precio, 
                img: el.img,
            }
        })
        setTimeout(()=>{
            mostrarProductos(stockProductos)
            recuperar()
        },3000)
       
    })
    .catch(error => console.log(error))


//FILTRO POR MARCA DE NOTEBOOK

selecNote.addEventListener('change',()=>{
    console.log(selecNote.value)
    selecNote.value == 'all' ? mostrarProductos(stockProductos) : mostrarProductos(stockProductos.filter(el => el.marca == selecNote.value))
    console.log(stockProductos.filter(el => el.marca == selecNote.value))
})


//BUSCADOR

formBuscador.addEventListener('submit', (a)=>{
    a.preventDefault()
    console.log(buscador.value)
    buscador.value == "" ? mostrarProductos(stockProductos)
    : mostrarProductos(stockProductos.filter(el => el.nombre.toLowerCase().includes(buscador.value.toLowerCase())))
})


//MOSTRAR PRODUCTOS EN EL HTML

function mostrarProductos(array){
    contenedorProductos.innerHTML = "";
    for (const producto of array) {
        const {img, nombre, procesador, memoria, almacenamiento, desc, pantalla, tipo, precio, id} = producto
            let div = document.createElement("div");
            div.className = 'productos';
            div.innerHTML += 
            `<div class="card mb-3" style="max-width: 540px;">
                ${desc && `<div class="desc10">Descuento ${desc}%</div>`}
                <div class="row no-gutters">
                    <div class="col-md-6 col-xs-12 d-flex align-items-center justify-content-center box-img">
                        <img  src="${img}" alt="...">
                    </div>
                    <div class="col-md-6 col-xs-12">
                        <div class="card-body">
                            <h4 class="card-title">${nombre}</h4>
                            <p class="card-text">Procesador: ${procesador}</p>
                            <p class="card-text">Memoria RAM: ${memoria}</p>
                            <p class="card-text">Almacenamiento: ${almacenamiento}</p>
                            <p class="card-text">Pantalla: ${pantalla}"</p>
                            <p class="card-text">Tipo: ${tipo}</p>
                            ${desc && `<p class="precioSinDescuento">$${precio}</p>`}
                            <p class="card-text text-precio">Precio: $${desc == '10' ? parseInt(precio) - (parseInt(precio) * 0.1) : precio}</p>
                        </div>
                        <div class="card-bodyMobile">
                        <div class="cardMobile">
                            <h4 class="card-title">${nombre}</h4>
                            <p class="card-text">${procesador} - ${memoria} - ${almacenamiento} - ${pantalla}' </p>
                            <div class="d-flex">
                                ${desc && `<p class="precioSinDescuento">$${precio}</p>`}
                                <p class="card-text text-precio">Precio: $${desc == '10' ? parseInt(precio) - (parseInt(precio) * 0.1) : precio}</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="col-md-12 btn-container">
                        <button type="button" id="botonAgregar${id}" class="btn btn-secondary">Agregar al carrito <i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
            </div>`

            contenedorProductos.appendChild(div);


        //AGREGAR PRODUCTO
        let btnAgregar = document.getElementById(`botonAgregar${id}`) 
        btnAgregar.addEventListener('click',()=>{
            agregarAlCarrito(id)

            //ALERTA PRODUCTO AGREGADO
            Toastify({
                text: "✅ PRODUCTO AGREGADO",
                className: "info",
                position: "left",
                style: {
                background: "linear-gradient(to right, #3a0ca3, #7209b7)",
                }
            }).showToast();  
        })
    }
}


//AGREGAR PRODUCTOS AL CARRITO

function agregarAlCarrito(id){
    
    let repetido = carritoDeCompras.find(item => item.id == id)
    if (repetido) {
        repetido.cantidad = repetido.cantidad + 1
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `
        <p id="cantidad${repetido.id}">Cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
        
      
    } else {
        let productoAgregar = stockProductos.find((el)=> el.id == id)

        console.log(productoAgregar)
        carritoDeCompras.push(productoAgregar)

        actualizarCarrito()
        mostrarCarrito(productoAgregar)      
    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}


//MOSTRAR PRODUCTOS EN EL CARRITO#

function mostrarCarrito(productoAgregar){

    const {nombre, cantidad ,precio, id} = productoAgregar

    let div = document.createElement("div");
    div.className = 'productoEnCarrito'
    div.innerHTML +=     
    `<table>
        <tr>
            <td class="td-nombre">
                <h6 class="text-productoCarrito">${nombre}</h6>
            </td>
            <td class="td-cantidad">
                <p class="text-productoCarrito" id="cantidad${id}">Cantidad: ${cantidad}</p>
            </td>
            <td class="td-precio">
                <p class="text-precioCarrito">Precio: $${precio}</p>
            </td>
            <td class="td-btn" id="botonEliminar${id}">
                <button class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
            </td>      
        </tr>
    </table>`

    contenedorCarrito.appendChild(div);

    //ELIMINAR PRODUCTO 
    let btnEliminar = document.getElementById(`botonEliminar${id}`)

    btnEliminar.addEventListener('click',()=>{
        if (productoAgregar.cantidad == 1) {
            btnEliminar.parentElement.remove()
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id)
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
          
        }else{
            productoAgregar.cantidad = productoAgregar.cantidad - 1
            document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `
            <p id="cantidad${productoAgregar.id}">Cantidad: ${productoAgregar.cantidad}</p>`
            actualizarCarrito()
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        }

        //ALERTA PRODUCTO ELIMINADO
        Toastify({
            text: "❌ PRODUCTO ELIMINADO",
            className: "info",
            position: "left",
            style: {
                background: "linear-gradient(to right, #a4133c, #800f2f)",
            }
        }).showToast();
    })

    //VACIAR CARRITO
    let btnVaciar = document.getElementById(`btnVaciar`)

    btnVaciar.addEventListener('click',()=>{
        carritoDeCompras = []
        contenedorCarrito.innerHTML ="";
        actualizarCarrito()
        localStorage.clear()
        
        Toastify({
            text: "❗ CARRITO VACIO",
            className: "info",
            position: "left",
            style: {
                background: "linear-gradient(to right, #a4133c, #800f2f)",
            }
        }).showToast();

    })

    //FINALIZAR COMPRA
    let btnComprar = document.getElementById(`btnComprar`)

    btnComprar.addEventListener('click',()=>{
        carritoDeCompras = []
        contenedorCarrito.innerHTML ="";
        actualizarCarrito()
        localStorage.clear()
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Gracias por su compra!',
            text: 'La compra se realizó con éxito.',
            showConfirmButton: 'OK',
            with: '20%',
            background:'#212529',
            backdrop: true,
            allowOutsideClick: true,
          })
        
    })

}


//ACTUALIZAR CARRITO DEL NAVEGADOR

function actualizarCarrito(){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc,el)=> acc + el.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
    
}


function recuperar() {
    let recuperarLS = JSON.parse(localStorage.getItem('carrito'))
    console.log(recuperarLS)

    if (recuperarLS) {
        recuperarLS.forEach(element => {
            mostrarCarrito(element)
            carritoDeCompras.push(element)
            actualizarCarrito()
        });
        
    }
}



