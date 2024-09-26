import { Injectable } from '@angular/core';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class CPUService {
  constructor(private gameService: GameService) {}

  // CPU jogada para Tic-Tac-Toe
  cpuMoveTicTacToe(): void {
    console.log('CPU iniciando jogada no Tic-Tac-Toe...');

    // Tenta encontrar uma jogada vencedora
    if (this.findWinningMove()) {
      console.log('CPU encontrou uma jogada vencedora.');
      return;
    }

    // Tenta bloquear o oponente
    if (this.findBlockingMove()) {
      console.log('CPU bloqueou o oponente.');
      return;
    }

    // Se não houver jogadas especiais, faz uma jogada aleatória
    this.makeRandomMove();
    console.log('CPU fez uma jogada aleatória.');
  }

  /**
   * Verifica se a CPU pode vencer em uma jogada.
   * @returns boolean - true se encontrou uma jogada vencedora, false caso contrário.
   */
  private findWinningMove(): boolean {
    const availableCells = this.getAvailableCells();
    const cpuColor = this.gameService.currentPlayer.value!.cor;

    console.log('Verificando jogadas vencedoras para CPU...');
    for (const cell of availableCells) {
      this.simulateMove(cell, cpuColor);
      console.log(`Simulando jogada da CPU na célula: (${cell.row}, ${cell.col})`);

      if (this.gameService.checkVictory(cell.row, cell.col)) {
        console.log(`CPU pode vencer na célula: (${cell.row}, ${cell.col})`);
        this.gameService.addMoveToHistory(cell.row, cell.col);
        return true;
      }
      this.undoMove(cell); // Reverte a jogada
    }
    return false;
  }

  /**
   * Verifica se o oponente pode vencer em uma jogada e bloqueia.
   * @returns boolean - true se encontrou uma jogada a ser bloqueada, false caso contrário.
   */
  private findBlockingMove(): boolean {
    const availableCells = this.getAvailableCells();
    const cpuColor = this.gameService.currentPlayer.value!.cor;
    const opponentColor = this.getOpponentColor(cpuColor);

    console.log('Verificando jogadas de bloqueio...');
    for (const cell of availableCells) {
      this.simulateMove(cell, opponentColor); // Simula a jogada do oponente
      console.log(`Simulando jogada do oponente na célula: (${cell.row}, ${cell.col})`);

      // Verifica se o oponente venceria com essa jogada
      if (this.gameService.checkVictory(cell.row, cell.col, opponentColor)) {
        // Bloqueia a jogada do oponente
        this.simulateMove(cell, cpuColor);  // CPU coloca sua peça na célula para bloquear
        console.log(`CPU bloqueia a jogada do oponente na célula: (${cell.row}, ${cell.col})`);
        this.gameService.addMoveToHistory(cell.row, cell.col);

        // **Não verificar vitória da CPU após o bloqueio**
        // Apenas retorna o bloqueio e finaliza o turno da CPU
        return true;
      }
      this.undoMove(cell); // Reverte a jogada
    }
    return false;
  }

  /**
   * Faz uma jogada aleatória se não houver jogadas especiais.
   */
  private makeRandomMove(): void {
    const availableCells = this.getAvailableCells();
    const cpuColor = this.gameService.currentPlayer.value!.cor;
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];

    this.simulateMove(randomCell, cpuColor);
    console.log(`CPU faz jogada aleatória na célula: (${randomCell.row}, ${randomCell.col})`);
    this.gameService.addMoveToHistory(randomCell.row, randomCell.col);
  }

  /**
   * Simula a jogada de um jogador.
   * @param cell - Célula onde a jogada será feita.
   * @param color - Cor (jogador) que está simulando.
   */
  private simulateMove(cell: { row: number, col: number }, color: string): void {
    this.gameService.board[cell.row][cell.col] = color;
  }

  /**
   * Reverte a jogada (remove a peça da célula).
   * @param cell - Célula onde a jogada será desfeita.
   */
  private undoMove(cell: { row: number, col: number }): void {
    this.gameService.board[cell.row][cell.col] = '';
  }

  /**
   * Função auxiliar para obter as células disponíveis.
   * @returns Array<{ row: number, col: number }> - Lista de células vazias.
   */
  private getAvailableCells(): { row: number, col: number }[] {
    const availableCells: { row: number, col: number }[] = [];
    for (let row = 0; row < this.gameService.boardSize.rows; row++) {
      for (let col = 0; col < this.gameService.boardSize.columns; col++) {
        if (this.gameService.board[row][col] === '') {
          availableCells.push({ row, col });
        }
      }
    }
    return availableCells;
  }

  /**
   * Função auxiliar para obter a cor do oponente.
   * @param cpuColor - Cor da CPU.
   * @returns string - Cor do oponente.
   */
  private getOpponentColor(cpuColor: string): string {
    const opponent = this.gameService.players.find(p => p.cor !== cpuColor);
    if (!opponent) {
      throw new Error('Oponente não encontrado');
    }
    return opponent.cor;
  }

  // A função de Connect4 permanece **INALTERADA** (não há mudanças aqui)
  // CPU jogada para Connect 4
