import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appRole(roles: string | string[]) {
    const userRoles = this.authService.getRoles(); // récupère les rôles depuis le JWT
    const rolesArray = Array.isArray(roles) ? roles : [roles];

    const hasRole = rolesArray.some(role => userRoles.includes(role));

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}