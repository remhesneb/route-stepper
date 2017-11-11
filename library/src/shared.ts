import { InjectionToken } from '@angular/core';
import { RouteStepNextDirective } from './directives/route-step-next.directive';
import { RouteStepPreviousDirective } from './directives/route-step-previous.directive';
import { RouteStepSwipeDirective } from './directives/route-step-swipe.directive';
import { Router } from '@angular/router';
import { RouteStepperService } from './route-stepper.service';

export interface RouteStep
{
    title: string;
    route: string;
    next: string;
    disabled?: boolean;
    visited?: boolean;
}

export let ROUTE_STEPS = new InjectionToken<RouteStep[][]>( 'ROUTE_STEPS' );

export const ROUTE_STEPPER_DIRECTIVES = [
    RouteStepNextDirective, RouteStepPreviousDirective, RouteStepSwipeDirective
];

export function setupRouteStepper( router: Router, config: RouteStep[][] )
{
    return new RouteStepperService( router, Array.prototype.concat.apply( [], config ) );
}

export function provideRouteSteps( routeSteps: RouteStep[] )
{
    return [ { provide: ROUTE_STEPS, multi: true, useValue: routeSteps } ];
}
