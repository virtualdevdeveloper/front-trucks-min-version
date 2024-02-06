import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/utils/services/crud.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  public p: number = 1;
  listaPagos: any;
  selectedPago: any;
  term: any;
  loadedData:boolean = false;

  constructor(private crud: CrudService, private modalService: NgbModal) {}
  ngOnInit(): void {
    this.actualizarVista();
  }

   /**
   * Open modal
   * @param content modal content
   */
   openModal(content:any, pago) {
    this.selectedPago = pago;
    this.modalService.open(content, { windowClass: 'customClass' });
  }

  actualizarVista() {
    this.crud.getListaPagos().subscribe((res: any) => {
      this.listaPagos = res;
      this.loadedData = true;
    });
  }

  alternarEstado(pago) {
    this.selectedPago = pago;
    this.crud.actualizarPago(this.selectedPago.id, !this.selectedPago.esPago).subscribe((res) => {
      this.actualizarVista();
    });
  }

  /* Agregado de Clases para estilizar los Estados */
  getEstadoClass(estado: any): any {
    switch (estado) {
      case true:
        return "estadoActivo";
      case false:
        return "estadoPendiente";
    }
  }
}
