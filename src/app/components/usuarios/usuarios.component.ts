import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/utils/services/crud.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  formData: FormGroup;
  formDataEdit: FormGroup;
  term: any;
  selectedUser: any;
  specificUser: any;
  roles: any;
  public p: number = 1;
  loadedData: boolean = false;
  listaUsuarios: any[] = [];
  listaProvincias: any[] = [];
  listaLocalidades: any[] = [];
  coloresEstados = [{ cargaEstado: 'PENDIENTE' }, { cargaEstado: 'ACTIVO' }];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private crud: CrudService
  ) {}
  ngOnInit(): void {
    this.crud.getListaUsuarios().subscribe((res: any) => {
      console.log(res);
    });

    this.actualizarVista();

    this.formData = this.formBuilder.group({
      usuarioNombre: ['', Validators.required],
      usuarioEmail: ['', [Validators.required, Validators.email]],
      usuarioTipo: ['Seleccione un rol', Validators.required],
      usuarioTipoDocumento: [
        'Seleccione un tipo de documento',
        Validators.required,
      ],
      usuarioNumeroDocumento: ['', Validators.required],
      usuarioTelefono: ['', Validators.required],
      usuarioProvincia: ['Seleccione una provincia', Validators.required],
      usuarioLocalidad: [
        { value: 'Seleccione una localidad', disabled: true },
        Validators.required,
      ],
      usuarioCalle: ['', Validators.required],
      usuarioCodigoPostal: ['', Validators.required],
      usuarioPassword: ['', Validators.required],
      usuarioCalleAltura: ['', Validators.required],
      usuarioPisoDepartamento: [''],
    });

    /* Cambios del Edit -> Agrega el ID del Usuario que lo registra y se elimina la contraseña */
    this.formDataEdit = this.formBuilder.group({
      usuarioNombre: ['', Validators.required],
      usuarioEmail: ['', [Validators.required, Validators.email]],
      usuarioTipo: ['Seleccione un rol', Validators.required],
      usuarioTipoDocumento: [
        'Seleccione un tipo de documento',
        Validators.required,
      ],
      usuarioNumeroDocumento: ['', Validators.required],
      usuarioTelefono: ['', Validators.required],
      // country: [{value: 'Argentina', disabled: true}, Validators.required],
      usuarioProvincia: ['Seleccione una provincia', Validators.required],
      usuarioLocalidad: [
        { value: 'Seleccione una localidad', disabled: false },
        Validators.required,
      ],
      usuarioCalle: ['', Validators.required],
      usuarioCodigoPostal: ['', Validators.required],
      usuarioCalleAltura: ['', Validators.required],
      usuarioPisoDepartamento: [''],
      //
      usuarioWeb: [null],
    });

    this.roles = [
      { value: 'dador_carga', display: 'Dador de Carga' },
      { value: 'transportista', display: 'Transportista' },
      { value: 'admin', display: 'Administrador' },
    ];
  }
  get form() {
    return this.formData.controls;
  }
  /**
   * Open modal
   * @param content modal content
   */

  /* --- Modales --- */

  /* Modal: Agregar usuario */
  openModal(content: any) {
    this.modalService.open(content);
    this.crud.getProvincias().subscribe((res: any) => {
      this.listaProvincias = res;
      this.listaProvincias.sort((a, b) =>
        a.provinciaNombre.localeCompare(b.provinciaNombre)
      );
    });
  }

  /* Modal: Detalles del usuario */
  openModalDetails(content: any, usuario) {
    this.selectedUser = usuario;
    this.modalService.open(content);
  }

  /* Modal: Editar usuario */

  openModalEditCustomer(content: any, usuario) {
    this.selectedUser = usuario;
    console.log("Usuario a editar:", this.selectedUser);

    this.crud.getProvincias().subscribe((res: any) => {
      this.listaProvincias = res;
      this.listaProvincias.sort((a, b) =>
        a.provinciaNombre.localeCompare(b.provinciaNombre)
      );

      this.formDataEdit.patchValue({
        usuarioNombre: this.selectedUser.usuarioNombre,
        usuarioEmail: this.selectedUser.usuarioEmail,
        usuarioNumeroDocumento: this.selectedUser.usuarioNumeroDocumento,
        usuarioTelefono: this.selectedUser.usuarioTelefono,
        usuarioCalle: this.selectedUser.usuarioCalle,
        usuarioCodigoPostal: this.selectedUser.usuarioCodigoPostal,
        usuarioCalleAltura: this.selectedUser.usuarioCalleAltura,
        usuarioPisoDepartamento: this.selectedUser.usuarioPisoDepartamento,
        usuarioTipo: this.selectedUser.usuarioTipo,
        usuarioTipoDocumento: this.selectedUser.usuarioTipoDocumento,
        usuarioProvincia: this.selectedUser.usuarioProvincia,
      });

      this.crud
        .getLocalidadesPorProvincia(this.selectedUser.usuarioProvincia)
        .subscribe((res: any) => {
          this.listaLocalidades = res;
          this.listaLocalidades.sort((a, b) =>
            a.localidadNombre.localeCompare(b.localidadNombre)
          );

          this.formDataEdit.get("usuarioLocalidad").enable();
          this.formDataEdit.patchValue({
            usuarioLocalidad: this.selectedUser.usuarioLocalidad,
          });

          this.modalService.open(content);
        });
    });
  }

  /* --- CRUD: Agregar y Editar --- */

  /* Agregar Usuario */
  saveCustomer() {
    if (this.formData.valid) {
      const user = this.formData.value;
      this.crud.guardarUsuario(user).subscribe(
        (response) => {
          console.log("Usuario guardado exitosamente:", response);
          Swal.fire(
            "¡Éxito!",
            "El formulario se envió correctamente.",
            "success"
          ).then(() => {
            this.closeModalAgregarUsuario();
          });
          this.actualizarVista();
        },
        (error) => {
          console.error("Error al guardar el usuario:", error);
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

  /* Actualizar Usuario */
  editarCustomer() {
    const customerToUpdate = this.formDataEdit.value;
    /* -- */
    const idUser = this.selectedUser.usuarioId;
    const identityUser = this.selectedUser.usuarioIdentity;
    const stateUser = this.selectedUser.usuarioEstado;
    customerToUpdate.usuarioId = idUser;
    customerToUpdate.usuarioIdentity = identityUser;
    customerToUpdate.usuarioEstado = stateUser;
    /* -- */

    console.log(customerToUpdate);

    if (this.formDataEdit.valid) {
      this.crud.actualizarUsuario(customerToUpdate).subscribe(
        (response) => {
          console.log("Usuario guardado exitosamente:", response);
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
          console.error("Error al guardar el usuario:", error);
          Swal.fire(
            "¡Error!",
            "Error inesperado de servidor, contacte al soporte para solucionarlo.",
            "warning"
          );
        }
      );
    } else {
      console.log("Formulario no válido");
    }
  }

  /* --- Utilidades --- */
  /* Detección de cambio en Select -> Agregar */
  onChangeProvincia(provinciaId: number) {
    this.crud.getLocalidadesPorProvincia(provinciaId).subscribe((res: any) => {
      this.listaLocalidades = res;
      this.listaLocalidades = res.sort((a, b) =>
        a.localidadNombre.localeCompare(b.localidadNombre)
      );
      this.formData.get("usuarioLocalidad")?.enable();
    });
  }
  /* Detección de cambio en Select -> Editar */
  onChangeProvinciaEdicion(provinciaId: number) {
    this.crud.getLocalidadesPorProvincia(provinciaId).subscribe((res: any) => {
      this.listaLocalidades = res;
      this.listaLocalidades = res.sort((a, b) =>
        a.localidadNombre.localeCompare(b.localidadNombre)
      );
      this.formDataEdit.get("usuarioLocalidad")?.enable();
    });
  }
  /* Actualizar vista */
  actualizarVista(): void {
    this.crud.getListaUsuarios().subscribe((res: any) => {
      this.listaUsuarios = res;
      this.loadedData = true;
    });
  }

  /* Agregado de Clases para estilizar los Estados */
  getEstadoClass(estado: string): string {
    switch (estado) {
      case "PENDIENTE":
        return "estadoPendiente";
      case "PRE-AUTORIZADO":
        return "estadoPreAutorizado";
      case "AUTORIZADO":
        return "estadoAutorizado";
      case "ACTIVO":
        return "estadoActivo";
      case "CANCELADO":
        return "estadoCancelado";
      case "ENTREGADO":
        return "estadoEntregado";
      default:
        return "estadoDesconocido";
    }
  }

  /* Close Modal */
  closeModalAgregarUsuario() {
    this.modalService.dismissAll();
    this.formData.patchValue({
      usuarioNombre: [""],
      usuarioEmail: [""],
      usuarioTipo: ["Seleccione un rol"],
      usuarioTipoDocumento: [
        "Seleccione un tipo de documento",
      ],
      usuarioNumeroDocumento: [""],
      usuarioTelefono: [""],
      usuarioProvincia: ["Seleccione una provincia"],
      usuarioLocalidad: [
        { value: "Seleccione una localidad", disabled: true },
      ],
      usuarioCalle: [""],
      usuarioCodigoPostal: [""],
      usuarioPassword: [""],
      usuarioCalleAltura: [""],
      usuarioPisoDepartamento: [""],
    });
  }

  onSearchInputChange(event: Event) {
    this.p = 1;
  }
}
