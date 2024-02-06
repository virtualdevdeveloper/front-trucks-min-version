import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/utils/services/auth.service';
import { CrudService } from 'src/app/utils/services/crud.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-cargas',
  templateUrl: './cargas.component.html',
  styleUrls: ['./cargas.component.scss'],
})
export class CargasComponent implements OnInit {
  public p: number = 1;
  term: any;
  formData!: FormGroup;
  formDataEdit!: FormGroup;
  formSearchByLocation!: FormGroup;
  formCambioEstado!: FormGroup;
  cargas: any[] = [];
  selectedCarga: any;
  datosCargados = false;
  productos: any[] = [];
  selectedRubro: any;
  coloresEstados = [
    { cargaEstado: 'PENDIENTE' },
    { cargaEstado: 'PRE-AUTORIZADO' },
    { cargaEstado: 'AUTORIZADO' },
    { cargaEstado: 'ACTIVO' },
    { cargaEstado: 'CANCELADO' },
    { cargaEstado: 'ENTREGADO' },
  ];
  loadedData: boolean = false;
  showResetTableButton: boolean = false;
  listaProvincias: any[] = [];
  listaLocalidades: any[] = [];
  listaLocalidadesOrigin: any[] = [];
  listaLocalidadesArrival: any[] = [];
  listaProductos: any[] = [];
  loadingLocalidadesOrigin: boolean = false;
  loadingLocalidadesArrival: boolean = false;
  isAdmin: boolean = false;
  token: string = '';

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private crud: CrudService,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    this.getUserId();
    this.refreshView();
    this.formData = this.formBuilder.group({
      cargaCantidadCamiones: ['', [Validators.required, Validators.min(1)]],
      cargaEsSustanciaPeligrosa: ['0'],
      cargaProvinciaLocalidadId: ['', Validators.required],
      cargaLocalidadOrigenId: [
        { value: '', disabled: true },
        Validators.required,
      ],
      cargaOrigenDireccion: ['', Validators.required],
      cargaProvinciaDestino: ['', Validators.required],
      cargaLocalidadDestino: [
        { value: '', disabled: true },
        Validators.required,
      ],
      cargaDestinoDireccion: ['', Validators.required],
      cargaOrigenIndicaciones: [''],
      cargaDestinoIndicaciones: [''],
      cargaProductoId: ['Seleccione su producto', Validators.required],
      cargaCantidadProducto: [''],
      cargaNota: [''],
      cargaPaisOrigenId: ['1', Validators.required],
      cargaPaisDestino: ['1', Validators.required],
      fechaInicioCarga: ['', Validators.required],
      fechaFinCarga: ['', Validators.required],
    });

    this.formDataEdit = this.formBuilder.group({
      cargaUniqId: [''],
      mensajeOrigen: [''],
      mensajeDestino: [''],
      nota: [''],
    });

    this.formSearchByLocation = this.formBuilder.group({
      provincia: ['Seleccione una provincia'],
      localidad: ['Seleccione una localidad'],
      checkboxOrigen: false,
      checkboxDestino: false,
    });

