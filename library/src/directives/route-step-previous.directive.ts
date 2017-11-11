import { Directive, HostListener } from '@angular/core';
import { RouteStepperService } from '../route-stepper.service';

@Directive( {
    selector: '[nebRouteStepPrevious]'
} )
export class RouteStepPreviousDirective
{
    constructor( private _routeStepperService: RouteStepperService ) {}

    @HostListener( 'click' )
    onClick()
    {
        this._routeStepperService.stepBackward();
    }

}
