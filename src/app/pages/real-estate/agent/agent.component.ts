import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicListComponent, DynamicListSection } from '../../../components/dynamic-list/dynamic-list.component';
import { RealEstateService } from '../../../core/services/real-estate.service';

@Component({
  selector: 'app-agent',
  imports: [
    CommonModule,
    DynamicListComponent,
  ],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
})
export class AgentComponent {

  constructor(
    private readonly _realEstateService: RealEstateService
  ) { }

  items: any[] = [];

  sections: DynamicListSection[] = [
    {
      fields: [
        {
          name: 'nome',
          type: 'text'
        },
        {
          name: 'telefone',
          type: 'text'
        },
        {
          name: 'email',
          type: 'text'
        },
      ],
      items: []
    }
  ];

  ngOnInit(): void {
    this._realEstateService.findAll().subscribe({
      next: (res) => {
        this.sections[0].items = res.result;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
