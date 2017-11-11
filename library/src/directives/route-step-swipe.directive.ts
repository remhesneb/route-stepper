import { Directive, HostListener } from '@angular/core';
import { RouteStepperService } from '../route-stepper.service';

@Directive( {
    selector: '[nebRouteStepSwipe]'
} )
export class RouteStepSwipeDirective
{
    constructor( private _routeStepperService: RouteStepperService ) {}

    @HostListener( 'document:swipeleft' )
    onSwipeLeft()
    {
        this._routeStepperService.stepForward();
    }

    @HostListener( 'document:swiperight' )
    onSwipeRight()
    {
        this._routeStepperService.stepBackward();
    }

}