    this.formCambioEstado = this.formBuilder.group({
      cargaId: [''],
      usuarioTransportistaId: [''],
      estado: [''],
    });
  }

  private formatFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = ("0" + (fecha.getMonth() + 1)).slice(-2);
    const day = ("0" + fecha.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  get form() {
    return this.formData.controls;
  }

  /**
   * Open modal
   * @param content modal content
   */

  /* --- Apertura de Modales --- */

  /* Modal: Agregar Carga */
  openModal(content: any) {
    this.formData.reset();
    this.formData.patchValue({
      cargaProvinciaLocalidadId: "",
      cargaLocalidadOrigenId: "",
      cargaProvinciaDestino: "",
      cargaLocalidadDestino: "",
      cargaProductoId: "Seleccione su producto",
      cargaPaisOrigenId: "1",
      cargaPaisDestino: "1",
      cargaEsSustanciaPeligrosa: "0",
      cargaOrigenIndicaciones: "",
      cargaDestinoIndicaciones: "",
      cargaCantidadProducto: "",
      cargaNota: ""
    });
    this.modalService.open(content);
    this.crud.getProvincias().subscribe((res: any) => {
      this.listaProvincias = res;
      this.listaProvincias.sort((a, b) =>
        a.provinciaNombre.localeCompare(b.provinciaNombre)
      );
    });
    this.crud.getListaProductos().subscribe((res: any) => {
      this.listaProductos = res;
    });
  }

  /* Modal: Detalles Carga */
  openModalDetails(content: any, carga: any) {
    this.selectedCarga = carga;
    this.crud
      .getProductoPorNombre(+this.selectedCarga.cargaProductoId)
      .subscribe((res: any) => {
        this.selectedRubro = res.productRubroDescripcion;
        this.crud
          .getToken(this.selectedCarga.cargaUniqId)
          .subscribe((res: any) => {
            this.token = res;
            this.modalService.open(content);
          });
      });
  }

  /* Modal: Editar Carga */
  editarCarga(content: any, carga: any) {
    this.selectedCarga = carga;
    this.formDataEdit.patchValue({
      mensajeOrigen: this.selectedCarga.cargaOrigenIndicaciones,
      mensajeDestino: this.selectedCarga.cargaDestinoIndicaciones,
      nota: this.selectedCarga.cargaNota,
    });
    this.modalService.open(content);
  }

  /* Modal: Cambio de Estado */
  cambioRapidoDeEstado(content: any, carga: any) {
    this.selectedCarga = carga;
    this.modalService.open(content);
  }

  /* --- CRUD: Agregar y Editar --- */

  /* Agregar Carga */
  saveCarga() {
    const carga = this.formData.value;
    const fechaActual = new Date();
    const formattedFechaActual = this.formatFecha(fechaActual);
    carga.fechaRegistracionCarga = formattedFechaActual;
    carga.cargaEstado = "PENDIENTE";
    carga.cargaUsuarioId = this.getUserId();
    console.log(carga);

    if (this.formData.valid) {
      this.crud.guardarCarga(carga).subscribe(
        (response) => {
          console.log("Carga guardada exitosamente:", response);
          Swal.fire(
            "¡Éxito!",
            "El formulario se envió correctamente.",
            "success"
          ).then(() => {
            this.modalService.dismissAll();
          });
          this.refreshView();
          this.closeModal();
        },
        (error) => {
          console.error("Error al guardar la carga:", error);
          Swal.fire(
            "¡Error!",
            "Error inesperado de servidor, contacte al soporte para solucionarlo.",
            "warning"
          );
        }
      );
    } else {
      console.log("El formulario no es válido");
      Swal.fire(
        "¡Error!",
        "El formulario cumple con las validaciones.",
        "error"
      );
    }
  }

  /* Actualizar Carga */
  actualizarCarga() {
    const cargaToSend = this.formDataEdit.value;
    cargaToSend.cargaUniqId = this.selectedCarga.cargaUniqId;
    if (this.formDataEdit.valid) {
      this.crud.actualizarCarga(cargaToSend).subscribe(
        (response) => {
          console.log("Carga editada exitosamente:", response);
          Swal.fire(
            "¡Éxito!",
            "El formulario se envió correctamente.",
            "success"
          ).then(() => {
            this.modalService.dismissAll();
          });
          this.refreshView();
        },
        (error) => {
          console.error("Error al editar la carga:", error);
          Swal.fire(
            "¡Error!",
            "Error inesperado de servidor, contacte al soporte para solucionarlo.",
            "warning"
          );
        }
      );
    } else {
      console.log("El formulario no es válido");
      Swal.fire(
        "¡Error!",
        "El formulario cumple con las validaciones.",
        "error"
      );
    }
  }

  /* --- Utilidades --- */

  /* Búsqueda por Localización */
  searchByLocation() {
    const datosDeEnvio = this.formSearchByLocation.value;
    const localidadId = +datosDeEnvio.localidad;
    const provinciaId = +datosDeEnvio.provincia;
    const roles = this.auth.getClaimsFromToken()?.roles;

    // Buscar siendo Admin
    if (roles && roles.includes("ROLE_ADMIN")) {
      if (this.checkboxOrigen == true && this.checkboxDestino == false) {
        this.crud
          .getCargaByOrigen(localidadId, provinciaId)
          .subscribe((res: any) => {
            this.cargas = res;
            this.closeModalSearchByLocation();
            this.showResetTableButton = true;
          });
        this.p = 1;
      }
      if (this.checkboxOrigen == false && this.checkboxDestino == true) {
        this.crud
          .getCargaByDestino(localidadId, provinciaId)
          .subscribe((res: any) => {
            this.cargas = res;
            this.closeModalSearchByLocation();
            this.showResetTableButton = true;
          });
        this.p = 1;
      }
      if (this.checkboxOrigen == true && this.checkboxDestino == true) {
        this.crud
          .getCargaByLocalidadTotal(localidadId, provinciaId)
          .subscribe((res: any) => {
            this.cargas = res;
            this.closeModalSearchByLocation();
            this.showResetTableButton = true;
          });
        this.p = 1;
      }
      if (this.checkboxOrigen == false && this.checkboxDestino == false) {
        Swal.fire("¡Error!", "No se eligió ninguna opción", "error");
      }
    }
    // Buscar siendo Dador
    else {
      const userId = this.getUserId() || '';
      if (this.checkboxOrigen == true && this.checkboxDestino == false) {
        this.crud
          .getCargaByOrigenDador(localidadId, provinciaId, userId)
          .subscribe((res: any) => {
            this.cargas = res;
            console.log(localidadId, provinciaId, userId);
            this.closeModalSearchByLocation();
            this.showResetTableButton = true;
          });
        this.p = 1;
      }
      if (this.checkboxOrigen == false && this.checkboxDestino == true) {
        this.crud
          .getCargaByDestinoDador(localidadId, provinciaId, userId)
          .subscribe((res: any) => {
            this.cargas = res;
            this.closeModalSearchByLocation();
            this.showResetTableButton = true;
          });
        this.p = 1;
      }
      if (this.checkboxOrigen == true && this.checkboxDestino == true) {
        this.crud
          .getCargaByLocalidadTotalDador(localidadId, provinciaId, userId)
          .subscribe((res: any) => {
            this.cargas = res;
            this.closeModalSearchByLocation();
            this.showResetTableButton = true;
          });
        this.p = 1;
      }
      if (this.checkboxOrigen == false && this.checkboxDestino == false) {
        Swal.fire("¡Error!", "No se eligió ninguna opción", "error");
      }
    }
  }

  /* Checkbox -> Envia 0 o 1 */
  toggleCheckboxValue(event: any) {
    const isChecked = event.target.checked;
    const checkboxValue = isChecked ? "1" : "0";
    this.formData.get("cargaEsSustanciaPeligrosa")?.setValue(checkboxValue);
  }

  /* Deshabilitación de Select */
  onChangeProvincia(provinciaId: number, isOrigen: boolean) {
    const localidadControl = isOrigen
      ? "cargaLocalidadOrigenId"
      : "cargaLocalidadDestino";
    this.crud.getLocalidadesPorProvincia(provinciaId).subscribe((res: any) => {
      const listaLocalidades = res.sort((a: { localidadNombre: string; }, b: { localidadNombre: any; }) =>
        a.localidadNombre.localeCompare(b.localidadNombre)
      );
      if (isOrigen) {
        this.listaLocalidadesOrigin = listaLocalidades;
      } else {
        this.listaLocalidadesArrival = listaLocalidades;
      }
      this.formData.get(localidadControl)?.enable();
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

  /* Refresh View */
  refreshView(): void {
    const roles = this.auth.getClaimsFromToken()?.roles;

    console.log(roles);

    if (roles &&roles.includes("ROLE_ADMIN")) {
      this.actualizarVista();
      this.isAdmin = true;
    } else {
      this.actualizarVistaDador();
      this.isAdmin = false;
    }
  }

  /* Actualizar vista -> Admin */
  actualizarVista(): void {
    this.crud.getListaCargas().subscribe((data: any) => {
      this.cargas = data.sort(
        (a:any, b:any) =>
          new Date(b["fechaRegistracionCarga"]).getTime() -
          new Date(a["fechaRegistracionCarga"]).getTime()
      );
      this.loadedData = true;
    });
    this.modalService.dismissAll();
    this.showResetTableButton = false;
  }

  /* Actualizar vista -> Dador */
  actualizarVistaDador(): void {
    const userId = this.auth.getClaimsFromToken()?.userId.toString() || '';
    this.crud.getListaCargasDador(userId).subscribe((data: any) => {
      this.cargas = data.sort(
        (a:any, b:any) =>
          new Date(b["fechaRegistracionCarga"]).getTime() -
          new Date(a["fechaRegistracionCarga"]).getTime()
      );
      this.loadedData = true;
    });
    this.modalService.dismissAll();
    this.showResetTableButton = false;
  }

  /* Obtener checkbox para filtrar por localidad */
  get checkboxOrigen() {
    return this.formSearchByLocation.get("checkboxOrigen")?.value;
  }
  get checkboxDestino() {
    return this.formSearchByLocation.get("checkboxDestino")?.value;
  }

  /* Cambio rápido de Estado */
  cambioRapidoCarga() {
    const dataSelected = this.selectedCarga;
    const dataToSend = this.formCambioEstado.value;
    const dataFinalToSend = {
      cargaId: dataSelected.cargaUniqId,
      usuarioTransportistaId: "",
      estado: dataToSend.estado,
    };
    this.crud.actualizarEstadoAdmin(dataFinalToSend).subscribe(
      (response) => {
        console.log("Estado cambiado:", response);
        Swal.fire(
          "¡Éxito!",
          "El estado se cambió correctamente.",
          "success"
        ).then(() => {
          this.modalService.dismissAll();
        });
        this.refreshView();
      },
      (error) => {
        console.error(
          "Error al actualizar el estado, revise que no se quiera enviar el mismo estado:",
          error
        );
        Swal.fire(
          "¡Error!",
          "Error al actualizar el estado, revise que no se quiera enviar el mismo estado.",
          "warning"
        );
      }
    );
  }

  /* GetUserId */
  getUserId() {
    const userId = this.auth.getClaimsFromToken()?.userId.toString();
    return userId;
  }

  /* Cambiar nombre de los Estados */
  getEstadoText(estado: string): string {
    if (estado === "ACTIVO") {
      return "EN CURSO";
    } else {
      return estado;
    }
  }

  /* Cerrar Modal y Resetear Estado */

  closeModal() {
    this.modalService.dismissAll();
  }
  closeModalEdit() {
    this.modalService.dismissAll();
    this.formDataEdit.reset();
  }
  closeModalSearchByLocation() {
    this.modalService.dismissAll();
    this.formSearchByLocation.reset();
    this.formSearchByLocation.patchValue({
      provincia: ["Seleccione una provincia"],
      localidad: ["Seleccione una localidad"],
      checkboxOrigen: false,
      checkboxDestino: false,
    });
  }
  closeModalEstado() {
    this.modalService.dismissAll();
    this.formCambioEstado.patchValue({
      estado: [""],
    });
  }

}
