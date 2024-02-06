import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/utils/services/crud.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.scss']
})
export class RubrosComponent implements OnInit {
  public p: number = 1;
  formData: FormGroup;
  term: any;
  rubros:any[] = [];
  loadedData:boolean = false;
  selectedRubro:any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private crud: CrudService
  ) {}

  ngOnInit(): void {
    this.actualizarVista();
    this.formData = this.formBuilder.group({
      rubroProductoIdentity: [''],
      rubroDescripcion: ['', Validators.required]
    });
  }

  get form() {
    return this.formData.controls;
  }
  /**
   * Open modal
   * @param content modal content
   */
  
  /* --- Modales --- */
  /* Modal: Agregar Rubro */
  openModal(content: any) {
    this.modalService.open(content, { windowClass: 'customClass' });
    this.formData.reset();
  }

  /* Modal: Editar Rubro */
  editRubro(content: any, rubro) {
    this.selectedRubro = rubro;
    this.formData.patchValue({
      rubroProductoIdentity: this.selectedRubro.rubroProductoIdentity,
      rubroDescripcion: this.selectedRubro.rubroDescripcion,
    });
    this.modalService.open(content, { windowClass: 'customClass' });
  }

  /* --- CRUD: Agregar y Editar --- */
  /* Agregar Rubro */
  saveRubro() {
    if (this.formData.valid) {
      const rubroToSend = this.formData.value;
      this.crud.guardarRubro(rubroToSend).subscribe(
        (response) => {
          console.log('Rubro guardado exitosamente:', response);
          Swal.fire(
            "¡Éxito!",
            "El formulario se envió correctamente.",
            "success"
          ).then(() => {
            this.modalService.dismissAll();
          });
          this.actualizarVista();
        },
        (error) => {
          console.error('Error al guardar el rubro:', error);
          Swal.fire(
            "¡Error!",
            "Error inesperado de servidor, contacte al soporte para solucionarlo.",
            "warning"
          );
        }
      );
    } else {
      console.log('Formulario no válido');
      Swal.fire(
        "¡Error!",
        "El formulario cumple con las validaciones.",
        "error"
      );
    }
    this.formData.reset();
  }
  
  /* Editar Rubro */
  actualizarRubro() {
    if (this.formData.valid) {
      const rubroToUpdate = this.formData.value;
      console.log(rubroToUpdate)
      this.crud.actualizarRubro(rubroToUpdate).subscribe(
        (response) => {
          console.log('Rubro modificado exitosamente:', response);
          Swal.fire(
            "¡Éxito!",
            "El formulario se envió correctamente.",
            "success"
          ).then(() => {
            this.modalService.dismissAll();
          });
          this.actualizarVista();
        },
        (error) => {
          console.error('Error al modificar el rubro:', error);
          Swal.fire(
            "¡Error!",
            "Error inesperado de servidor, contacte al soporte para solucionarlo.",
            "warning"
          );
        }
      );
    } else {
      console.log('Formulario no válido');
      Swal.fire(
        "¡Error!",
        "El formulario cumple con las validaciones.",
        "error"
      );
    }
  }

  /* --- Utilidades --- */
  
  actualizarVista():void {
    this.crud.getListaRubros().subscribe((res:any) => {
      this.rubros = res;
      this.loadedData = true;
    })
  }

}
