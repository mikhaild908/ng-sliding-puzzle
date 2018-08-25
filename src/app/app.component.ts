import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sliding Puzzle';
  puzzleSolvedMessage = 'Puzzle solved!!!';
  isPuzzleSolved = false;

  constructor() { }

  ngOnInit() { }

  public reloadPage(): void {
    location.reload();
  }

  public onPuzzleSolved(): void {
    this.isPuzzleSolved = true;
  }
}
