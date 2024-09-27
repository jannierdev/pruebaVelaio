export interface Column {
    columnDef: string;
    header: string;
    style: string;
    type: string;
    setText?: any;
    setBackground?: any;
}

export interface ColumButton {
    text: string;
    classButton: any;
    action?: any;
}