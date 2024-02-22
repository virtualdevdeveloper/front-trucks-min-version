import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/utils/services/auth.service';
import { CrudService } from 'src/app/utils/services/crud.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  listaProvincias: any;
  listaLocalidades: any;
  signupForm: FormGroup;
  submitted = false;
  error = "";
  successmsg = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
    private crud: CrudService,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.crud.getProvincias().subscribe((res: any) => {
      this.listaProvincias = res;
      this.listaProvincias.sort((a, b) =>
        a.provinciaNombre.localeCompare(b.provinciaNombre)
      );
    });

    this.signupForm = this.formBuilder.group({
      usuarioNombre: ["", Validators.required],
      usuarioEmail: ["", [Validators.required, Validators.email]],
      usuarioTipo: ["", Validators.required],
      usuarioTipoDocumento: [
        "Seleccione un tipo de documento",
        Validators.required,
      ],
      usuarioNumeroDocumento: ["", Validators.required],
      usuarioTelefono: ["", Validators.required],
      // country: [{value: 'Argentina', disabled: true}, Validators.required],
      usuarioProvincia: ["Seleccione una provincia", Validators.required],
      usuarioLocalidad: [
        { value: "Seleccione una localidad", disabled: true },
        Validators.required,
      ],
      usuarioCalle: ["", Validators.required],
      usuarioCodigoPostal: ["", Validators.required],
      usuarioPassword: ["", Validators.required],
      usuarioCalleAltura: ["", Validators.required],
      usuarioPisoDepartamento: [""],
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onChangeProvincia(provinciaId: number) {
    this.crud.getLocalidadesPorProvincia(provinciaId).subscribe((res: any) => {
      this.listaLocalidades = res;
      this.listaLocalidades = res.sort((a, b) =>
        a.localidadNombre.localeCompare(b.localidadNombre)
      );
      this.signupForm.get("usuarioLocalidad")?.enable();
    });
  }

  /**
   * On submit form
   */
  onSubmit() {
    
    if (this.signupForm.valid) {
      const user = this.signupForm.value;
      console.log(user)
      // this.crud.guardarUsuario(user).subscribe(
      //   (response) => {
      //     console.log("Usuario guardado exitosamente:", response);
      //     Swal.fire({
      //       title: '¡Éxito!',
      //       text: 'El usuario se ha registrado. No tienes acceso a la plataforma hasta que realices el pago correspondiente.',
      //       icon: 'success',
      //       showCancelButton: false,
      //       confirmButtonColor: '#3085d6',
      //       confirmButtonText: 'Volver'
      //     }).then((result) => {
      //       if (result.isConfirmed) {
      //         this.router.navigate(['/account/login']);
      //       }
      //     });
          
      //   },
      //   (error) => {
      //     console.error("Error al guardar el usuario:", error);
        
      //     if (error instanceof HttpErrorResponse && error.error === "EXIST") {
      //       Swal.fire(
      //         "¡Error!",
      //         "El correo electrónico ya tiene una cuenta registrada.",
      //         "warning"
      //       );
      //     } else {
      //       Swal.fire(
      //         "¡Error!",
      //         "Error inesperado de servidor, contacte al soporte para solucionarlo.",
      //         "warning"
      //       );
      //     }
      //   }
      // );
    } else {
      console.log("Formulario no válido");
      Swal.fire(
        "¡Error!",
        "El formulario no cumple con las validaciones.",
        "error"
      );
    }
  }
}
