import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]', // *appHasRole
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User = {} as User;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }
  // private accountService = inject(AccountService);
  // private viewContainerRef = inject(ViewContainerRef);
  // private templateRef = inject(TemplateRef);

  ngOnInit(): void {
    if (this.user.roles.some((r: string) => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
    // if (this.accountService.roles()?.some((r: string) => this.appHasRole.includes(r))) {
    //   this.viewContainerRef.createEmbeddedView(this.templateRef)
    // } else {
    //   this.viewContainerRef.clear();
    // }
  }
}
