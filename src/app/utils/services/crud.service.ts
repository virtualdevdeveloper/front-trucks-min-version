import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  url: string = environment.url;
  constructor(private http: HttpClient) { }

  /* Listas - Get All */
  getListaUsuarios() {
    return this.http.get(this.url + "/transporte/listUsers");
  }

  getListaProductos() {
    return this.http.get(this.url + "/productos");
  }

  getListaRubros() {
    return this.http.get(this.url + "/productorubro");
  }

  getListaCargas() {
    return this.http.get(this.url + "/transporte/cargalist");
  }

  getListaCargasDador(dadorId: string) {
    return this.http.get(this.url + "/transporte/cargalistdador/" + dadorId);
  }

  /* Particular - Get from ID */
  getUsuario(id: string) {
    return this.http.get(this.url + "/transporte/user/" + id);
  }

  getProducto(id: number) {
    return this.http.get(this.url + "/producto/" + id);
  }

  getRubro(id: number) {
    return this.http.get(this.url + "/productorubro/" + id);
  }

  getCarga(id: any) {
    return this.http.get(this.url + "/transporte/carga/" + id);
  }

  getProductoPorNombre(productId: number) {
    return this.http.get(this.url + "/producto/" + productId);
  }

  /* Guardar y Editar */
  guardarUsuario(user: any) {
    return this.http.post(this.url + "/transporte/save", user, {
      responseType: "text",
    });
  }

  actualizarUsuario(user: any) {
    return this.http.post(this.url + "/transporte/update", user);
  }

  guardarProducto(product: any) {
    return this.http.post(this.url + "/saveproducto", product);
  }

  actualizarProducto(product: any) {
    return this.http.post(this.url + "/updateproducto", product);
  }

  guardarRubro(rubro: any) {
    return this.http.post(this.url + "/saverubro", rubro);
  }

  actualizarRubro(rubro: any) {
    return this.http.post(this.url + "/updaterubro", rubro);
  }

  guardarCarga(carga: any) {
    return this.http.post(this.url + "/transporte/savecarga", carga);
  }

  actualizarCarga(carga: any) {
    return this.http.post(this.url + "/transporte/editcarga", carga);
  }

  /* Provincias y Localidades */

  getProvincias() {
    return this.http.get(this.url + "/provincias");
  }

  getLocalidadesPorProvincia(idProvincia: number) {
    return this.http.get(
      this.url + "/findlocalidadesbyprovinciaid/" + idProvincia
    );
  }

  /* Filtrar cargas */
  // Admin
  getCargaByOrigen(idLocalidad: number, idProvincia: number) {
    return this.http.get(
      this.url +
        "/transporte/cargadisponibleorigen/" +
        idLocalidad +
        "/" +
        idProvincia
    );
  }

  getCargaByDestino(idLocalidad: number, idProvincia: number) {
    return this.http.get(
      this.url +
        "/transporte/cargadisponibledestino/" +
        idLocalidad +
        "/" +
        idProvincia
    );
  }

  getCargaByLocalidadTotal(idLocalidad: number, idProvincia: number) {
    return this.http.get(
      this.url +
        "/transporte/cargadisponible/" +
        idLocalidad +
        "/" +
        idProvincia
    );
  }

  // Dador de Carga
  getCargaByOrigenDador(
    idLocalidad: number,
    idProvincia: number,
    userId: string
  ) {
    return this.http.get(
      this.url +
        "/transporte/cargaorigendador/" +
        idLocalidad +
        "/" +
        idProvincia +
        "/" +
        userId
    );
  }

  getCargaByDestinoDador(
    idLocalidad: number,
    idProvincia: number,
    userId: string
  ) {
    return this.http.get(
      this.url +
        "/transporte/cargadestinodador/" +
        idLocalidad +
        "/" +
        idProvincia +
        "/" +
        userId
    );
  }

  getCargaByLocalidadTotalDador(
    idLocalidad: number,
    idProvincia: number,
    userId: string
  ) {
    return this.http.get(
      this.url +
        "/transporte/cargadisponibledador/" +
        idLocalidad +
        "/" +
        idProvincia +
        "/" +
        userId
    );
  }

  /* Cambio rápido de estado */

  actualizarEstadoAdmin(objeto: any) {
    return this.http.post(this.url + "/transporte/asignarbyadmin", objeto, {
      responseType: "text",
    });
  }

  /* Pagos */

  getListaPagos() {
    return this.http.get(this.url + "/pagos/");
  }

  guardarPago(pago: any) {
    return this.http.post(this.url + "/pagos/save/", pago);
  }

  actualizarPago(idPago: number, esPago: boolean) {
    return this.http.get(this.url + "/pagos/update/" + idPago + "/" + esPago);
  }

  /* Avisos / Notificaciones */

  getCantidadNotificaciones(id:any) {
    return this.http.get(this.url + "/avisos/getCountByUsuarioDestinoId/" + id);
  }

  getAvisos(id:any) {
    return this.http.get(this.url + "/avisos/findAvisosByUsuarioDestinoId/" + id)
  }

  autorizarCarga(object:any) {
    return this.http.post(this.url + "/transporte/asignar", object, {
      responseType: "text",
    })
  }

  deleteAviso(avisoId:string) {
    return this.http.delete(this.url + "/avisos/delete/" + avisoId);
  }

  publicarAviso(object:any) {
    return this.http.post(this.url + '/avisos/save', object)
  }

  /* Token */
  
  getToken(cargaId:string) {
    return this.http.get(this.url + "/transporte/gettokenretiro/" + cargaId, { responseType: "text" });
  }
}
