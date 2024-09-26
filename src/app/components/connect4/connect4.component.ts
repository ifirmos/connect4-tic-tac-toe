import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { CPUService } from '../../services/cpu.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-connect4',
  templateUrl: './connect4.component.html',
  styleUrls: ['./connect4.component.scss'],
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, TranslateModule]
})
export class Connect4Component implements OnInit {
  public mensagemDialogo = '';
  public mostrarDialogo = false;
  public isCpuTurn = false;

  constructor(
    public gameService: GameService,
    public cpuService: CPUService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // Carrega os parâmetros de jogadores a partir da URL
    this.route.queryParams.subscribe((params) => {
      const player1 = params['player1'] || 'Player 1';
      const player2 = params['player2'] || (params['mode'] === 'pvp' ? 'Player 2' : 'CPU');
      const player1Color = params['player1Color'] || '#ff0000';
      const player2Color = params['player2Color'] || '#0000ff';

      // Define os jogadores e o modo de jogo
      this.gameService.setPlayers([
        { nome: player1, cor: player1Color, pontos: 0 },
        { nome: player2, cor: player2Color, pontos: 0 }
      ]);
      this.gameService.setGameMode('connect4');
      console.log(`Jogadores: ${player1} (cor: ${player1Color}), ${player2} (cor: ${player2Color})`);
    });
  }

  // Função que lida com o movimento do jogador e da CPU
  manipularCliqueColuna(indiceColuna: number): void {
    if (this.isCpuTurn) return;  // Impede o jogador humano de jogar enquanto a CPU está jogando

    const linhaDisponivel = this.obterLinhaDisponivel(indiceColuna);
    if (linhaDisponivel !== -1) {
        const jogadorAtual = this.gameService.currentPlayer.value;

        if (jogadorAtual) {
            // Jogador humano faz seu movimento
            this.gameService.board[linhaDisponivel][indiceColuna] = jogadorAtual.cor;

            // Verifica se o jogador humano venceu ou empatou
            if (this.gameService.checkVictory(linhaDisponivel, indiceColuna)) {
                this.mensagemDialogo = `${jogadorAtual.nome} ${this.translate.instant('won')}!`;
                this.mostrarDialogo = true;
                return;
            } else if (this.gameService.checkTie()) {
                this.mensagemDialogo = this.translate.instant('draw');
                this.mostrarDialogo = true;
                return;
            }

            // Alterna o turno entre os jogadores
            this.gameService.switchPlayer();

            // Verifica se estamos no modo PvP ou Player vs CPU
            const cpuPlayer = this.gameService.currentPlayer.value;
            if (this.route.snapshot.queryParams['mode'] === 'cpu') {
                // Modo Player vs CPU, a CPU faz sua jogada
                this.isCpuTurn = true;
                setTimeout(() => {
                    this.cpuService.cpuMoveConnect4();

                    // Verifica se a CPU venceu ou empatou
                    const lastMove = this.gameService.moveHistory[this.gameService.moveHistory.length - 1];
                    if (this.gameService.checkVictory(lastMove.row, lastMove.col)) {
                        this.mensagemDialogo = `CPU ${this.translate.instant('won')}!`;
                        this.mostrarDialogo = true;
                    } else if (this.gameService.checkTie()) {
                        this.mensagemDialogo = this.translate.instant('draw');
                        this.mostrarDialogo = true;
                    } else {
                        this.gameService.switchPlayer();  // Volta para o jogador humano
                        this.isCpuTurn = false;  // Libera o jogador humano para jogar
                    }
                }, 1000);
            }
        }
    }
}


  // Obter linha disponível na coluna clicada
  obterLinhaDisponivel(indiceColuna: number): number {
    for (let linha = this.gameService.boardSize.rows - 1; linha >= 0; linha--) {
      if (this.gameService.board[linha][indiceColuna] === '') {
        return linha;
      }
    }
    return -1;
  }

  reiniciarJogo(): void {
    console.log('Reiniciando o jogo...');
    this.gameService.resetBoard();
    this.mostrarDialogo = false;
    this.isCpuTurn = false;
  }

  voltarParaHome(): void {
    console.log('Voltando para a tela inicial...');
    this.gameService.resetBoard();
    this.mostrarDialogo = false;
    this.router.navigate(['/home']);
  }
}
