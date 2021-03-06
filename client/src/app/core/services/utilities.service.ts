import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationExtras,
  Router
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, mapTo, tap } from 'rxjs/operators';

@Injectable()
export class UtilitiesService {
  public referrer = false;
  public screenSize = new BehaviorSubject<string>(this.getScreenSize());
  public navigationEnd = new BehaviorSubject<ActivatedRouteSnapshot>(this.activatedRoute.snapshot);
  public navigationData = new BehaviorSubject<any>({});

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.screenResizeSubscriber();
    this.navigationEndSubscriber();
  }

  public navigate(commands: any[], extras: NavigationExtras = {}, data: any = {}) {
    this.referrer = true;
    this.navigationData.next(data);
    this.router.navigate(commands, extras);
  }

  private screenResizeSubscriber(): void {
    Observable.fromEvent(window, 'resize')
      .pipe(
        map(this.getScreenSize)
      )
      .subscribe(this.screenSize);
  }

  private navigationEndSubscriber(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        mapTo(this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot;
        }),
        tap(() => this.scrollToTop())
      )
      .subscribe(this.navigationEnd);
  }

  private scrollToTop(): void {
    if (this.navigationData.getValue()['scroll']) {
      const screenSize = this.screenSize.getValue();

      if (screenSize === 'sm' || screenSize === 'xs') {
        return window.scrollTo(0, 0);
      }

      const behavior = this.navigationData.getValue()['scroll'] === 'smooth' ? 'smooth' : 'auto';

      window.scrollTo({
        behavior,
        left: 0,
        top: 0
      });
    }
  }

  private getScreenSize(): string {
    switch (true) {
      case window.innerWidth < 600:
        return 'xs';
      case window.innerWidth > 599 && window.innerWidth < 960:
        return 'sm';
      case window.innerWidth > 959 && window.innerWidth < 1280:
        return 'md';
      case window.innerWidth > 1279 && window.innerWidth < 1920:
        return 'lg';
      case window.innerWidth > 1919:
        return 'xl';
    }
  }
}
