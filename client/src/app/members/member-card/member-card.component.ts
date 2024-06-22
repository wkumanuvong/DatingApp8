import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { LikesService } from '../../_services/likes.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrl: './member-card.component.css',
    standalone: true,
    imports: [RouterLink],
})
export class MemberCardComponent {
  private likeService = inject(LikesService);
  member = input.required<Member>();
  hasLiked = computed(() =>
    this.likeService.likeIds().includes(this.member().id)
  );

  toggleLike() {
    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update((ids) =>
            ids.filter((x) => x !== this.member().id)
          );
        } else {
          this.likeService.likeIds.update((ids) => [...ids, this.member().id]);
        }
      },
    });
  }
}
