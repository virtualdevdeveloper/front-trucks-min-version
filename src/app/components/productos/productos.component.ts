import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/utils/services/crud.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  formData: FormGroup;
  public p: number = 1;
  productos: any[] = [];
  rubros: any[] = [];
  loadedData: boolean = false;
  selectedProduct: any;
  term: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private crud: CrudService
  ) {}
  ngOnInit(): void {
    this.actualizarVista();
    this.formData = this.formBuilder.group({
      productIdentity: [""],
      productoDescripcion: ["", Validators.required],
      productRubroId: [null, Validators.required],
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
  openModal(content: any) {
    this.crud.getListaRubros().subscribe((res: any) => {
      this.rubros = res;
    });
    this.modalService.open(content, { windowClass: "customClass" });
    this.formData.reset();
  }

  editarProducto(content: any, product) {
    this.selectedProduct = product;
    console.log('Producto seleccionado:', this.selectedProduct);
    this.crud.getListaRubros().subscribe((res: any) => {
      this.rubros = res;
      this.formData.patchValue({
        productoDescripcion: this.selectedProduct.productoDescripcion,
        productRubroId: this.selectedProduct.productRubroId
      });
      this.modalService.open(content, { windowClass: "customClass" });
    });
  }

  /* --- CRUD: Agregar y Editar --- */
  saveProduct() {
    if (this.formData.valid) {
      const productToSend = this.formData.value;
      this.crud.guardarProducto(productToSend).subscribe(
        (response) => {
          console.log("Producto guardado exitosamente:", response);
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
          console.error("Error al guardar el Producto:", error);
          Swal.fire(
            "¡Error!",
            "Error inesperado de servidor, contacte al soporte para solucionarlo.",
            "warning"
          );
        }
      );
    } else {
      console.log("Formulario no válido");
      Swal.fire(
        "¡Error!",
        "El formulario cumple con las validaciones.",
        "error"
      );
    }
  }

  actualizarProducto() {
    if (this.formData.valid) {
      const productToSend = this.formData.value;
      /* Append correct Product Id */
      productToSend.productIdentity = this.selectedProduct.productIdentity;
      
      /* Conversión de String a Number */
      productToSend.productRubroId = +productToSend.productRubroId;
      productToSend.productIdentity = +productToSend.productIdentity;
      
      console.log('Producto a enviar:', productToSend);

      this.crud.actualizarProducto(productToSend).subscribe(
        (response) => {
          console.log("Producto guardado exitosamente:", response);
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
          console.error("Error al actualizar el Producto:", error);
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
  actualizarVista(): void {
    this.crud.getListaProductos().subscribe((res: any) => {
      this.productos = res;
      this.loadedData = true;
    });
  }

  onSearchInputChange(event: Event) {
    this.p = 1;
  }
}
