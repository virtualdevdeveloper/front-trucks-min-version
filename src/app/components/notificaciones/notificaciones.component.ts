import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/utils/services/auth.service';
import { CrudService } from 'src/app/utils/services/crud.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {
  userId = this.auth.getClaimsFromToken().userId;
  cantidadNotificaciones: number;
  avisoDescripcion: string = '';
  avisos: any;
  selectedUser: any;
  cargaPorAutorizar: any;
  cargasTotales: any;
  cargasConId: any;
  nombreTransportista: any;
  cargaFiltradaAlmacenada: any;
  esRespuesta: boolean = false;
  datosTransportista: any;
  datosCarga: any;
  isAdmin: boolean;
  loadedData: boolean = false;

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private crud: CrudService
  ) {}

  ngOnInit(): void {
    this.obtenerNotificaciones();
    this.checkRole();
  }

  /**
   * Open modal
   * @param content modal content
   */

  detallesUsuario(content: any, idTransportista: string) {
    this.crud.getUsuario(idTransportista).subscribe((res: any) => {
      this.selectedUser = res;
      console.log(this.selectedUser);
      this.modalService.open(content);
    });
  }

  obtenerNotificaciones() {
    this.crud.getCantidadNotificaciones(this.userId).subscribe((res: any) => {
      this.cantidadNotificaciones = res;
      this.loadedData = true;
    });

    this.crud.getAvisos(this.userId).subscribe((res: any) => {
      this.avisos = res;
      this.avisos.reverse();
      console.log(this.avisos);

      this.avisos.map((aviso) => {
        this.crud.getCarga(aviso.cargaUniqId).subscribe((cargaRes: any) => {
          aviso.cargaPorAutorizar = cargaRes;
        });
      });
    });
  }

  autorizarCarga(aviso) {
    console.log(aviso.cargaUniqId);
    const toSend = {
      cargaId: aviso.cargaUniqId,
      usuarioTransportistaId: aviso.usuarioOrigenId,
      estado: 'AUTORIZADO',
    };
    this.crud.autorizarCarga(toSend).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire('¡Éxito!', 'La carga se autorizó correctamente', 'success');
        this.crud.deleteAviso(aviso.avisoId).subscribe();
        /* Mandar mensaje al Transportista */
        const toSend = {
          avisoDescripcion: '¡La carga fue autorizada con éxito!',
          usuarioOrigenId: this.userId,
          usuarioDestinoId: aviso.usuarioOrigenId,
          cargaUniqId: aviso.cargaUniqId,
        };
        this.crud.publicarAviso(toSend).subscribe((res: any) => {
          console.log(res);
          /* Después de publicar el aviso, limpiar la pantalla volviendo a cargar los datos */
          this.obtenerNotificaciones();
        });
      },
      (error: any) => {
        console.error('Error al autorizar la carga', error);
        Swal.fire(
          '¡Error!',
          'Error inesperado de servidor, contacte al soporte para solucionarlo.',
          'warning'
        );
      }
    );
  }

  noAutorizarCarga(aviso) {
    const toSend = {
      cargaId: aviso.cargaUniqId,
      usuarioTransportistaId: aviso.usuarioOrigenId,
      estado: 'PENDIENTE',
    };
    this.crud.autorizarCarga(toSend).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire(
          '¡Éxito!',
          'La carga ha sido rechazada correctamente',
          'success'
        );
        this.crud.deleteAviso(aviso.avisoId).subscribe();
        /* Mandar mensaje al Transportista */
        const toSend = {
          avisoDescripcion:
            'El dador de carga no autorizó el viaje correspondiente.',
          usuarioOrigenId: this.userId,
          usuarioDestinoId: aviso.usuarioOrigenId,
          cargaUniqId: aviso.cargaUniqId,
        };
        this.crud.publicarAviso(toSend).subscribe((res: any) => {
          console.log(res);
          /* Después de publicar el aviso, limpiar la pantalla volviendo a cargar los datos */
          this.obtenerNotificaciones();
        });
      },
      (error: any) => {
        console.error('Error al rechazar la carga', error);
        Swal.fire(
          '¡Error!',
          'Error inesperado de servidor, contacte al soporte para solucionarlo.',
          'warning'
        );
      }
    );
  }

  visto(aviso) {
    this.crud.deleteAviso(aviso.avisoId).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire(
          '¡Éxito!',
          'El mensaje fue marcado como visto correctamente',
          'success'
        );
        /* Después de publicar el aviso, limpiar la pantalla volviendo a cargar los datos */
        this.obtenerNotificaciones();
      },
      (error: any) => {
        console.log(error);
        Swal.fire(
          '¡Error!',
          'Error inesperado en el servidor, contacte al soporte para solucionarlo.',
          'warning'
        );
      }
    );
  }

  /* Mensajes personalizados */

  /* nuevoMensaje => Abre la modal con la lista de cargas con transportista asignado a los que se puede mandar mensaje */
  nuevoMensaje(content: any) {
    const userId = this.auth.getClaimsFromToken().userId.toString();
    this.crud.getListaCargasDador(userId).subscribe((data: any[]) => {
      this.cargasTotales = data;
      this.cargasConId = this.cargasTotales.filter(
        (carga) => carga.cargaTransportistaId !== null
      );
      // console.log(this.cargasConId);
      this.modalService.open(content, {
        windowClass: 'customClassNotification',
      });
    });
  }

  /* nuevoMensajeModal => Abre la modal donde se encuentra el textarea y el botón para enviar el mensaje */
  nuevoMensajeModal(content: any, cargaFiltrada, esRespuesta: boolean) {
    this.avisoDescripcion = '';
    this.modalService.open(content, cargaFiltrada);
    this.cargaFiltradaAlmacenada = cargaFiltrada;
    this.esRespuesta = esRespuesta;
  }

  /* mensajePersonalizado => Envia al backend el mensaje desde Nuevo Aviso */
  mensajePersonalizado() {
    const toSend = {
      avisoDescripcion: this.avisoDescripcion,
      usuarioOrigenId: this.userId,
      usuarioDestinoId: this.esRespuesta
        ? this.cargaFiltradaAlmacenada.usuarioOrigenId
        : this.cargaFiltradaAlmacenada.cargaTransportistaId,
      cargaUniqId: this.cargaFiltradaAlmacenada.cargaUniqId,
    };
    this.crud.publicarAviso(toSend).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire('¡Éxito!', 'El mensaje se envió correctamente.', 'success');
        /* Después de publicar el aviso, limpiar la pantalla volviendo a cargar los datos */
        if (this.esRespuesta) {
          this.crud
            .deleteAviso(this.cargaFiltradaAlmacenada.avisoId)
            .subscribe((res: any) => {
              console.log(res);
              this.obtenerNotificaciones();
              this.modalService.dismissAll();
            });
        } else {
          this.obtenerNotificaciones();
          this.modalService.dismissAll();
        }
      },
      (error) => {
        console.error(error);
        Swal.fire(
          '¡Error!',
          'Error inesperado de servidor, el mensaje no pudo ser enviado. Contacte al soporte para solucionarlo.',
          'warning'
        );
      }
    );
  }

  /* Detalles */

  detallesTransportista(transportista, content: any) {
    this.crud.getUsuario(transportista).subscribe((res: any) => {
      this.datosTransportista = res;
      this.modalService.open(content);
    });
  }

  detallesCarga(carga, content: any) {
    this.crud.getCarga(carga).subscribe((res: any) => {
      this.datosCarga = res;
      // console.log(this.datosCarga);
      this.modalService.open(content);
    });
  }

  /* Estado Styling */
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'estadoPendiente';
      case 'PRE-AUTORIZADO':
        return 'estadoPreAutorizado';
      case 'AUTORIZADO':
        return 'estadoAutorizado';
      case 'ACTIVO':
        return 'estadoActivo';
      case 'CANCELADO':
        return 'estadoCancelado';
      case 'ENTREGADO':
        return 'estadoEntregado';
      default:
        return 'estadoDesconocido';
    }
  }
  getEstadoText(estado: string): string {
    if (estado === 'ACTIVO') {
      return 'EN CURSO';
    } else {
      return estado;
    }
  }

  checkRole(): void {
    const roles = this.auth.getClaimsFromToken().roles;
    if (roles.includes('ROLE_ADMIN')) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
}
