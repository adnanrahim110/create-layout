/**
 * Angular 17+ template functions (standalone components by default)
 */

// ─── Component ────────────────────────────────────────────────────────────────
export function component(styleExt) {
  const styleUrls = styleExt !== 'none'
    ? `\n  styleUrl: './{{name-kebab}}.component.${styleExt}',`
    : '';

  return `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '{{selector}}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './{{name-kebab}}.component.html',${styleUrls}
})
export class {{Name}}Component {
  // component logic
}
`;
}

// ─── Component HTML ───────────────────────────────────────────────────────────
export function componentHtml() {
  return `<div class="{{name-kebab}}">
  <!-- {{Name}} component -->
</div>
`;
}

// ─── Component style ─────────────────────────────────────────────────────────
export function componentStyle(ext) {
  if (ext === 'scss') {
    return `:host {\n  display: block;\n}\n\n.{{name-kebab}} {\n  // {{Name}} styles\n}\n`;
  }
  return `:host {\n  display: block;\n}\n\n.{{name-kebab}} {\n  /* {{Name}} styles */\n}\n`;
}

// ─── Component spec ───────────────────────────────────────────────────────────
export function componentSpec() {
  return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { {{Name}}Component } from './{{name-kebab}}.component';

describe('{{Name}}Component', () => {
  let component: {{Name}}Component;
  let fixture: ComponentFixture<{{Name}}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [{{Name}}Component],
    }).compileComponents();

    fixture = TestBed.createComponent({{Name}}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export function service() {
  return `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class {{Name}}Service {
  constructor(private http: HttpClient) {}

  // TODO: add service methods
}
`;
}

// ─── Service spec ─────────────────────────────────────────────────────────────
export function serviceSpec() {
  return `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { {{Name}}Service } from './{{name-kebab}}.service';

describe('{{Name}}Service', () => {
  let service: {{Name}}Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject({{Name}}Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
`;
}

// ─── Module ───────────────────────────────────────────────────────────────────
export function module() {
  return `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
})
export class {{Name}}Module {}
`;
}

// ─── Guard (functional, Angular 14+) ─────────────────────────────────────────
export function guard() {
  return `import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const {{name}}Guard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // TODO: implement auth / permission check
  const isAuthorised = false;

  if (!isAuthorised) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
`;
}

// ─── Guard spec ───────────────────────────────────────────────────────────────
export function guardSpec() {
  return `import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { {{name}}Guard } from './{{name-kebab}}.guard';

describe('{{name}}Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
  });

  it('should be defined', () => {
    expect({{name}}Guard).toBeDefined();
  });
});
`;
}

// ─── Pipe ─────────────────────────────────────────────────────────────────────
export function pipe() {
  return `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: '{{name}}',
  standalone: true,
})
export class {{Name}}Pipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    // TODO: implement transform logic
    return value;
  }
}
`;
}

// ─── Pipe spec ────────────────────────────────────────────────────────────────
export function pipeSpec() {
  return `import { {{Name}}Pipe } from './{{name-kebab}}.pipe';

describe('{{Name}}Pipe', () => {
  let pipe: {{Name}}Pipe;

  beforeEach(() => {
    pipe = new {{Name}}Pipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a value', () => {
    const result = pipe.transform('test');
    expect(result).toBeDefined();
  });
});
`;
}
