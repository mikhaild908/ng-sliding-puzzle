import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sliding Puzzle';
  puzzleSolvedMessage = 'Puzzle solved!!!';
  isPuzzleSolved = false;

  constructor() { }

  ngOnInit() { }

  private reloadPage(): void {
    location.reload();
  }

  private onPuzzleSolved(): void {
    this.isPuzzleSolved = true;
  }
}
