import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrearEventoService } from 'src/app/services/crear-evento.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  observacionForm: FormGroup;
  selectedFile: File | null = null;
  otroHabitat: string = '';
  otroComportamiento: string = '';
  otraAmenaza: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private crearEventoService: CrearEventoService
  ) {
    this.observacionForm = this.fb.group({
      // Sección 1: Datos generales del observador
      nombre: [''],
      edad: ['', [Validators.pattern(/^\d+$/)]],
      comunidad: ['', Validators.required],
      frecuenciaObservacion: ['', Validators.required],

      // Sección 2: Observación del cangrejo
      fechaObservacion: ['', Validators.required],
      horaObservacion: ['', Validators.required],
      lugarObservacion: ['', Validators.required],
      tipoHabitat: ['', Validators.required],
      otroHabitat: [''],
      numeroCangrejos: ['', Validators.required],

      // Sección 3: Identificación
      sexoCangrejos: this.fb.group({
        machos: [false],
        hembras: [false],
        hembrasOvigeras: [false],
        noIdentifica: [false]
      }),
      tamanoCangrejos: ['', Validators.required],

      // Sección 4: Comportamientos observados
      comportamientos: this.fb.group({
        migrando: [false],
        alimentandose: [false],
        escondiendose: [false],
        cruzandoCarretera: [false],
        enMadrigueras: [false],
        otro: [false]
      }),
      otroComportamiento: [''],
      mortalidadAtropellamiento: ['', Validators.required],

      // Sección 5: Percepción local
      comparacionCantidad: ['', Validators.required],
      amenazas: this.fb.group({
        perdidaHabitat: [false],
        capturaExcesiva: [false],
        carreteras: [false],
        contaminacion: [false],
        cambioclimatico: [false],
        otro: [false]
      }),
      otraAmenaza: [''],
      importanciaConservacion: [3, Validators.required],
      accionesProteccion: ['', Validators.required],

      // Sección 6: Evidencia
      archivo: [null]
    });
  }

  ngOnInit(): void {
    // Suscribirse a cambios en checkboxes que tienen "otro"
    this.observacionForm.get('comportamientos.otro')?.valueChanges.subscribe(value => {
      if (!value) {
        this.observacionForm.patchValue({ otroComportamiento: '' });
      }
    });

    this.observacionForm.get('amenazas.otro')?.valueChanges.subscribe(value => {
      if (!value) {
        this.observacionForm.patchValue({ otraAmenaza: '' });
      }
    });

    this.observacionForm.get('tipoHabitat')?.valueChanges.subscribe(value => {
      if (value !== 'otro') {
        this.observacionForm.patchValue({ otroHabitat: '' });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea imagen o video
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'];
      if (validTypes.includes(file.type)) {
        this.selectedFile = file;
        this.observacionForm.patchValue({ archivo: file });
      } else {
        alert('Por favor, seleccione un archivo de imagen (JPG, PNG) o video (MP4, MOV)');
        event.target.value = '';
      }
    }
  }

  onSubmit(): void {
    if (this.observacionForm.valid) {
      // Verificar si el usuario está autenticado
      if (!this.crearEventoService.isAuthenticated()) {
        alert('Debe iniciar sesión para enviar una observación.');
        return;
      }

      this.isSubmitting = true;
      const observacionData = this.prepareFormData();
      console.log('Enviando datos de observación:', observacionData);
      
      // Enviar los datos al servidor
      this.crearEventoService.enviarObservacion(observacionData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          
          // Si hay archivo seleccionado, subirlo
          if (this.selectedFile && response.id) {
            console.log('Subiendo archivo a observación ID:', response.id);
            this.subirArchivo(response.id);
          } else {
            alert('¡Observación enviada con éxito! Gracias por contribuir a la conservación del cangrejo azul.');
            this.resetForm();
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Error al enviar observación:', error);
          let errorMessage = 'Hubo un error al enviar la observación. Por favor, intente nuevamente.';
          
          if (error.status === 401) {
            errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
          } else if (error.status === 422) {
            errorMessage = 'Datos inválidos. Por favor, revise el formulario.';
          } else if (error.error?.detail) {
            errorMessage = error.error.detail;
          }
          
          alert(errorMessage);
          this.isSubmitting = false;
        }
      });
    } else {
      alert('Por favor, complete todos los campos requeridos.');
      this.markFormGroupTouched(this.observacionForm);
    }
  }

  subirArchivo(observacionId: number): void {
    if (!this.selectedFile) {
      return;
    }

    console.log('Subiendo archivo:', this.selectedFile.name);
    this.crearEventoService.subirFotoObservacion(observacionId, this.selectedFile).subscribe({
      next: (response) => {
        console.log('Archivo subido exitosamente:', response);
        alert('¡Observación y archivo enviados con éxito! Gracias por contribuir a la conservación del cangrejo azul.');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al subir archivo:', error);
        // La observación se creó pero el archivo falló
        alert('La observación se guardó correctamente, pero hubo un error al subir el archivo. Puede intentar subirlo más tarde.');
        this.resetForm();
        this.isSubmitting = false;
      }
    });
  }

  prepareFormData(): any {
    const formValue = this.observacionForm.value;
    
    // Mapear los valores del formulario al formato requerido por el API
    const frecuenciaMap: any = {
      'nunca': 'Nunca',
      'rara-vez': 'Rara vez (1–2 veces al año)',
      'a-veces': 'A veces (cada temporada)',
      'frecuentemente': 'Frecuentemente (varias veces al mes)',
      'muy-frecuentemente': 'Muy frecuentemente (casi todos los días)'
    };

    const cantidadMap: any = {
      '1-5': '1–5',
      '6-20': '6–20',
      '21-50': '21–50',
      'mas-50': 'Más de 50'
    };

    const mortalidadMap: any = {
      'si-muchos': 'Sí, muchos (>10)',
      'si-pocos': 'Sí, pocos (1–10)',
      'no': 'No'
    };

    const comparacionMap: any = {
      'mucho-menor': 'Mucho menor',
      'menor': 'Menor',
      'igual': 'Igual',
      'mayor': 'Mayor',
      'no-se': 'No sé'
    };

    const habitatMap: any = {
      'manglar': 'Manglar',
      'humedal': 'Humedal / laguna',
      'playa': 'Playa / costa',
      'carretera': 'Carretera',
      'zona-urbana': 'Zona urbana',
      'otro': formValue.otroHabitat
    };

    const tamanoMap: any = {
      'pequenos': 'Pequeños (<5 cm ancho de caparazón)',
      'medianos': 'Medianos (5–10 cm)',
      'grandes': 'Grandes (>10 cm)',
      'mezcla': 'Mezcla de tamaños'
    };

    // Obtener checkboxes seleccionados con formato
    const sexoCangrejos = this.getSelectedCheckboxes(formValue.sexoCangrejos);
    const comportamientos = this.getSelectedCheckboxesForBehavior(formValue.comportamientos, formValue.otroComportamiento);
    const amenazas = this.getSelectedCheckboxesForThreats(formValue.amenazas, formValue.otraAmenaza);

    // Preparar datos en el formato exacto requerido por el API
    const data = {
      nombre_observador: formValue.nombre || null,
      edad: formValue.edad ? parseInt(formValue.edad) : null,
      comunidad: formValue.comunidad,
      frecuencia_observacion: frecuenciaMap[formValue.frecuenciaObservacion],
      fecha_observacion: formValue.fechaObservacion,
      hora_observacion: formValue.horaObservacion + ':00', // Agregar segundos
      lugar_observacion: formValue.lugarObservacion,
      tipo_habitat: formValue.tipoHabitat !== 'otro' ? habitatMap[formValue.tipoHabitat] : habitatMap['otro'],
      tipo_habitat_otro: formValue.tipoHabitat === 'otro' ? formValue.otroHabitat : null,
      cantidad_cangrejos: cantidadMap[formValue.numeroCangrejos],
      sexo_cangrejos: sexoCangrejos,
      tamano_cangrejos: tamanoMap[formValue.tamanoCangrejos],
      comportamientos: comportamientos.actividades,
      comportamiento_otro: comportamientos.otro,
      mortalidad_atropellamiento: mortalidadMap[formValue.mortalidadAtropellamiento],
      cambio_poblacion: comparacionMap[formValue.comparacionCantidad],
      amenazas_principales: amenazas.amenazas,
      amenaza_otra: amenazas.otra,
      importancia_conservacion: formValue.importanciaConservacion,
      acciones_proteccion: formValue.accionesProteccion
    };

    return data;
  }

  getSelectedCheckboxes(checkboxGroup: any): string[] {
    const selected: string[] = [];
    const labels: any = {
      machos: 'Machos',
      hembras: 'Hembras',
      hembrasOvigeras: 'Hembras con huevos (ovígeras)',
      noIdentifica: 'No sé identificarlo'
    };

    for (const key in checkboxGroup) {
      if (checkboxGroup[key] && key !== 'otro') {
        selected.push(labels[key] || key);
      }
    }
    return selected;
  }

  getSelectedCheckboxesForBehavior(checkboxGroup: any, otroText: string): any {
    const selected: string[] = [];
    let otroValue: string | null = null;

    const labels: any = {
      migrando: 'Migrando (movimiento en grupo hacia agua)',
      alimentandose: 'Alimentándose',
      escondiendose: 'Escondiéndose en vegetación',
      cruzandoCarretera: 'Cruzando carretera',
      enMadrigueras: 'Dentro o cerca de madrigueras'
    };

    for (const key in checkboxGroup) {
      if (checkboxGroup[key]) {
        if (key === 'otro') {
          otroValue = otroText || null;
        } else {
          selected.push(labels[key] || key);
        }
      }
    }

    return {
      actividades: selected,
      otro: otroValue
    };
  }

  getSelectedCheckboxesForThreats(checkboxGroup: any, otraText: string): any {
    const selected: string[] = [];
    let otraValue: string | null = null;

    const labels: any = {
      perdidaHabitat: 'Pérdida de manglar/hábitat',
      capturaExcesiva: 'Captura excesiva',
      carreteras: 'Carreteras y atropellamiento',
      contaminacion: 'Contaminación',
      cambioclimatico: 'Cambio climático (sequías, inundaciones)'
    };

    for (const key in checkboxGroup) {
      if (checkboxGroup[key]) {
        if (key === 'otro') {
          otraValue = otraText || null;
        } else {
          selected.push(labels[key] || key);
        }
      }
    }

    return {
      amenazas: selected,
      otra: otraValue
    };
  }

  resetForm(): void {
    this.observacionForm.reset({
      importanciaConservacion: 3
    });
    this.selectedFile = null;
    
    // Limpiar el input de archivo
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
