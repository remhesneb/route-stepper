import { Injectable, Injector, NgModuleRef } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RouteStep } from './shared';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';


const _findNext = ( compare ) => {
    return ( step ) => step.route == compare.next;
};

const _findPrevious = ( compare ) => {
    return ( step ) => step.next == compare.route;
}

@Injectable()
export class RouteStepperService
{
    private _initialRouteSteps: RouteStep[];

    private _routeSteps: RouteStep[];

    private _routeSteps$: BehaviorSubject<RouteStep[]>;

    private _currentRouteStep: RouteStep = null;

    private _ngModule: NgModuleRef<any>;

    constructor( private _router: Router,
                 injector: Injector,
                 routeSteps: RouteStep[] )
    {
        console.log( routeSteps );
        this._ngModule = injector.get( NgModuleRef );
        console.log( this._ngModule );

        this._initialRouteSteps = routeSteps;

        this._routeSteps  = routeSteps;
        this._routeSteps$ = new BehaviorSubject<RouteStep[]>( this._routeSteps );

        this._subscribeToRouterEvents();
    }

    private _getDisabledRoutes(): string[]
    {
        return this._routeSteps.filter( step => step.disabled ).map( step => step.route );
    }

    private _subscribeToRouterEvents()
    {
        this._router.events
            .filter( event => event instanceof RoutesRecognized )
            .subscribe( ( event: RoutesRecognized ) => {
                // Wird außerhalb des RouteStepper-Prozesses versucht auf gesperrte Schritte
                // zuzugreifen, wird der Benutzer auf die Root-Seite geleitet.
                let route = this._trimUrl( event.urlAfterRedirects );
                if ( this._getDisabledRoutes().indexOf( route ) != -1 ) {
                    this._router.navigateByUrl( '' );
                } else {
                    this.markRouteAsVisited( route );
                }
            } );
    }

    private _step( backward: boolean = false )
    {
        let routeStep = this._currentRouteStep;

        do {
            routeStep = this._routeSteps.find( !backward ? _findNext( routeStep ) : _findPrevious( routeStep ) );
        } while ( routeStep && routeStep.disabled );

        this._currentRouteStep = routeStep;
        this._router.navigateByUrl( this._currentRouteStep.route );
    }

    stepForward()
    {
        this._step();
    }

    stepBackward()
    {
        this._step( true );
    }

    markRouteAsVisited( route: string )
    {
        let visitedRoutes = this._routeSteps.filter( step => step.visited ).map( step => step.route );
        let routeStep     = this._routeSteps.find( step => step.route == route );
        // Route existiert im RouteStepper-Prozess und gilt noch nicht als besucht.
        if ( routeStep && visitedRoutes.indexOf( route ) == -1 ) {
            routeStep.visited      = true;
            this._currentRouteStep = routeStep;
            this._routeSteps$.next( this._routeSteps );
        }
    }

    private _trimUrl( url: string ): string
    {
        return url.replace( /^\/|\/$/g, '' );
    }

    getRouteSteps(): Observable<RouteStep[]>
    {
        return this._routeSteps$.asObservable();
    }
}