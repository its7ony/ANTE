function obtenerOrdenes(){
    cargar();
    
    $.post('/getOrders',
    function (data){
        let pendientes = data[0];
        let tabPendientes = document.getElementById('Pendientes');
        let activos = data[1];        
        let tabActivos = document.getElementById('Activos');
        let entregados = data[2];
        let tabEntregados = document.getElementById('Entregados');
        
        let htmlP = "";
        let htmlA = "";
        let htmlE = "";
        
        pendientes.map((info,i)=>{
            htmlP = htmlP + `
            <tr>
                <td scope="col">${info.id}</td>
                <td scope="col">Pendiente</td>
                <td scope="col">${info.repartidor}</td>
            </tr>`;
        });
     
        tabPendientes.innerHTML = htmlP;    

        activos.map((info,i)=>{
            htmlA = htmlA + `
            <tr>
                <td scope="col">${info.id}</td>
                <td scope="col">Activo</td>
                <td scope="col">${info.repartidor}</td>
            </tr>`;
        });
     
        tabActivos.innerHTML = htmlA;    
        
        entregados.map((info,i)=>{
            htmlE = htmlE + `
            <tr>
                <td scope="col">${info.id}</td>
                <td scope="col">Entregado</td>
                <td scope="col">${info.repartidor}</td>
            </tr>`;
        });
     
        tabEntregados.innerHTML = htmlE;        
        
    });
  }