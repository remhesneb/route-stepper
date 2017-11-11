import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { RouteStepperService } from './route-stepper.service';
import { provideRouteSteps, ROUTE_STEPPER_DIRECTIVES, ROUTE_STEPS, RouteStep, setupRouteStepper } from './shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@NgModule( {
    imports     : [ CommonModule ],
    declarations: [ ROUTE_STEPPER_DIRECTIVES ],
    exports     : [ ROUTE_STEPPER_DIRECTIVES ]
} )
export class RouteStepperModule
{
    public static forRoot( routeSteps: RouteStep[] ): ModuleWithProviders
    {
        return {
            ngModule : RouteStepperModule,
            providers: [
                { provide: RouteStepperService, useFactory: setupRouteStepper, deps: [ Router, Injector, ROUTE_STEPS ] },
                provideRouteSteps( routeSteps )
            ]
        }
    }

    public static forChild( routeSteps: RouteStep[] ): ModuleWithProviders
    {
        return { ngModule: RouteStepperModule, providers: [ provideRouteSteps( routeSteps ) ] }
    }
}
