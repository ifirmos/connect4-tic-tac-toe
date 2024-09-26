import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { TranslateService,TranslateModule } from '@ngx-translate/core';  // Importa o TranslateService
import { Player } from '../../models/models';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-player-config',
  templateUrl: './player-config.component.html',
  styleUrls: ['./player-config.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ColorPickerModule, DropdownModule, DialogModule, TranslateModule]
})
export class PlayerConfigComponent {
  player1: Player = { nome: 'Player 1', cor: '#ff0000', pontos: 0 };
  player2: Player = { nome: 'Player 2', cor: '#0000ff', pontos: 0 };
  displayDialog: boolean = false;

  gameModes = [
    { label: 'Connect 4', value: 'connect4' },
    { label: 'Jogo da Velha', value: 'tictactoe' }
  ];

  languages = [
    { label: 'English', value: 'en' },
    { label: 'Português', value: 'pt-BR' },
    { label: 'Español', value: 'es' }
  ];

  selectedGameMode: 'connect4' | 'tictactoe' = 'connect4';
  selectedLanguage: string;

  constructor(private gameService: GameService, private translateService: TranslateService, private router: Router) {
    // Captura o idioma inicial configurado
    this.selectedLanguage = this.translateService.currentLang || this.translateService.defaultLang;
    console.log(`Idioma inicial selecionado: ${this.selectedLanguage}`);
  }

  // Método que altera imediatamente o idioma
  changeLanguage(): void {
    this.translateService.use(this.selectedLanguage).subscribe(() => {
      console.log(`Idioma trocado para: ${this.selectedLanguage}`);
      localStorage.setItem('selectedLanguage', this.selectedLanguage);
    });
  }

  saveConfig(): void {
    console.log(`Jogadores configurados: ${this.player1.nome}, ${this.player2.nome}`);
    console.log(`Modo de jogo selecionado: ${this.selectedGameMode}`);

    // Chama o método para trocar o idioma ao salvar as configurações
    this.changeLanguage();

    this.gameService.setPlayers([this.player1, this.player2]);
    this.gameService.setGameMode(this.selectedGameMode);

    // Navegar para o modo de jogo escolhido
    this.router.navigate([`/${this.selectedGameMode}`]);
  }

  openConfigDialog(): void {
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }
}