cpuMoveConnect4(): void {
  console.log('CPU iniciando jogada no Connect4...');

  // 1. Tenta encontrar uma jogada vencedora
  if (this.findWinningMoveConnect4()) {
    console.log('CPU encontrou uma jogada vencedora.');
    return;
  }

  // 2. Tenta bloquear o oponente
  if (this.findBlockingMoveConnect4()) {
    console.log('CPU bloqueou o oponente.');
    return;
  }

  // 3. Se não houver jogadas especiais, faz uma jogada aleatória
  this.makeRandomMoveConnect4();
  console.log('CPU fez uma jogada aleatória.');
}

/**
 * Verifica se a CPU pode vencer em uma jogada no Connect 4.
 * @returns boolean - true se encontrou uma jogada vencedora, false caso contrário.
 */
private findWinningMoveConnect4(): boolean {
  const availableColumns = this.getAvailableColumns();
  const cpuColor = this.gameService.currentPlayer.value!.cor;

  console.log('Verificando jogadas vencedoras para CPU...');
  for (const col of availableColumns) {
    const row = this.gameService.getAvailableRow(col);
    this.simulateMove({ row, col }, cpuColor);
    console.log(`Simulando jogada da CPU na coluna: ${col}, linha: ${row}`);

    if (this.gameService.checkVictory(row, col, cpuColor)) {
      console.log(`CPU pode vencer na coluna: (${col}), linha: (${row})`);
      this.gameService.addMoveToHistory(row, col);
      return true;
    }
    this.undoMove({ row, col }); // Reverte a jogada
  }
  return false;
}

/**
 * Verifica se o oponente pode vencer em uma jogada e bloqueia no Connect 4.
 * @returns boolean - true se encontrou uma jogada a ser bloqueada, false caso contrário.
 */
private findBlockingMoveConnect4(): boolean {
  const availableColumns = this.getAvailableColumns();
  const cpuColor = this.gameService.currentPlayer.value!.cor;
  const opponentColor = this.getOpponentColor(cpuColor);

  console.log('Verificando jogadas de bloqueio...');
  for (const col of availableColumns) {
    const row = this.gameService.getAvailableRow(col);
    this.simulateMove({ row, col }, opponentColor); // Simula a jogada do oponente
    console.log(`Simulando jogada do oponente na coluna: ${col}, linha: ${row}`);

    // Verifica se o oponente venceria com essa jogada
    if (this.gameService.checkVictory(row, col, opponentColor)) {
      // Bloqueia a jogada do oponente
      this.simulateMove({ row, col }, cpuColor);
      console.log(`CPU bloqueia a jogada do oponente na coluna: ${col}, linha: ${row}`);
      this.gameService.addMoveToHistory(row, col);
      return true;
    }
    this.undoMove({ row, col }); // Reverte a jogada
  }
  return false;
}

/**
 * Faz uma jogada aleatória no Connect 4 se não houver jogadas especiais.
 */
private makeRandomMoveConnect4(): void {
  const availableColumns = this.getAvailableColumns();
  const cpuColor = this.gameService.currentPlayer.value!.cor;
  const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
  const randomRow = this.gameService.getAvailableRow(randomCol);

  this.simulateMove({ row: randomRow, col: randomCol }, cpuColor);
  console.log(`CPU faz jogada aleatória na coluna: (${randomCol}), linha: (${randomRow})`);
  this.gameService.addMoveToHistory(randomRow, randomCol);
}

/**
 * Função auxiliar para obter as colunas disponíveis no Connect 4.
 * @returns Array<number> - Lista de colunas que ainda têm espaço disponível.
 */
private getAvailableColumns(): number[] {
  const availableColumns: number[] = [];
  for (let col = 0; col < this.gameService.boardSize.columns; col++) {
    if (this.gameService.getAvailableRow(col) !== -1) {
      availableColumns.push(col);
    }
  }
  return availableColumns;
}

}
