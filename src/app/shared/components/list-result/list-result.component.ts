import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-result',
  templateUrl: './list-result.component.html',
  styleUrls: ['./list-result.component.scss']
})
export class ListResultComponent implements OnInit {

  constructor() { }

  @Input() elements: any[];
  @Input() category: string;
  @Output() elementClicked: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  emitElement(element: any) {
    this.elementClicked.emit(element);
  }

}
