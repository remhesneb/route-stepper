import { Directive, HostListener } from '@angular/core';
import { RouteStepperService } from '../route-stepper.service';

@Directive( {
    selector: '[nebRouteStepNext]'
} )
export class RouteStepNextDirective
{
    constructor( private _routeStepperService: RouteStepperService ) {}

    @HostListener( 'click' )
    onClick()
    {
        this._routeStepperService.stepForward();
    }

}
