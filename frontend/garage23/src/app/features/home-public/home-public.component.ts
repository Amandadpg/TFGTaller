import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-public',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-public.component.html'
})
export class HomePublicComponent {
  servicioActivo = 'mecanica';

  setServicio(tipo: string) {
    this.servicioActivo = tipo;
  }
  abrirWhatsApp() {
    window.open('https://wa.me/34610820108', '_blank');
  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}