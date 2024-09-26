import { TranslateModule,TranslateService  } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { HomeComponent } from "./components/home/home.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    TabViewModule,
    HomeComponent
]
})
export class AppComponent implements OnInit {

  idiomaSelecionado : string = 'pt-BR';

  constructor(
    private translateService: TranslateService
  ) {}

  setLanguage(lang: string): void {
    this.translateService.use(lang);
    this.idiomaSelecionado = lang;
  }

  // Recupera o idioma salvo do localStorage
  ngOnInit(): void {
    this.translateService.use('pt-BR'); // Padrão inicial
  }
}
