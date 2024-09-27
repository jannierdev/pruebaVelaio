import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ColumButton, Column } from 'src/app/shrared/table/column';
import { columnasTareas } from './data-columns';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  @ViewChild("content", { static: false }) content: TemplateRef<any> | undefined;

  public edit: boolean = false;
  public dataRows: any[] = [];
  public dataFilter: any[] = [];
  public dataColumns: Array<Column> = columnasTareas;
  public idTarea: number = 0;
  public filtro: string = "0";
  private consecutivo: number = 0;
  public buttonsTable: Array<ColumButton> = [
    {
      text: 'Finalizar tarea',
      classButton: 'btn btn-success',
      action: (data: any) => {
        this.cambiarEstadoTarea(data.id)
      }
    },
    {
      text: 'Editar tarea',
      classButton: 'btn btn-primary',
      action: (data: any) => {
        this.idTarea = data.id;
        this.edit = true;
        this.open(this.content, 'xl', true);
        let i = 0;
        const persona = (this.form.get('personas')) as FormArray;
        for (let personas of data.personas) {
          persona.push(this.formPersona());
          let j = 0;
          const habilidades = (this.form.get('personas') as FormArray).controls[i].get('habilidades') as FormArray;
          for (let habilidad of personas.habilidades) {
            habilidades.push(this.formHabilidades());
            j++
          }
          i++;
        }
        this.form.patchValue(data);
      }
    }
  ];

  public form!: FormGroup;

  private closeResult: string = "";
  constructor(
    private modalService: NgbModal,
    private _tareasService: TareasService
  ) { }

  ngOnInit(): void {
    this._tareasService.getTareas().subscribe((tareas) => {
      this.dataRows.push(...tareas);
      this.dataFilter.push(...tareas);

      this.consecutivo = this.dataRows.length;
    })
  }

  filtrarTareas() {
    this.dataRows = [];
    if (this.filtro === "0")
      this.dataRows.push(...this.dataFilter);
    else if (this.filtro === "1")
      this.dataRows = this.dataFilter.filter((tarea) => tarea.estado === false);
    else if (this.filtro === "2")
      this.dataRows = this.dataFilter.filter((tarea) => tarea.estado === true);
  }

  iniciarForm() {
    this.form = new FormGroup({
      nombreTarea: new FormControl('', [Validators.required]),
      estado: new FormControl(false, [Validators.required]),
      personas: new FormArray(!this.edit ? [this.formPersona()] : [], this.validarTamañoArrays(1))
    });
  }

  open(content: any, size: string, state: boolean) {
    this.edit = state;
    this.iniciarForm();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getPersonas(form: any) {
    return form.controls.personas.controls;
  }

  habilidades(form: any) {
    return form.controls.habilidades.controls;
  }

  formPersona() {
    return new FormGroup({
      nombreCompleto: new FormControl('', [Validators.required, Validators.minLength(5)]),
      edad: new FormControl('', Validators.required),
      habilidades: new FormArray(!this.edit ? [this.formHabilidades()] : [], this.validarTamañoArrays(1))
    });
  }

  validarTamañoArrays(min: number): ValidatorFn | any {
    return (control: AbstractControl[]) => {
      if (!(control instanceof FormArray)) return;
      return control.length < min ? { betweenLength: true } : null;
    }
  }
  agregarPersona() {
    const persona = (this.form.get('personas')) as FormArray;
    persona.push(this.formPersona());
  }

  borrarPersona(i: number) {
    const persona = (this.form.get('personas')) as FormArray;
    persona.removeAt(i);
  }

  formHabilidades() {
    return new FormGroup({
      nombreHabilidad: new FormControl('', Validators.required)
    })
  }

  agregarHabilidad(i: number) {
    const habilidades = (this.form.get('personas') as FormArray).controls[i].get('habilidades') as FormArray;
    habilidades.push(this.formHabilidades());
  }

  borrarHabilidad(i: number, j: number) {
    const habilidades = ((this.form.get(['personas', i, 'habilidades']) as FormArray));
    habilidades.removeAt(j);
  }

  onSubmit() {
    this.dataFilter = [];
    if (this.edit)
      this.dataRows = this.dataRows.filter((row) => { return row.id != this.idTarea });

    this.dataRows.push({
      id: this.consecutivo + 1,
      ...this.form.value
    });

    this.dataFilter.push(...this.dataRows);

    this.form.reset();

    this.modalService.dismissAll();

    this.consecutivo += 1;
  }

  cambiarEstadoTarea(idTarea: number): void {
    const tarea = this.dataRows.find(row => row.id === idTarea);
    if (tarea) {
      tarea.estado = true;
    }
  }
}
