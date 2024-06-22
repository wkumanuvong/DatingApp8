import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css',
    standalone: true,
    imports: [RouterLink]
})
export class NotFoundComponent {

}
