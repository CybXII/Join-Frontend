import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prios',
  standalone: true,
  imports: [],
  templateUrl: './prios.component.html',
  styleUrls: ['./prios.component.scss', '../summary.component.scss']
})
export class PriosComponent {
  @Input() upcomingDeadline: { date: Date; prio: number } | null = null;
}
