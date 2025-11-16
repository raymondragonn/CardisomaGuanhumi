import { TestBed } from '@angular/core/testing';

import { CrearEventoService } from './crear-evento.service';

describe('CrearEventoService', () => {
  let service: CrearEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
