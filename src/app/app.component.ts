import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

const solved = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('messages') messages;
  @ViewChild('newGameButton') newGameButton;
  @ViewChild('box1') box1: ElementRef;
  @ViewChild('box2') box2: ElementRef;
  @ViewChild('box3') box3: ElementRef;
  @ViewChild('box4') box4: ElementRef;
  @ViewChild('box5') box5: ElementRef;
  @ViewChild('box6') box6: ElementRef;
  @ViewChild('box7') box7: ElementRef;
  @ViewChild('box8') box8: ElementRef;
  @ViewChild('box9') box9: ElementRef;

  title = 'Sliding Puzzle';
  x = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.scramblePuzzlePieces();
    this.copyTextContentsIntoArray();
    this.addRemoveEventListenersToSquares();
  }

  swap(source: ElementRef, target: ElementRef): void {
    this.swapBackgrounds(source, target);
    this.swapTextContent(source, target);
  }

  private allowDrop(event): void {
    event.preventDefault();
  }

  private drag(event): void {
      event.dataTransfer.setData('text', event.target.id);
  }

  private drop(event): void {
      event.preventDefault();
      
      let sourceBoxId = event.dataTransfer.getData('text').toString().replace('box', '');
      let targetBoxId = event.target.id.toString().replace('box', '');
      
      let sourceBox = this.getBox(sourceBoxId);
      let targetBox = this.getBox(targetBoxId);
      
      this.swap(sourceBox, targetBox);
      this.copyTextContentsIntoArray();

      if(this.isPuzzleSolved()) {
          this.messages.textContent = 'Puzzle solved!!!';
      }

      this.addRemoveEventListenersToSquares();
  }

  private swapTextContent(source, target): void {
      let targetTextContent = target.nativeElement.textContent;
      target.nativeElement.textContent = source.nativeElement.textContent;
      source.nativeElement.textContent = targetTextContent;
  }
  
  private swapBackgrounds(source:ElementRef, target:ElementRef): void {
      //let sourceBoxBackground = window.getComputedStyle(source.nativeElement, null).getPropertyValue('background');
      //target.style.background = sourceBoxBackground;
      //source.style.background = 'black';

      let sourceBoxBackground = window.getComputedStyle(source.nativeElement, null).getPropertyValue('background');
      this.renderer.setStyle(target.nativeElement, 'background', sourceBoxBackground);
      this.renderer.setStyle(source.nativeElement, 'background', 'black');
  }

  private copyTextContentsIntoArray(): void {
      let squares = document.getElementsByClassName('square');
      for(let i = 0; i < this.x.length; i++) {
          for(let j = 0; j < this.x.length; j++) {
              this.x[i][j] = Number(squares[i * this.x.length + j].textContent);
          }
      }
  }

  private isBox9ToTheRight(box): boolean {
      let boxNumber = box.id.replace('box', '');
      let modulus = Number(boxNumber) % this.x.length;

      if(modulus == 0) {
          return false;
      }

      let boxToTheRight = document.getElementById('box'.concat((Number(boxNumber) + 1).toString()));
      let boxToTheRightTextContent = boxToTheRight.textContent;
      
      if(boxToTheRightTextContent == '9') {
          return true;
      }
      return false;
  }

  private isBox9ToTheLeft(box): boolean {
      let boxNumber = box.id.replace('box', '');
      let modulus = Number(boxNumber) % this.x.length;
      
      if(modulus == 1) {
          return false;
      }

      let boxToTheLeft = document.getElementById('box'.concat((Number(boxNumber) - 1).toString()));
      let boxToTheLeftTextContent = boxToTheLeft.textContent;
      
      if(boxToTheLeftTextContent == '9') {
          return true;
      }
      return false;
  }

  private isBox9OnTop(box): boolean {
      let boxNumber = box.id.replace('box', '');
      if(Number(boxNumber) <= this.x.length) {
          return false;
      }
      let boxOnTop = document.getElementById('box'.concat((Number(boxNumber) - this.x.length).toString()));
      let boxOnTopTextContent = boxOnTop.textContent;
      
      if(boxOnTopTextContent == '9') {
          return true;
      }
      return false;
  }

  private isBox9Below(box): boolean {
      let boxNumber = box.id.replace('box', '');
      if(boxNumber > this.x.length * (this.x.length - 1)) {
          return false;
      }
      let boxBelow = document.getElementById('box'.concat((Number(boxNumber) + this.x.length).toString()));
      let boxBelowTextContent = boxBelow.textContent;
      
      if(boxBelowTextContent == '9') {
          return true;
      }
      return false;
  }

  private addRemoveEventListenersToSquares(): void {
      let squares = document.getElementsByClassName('square');
      
      for(let i = 0; i < squares.length; i++) {
          squares[i].removeEventListener("drop", this.drop);
          squares[i].removeEventListener("dragover", this.allowDrop);
          squares[i].removeEventListener("dragstart", this.drag);
          
          squares[i]["draggable"] = false;
      }
      
      for(let i = 0; i < this.x.length; i++) {
          for(let j = 0; j < this.x.length; j++) {
              let currentBox = squares[i * this.x.length + j];
              if(currentBox.textContent == '9') {
                  currentBox.addEventListener('drop', this.drop, false);
                  currentBox.addEventListener('dragover', this.allowDrop, false);
              }
              else {
                  if(this.isBox9Below(currentBox) ||
                    this.isBox9OnTop(currentBox) ||
                    this.isBox9ToTheLeft(currentBox) ||
                    this.isBox9ToTheRight(currentBox)) {
                      currentBox.addEventListener('dragstart', this.drag, false);
                      currentBox['draggable'] = true;
                  }
              }
          }
      }
  }

  private isPuzzleSolved(): boolean {
      for(let i = 0; i < this.x.length; i++) {
          for(let j = 0; j < this.x.length; j++) {
              if(this.x[i][j] != solved[i][j]) {
                  return false;
              }
          }    
      }
      return true;
  }

  private scramblePuzzlePieces(): void {
      // TODO:
      this.swap(this.getBox('6'), this.getBox('9'));
      this.swap(this.getBox('3'), this.getBox('6'));
      this.swap(this.getBox('2'), this.getBox('3'));
      this.swap(this.getBox('1'), this.getBox('2'));
      this.swap(this.getBox('4'), this.getBox('1'));
      this.swap(this.getBox('7'), this.getBox('4'));
      this.swap(this.getBox('8'), this.getBox('7'));
      this.swap(this.getBox('5'), this.getBox('8'));
  }

  private getBox(id:string): ElementRef {
    //return document.getElementById('box' + id);
    switch (id) {
      case '1': {
        return this.box1;
      }
      case '2': {
        return this.box2;
      }
      case '3': {
        return this.box3;
      }
      case '4': {
        return this.box4;
      }
      case '5': {
        return this.box5;
      }
      case '6': {
        return this.box6;
      }
      case '7': {
        return this.box7;
      }
      case '8': {
        return this.box8;
      }
      case '9': {
        return this.box9;
      }
    }
  }

  private reloadPage(): void {
    location.reload();
  }
}
