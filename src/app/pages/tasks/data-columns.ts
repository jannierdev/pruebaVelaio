export const columnasTareas = [
    {
        columnDef: 'nombreTarea',
        header: 'Nombre Tarea',
        style: 'text-center',
        type: 'text',
        setBackground: (data: any) => {
            return '';
        }
    },
    {
        columnDef: 'estado',
        header: 'Estado',
        style: 'text-center',
        type: 'estado',
        setBackground: (data: any) => {
            let color = ""
            switch (data.estado) {
                case false:
                    color = "semaforo-rojo"
                    break;
                case true:
                    color = "semaforo-verde"
                    break;
                default:
                    break;
            }
            return color;
        }
    }
];