import { Injectable } from '@angular/core';
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
};

@Injectable()
export class RouteStepperService
{
    private _routeSteps$: BehaviorSubject<RouteStep[]>;

    private _currentRouteStep: RouteStep = null;

    constructor( private _router: Router,
                 routeSteps: RouteStep[] )
    {
        this._routeSteps$ = new BehaviorSubject<RouteStep[]>( routeSteps );

        this._subscribeToRouterEvents();
    }

    private _getDisabledRoutes(): string[]
    {
        return this._routeSteps$.value.filter( step => step.disabled ).map( step => step.route );
    }

    private _subscribeToRouterEvents()
    {
        this._router.events
            .filter( event => event instanceof RoutesRecognized )
            .subscribe( ( event: RoutesRecognized ) => {
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
            routeStep = this._routeSteps$.value.find( !backward ? _findNext( routeStep ) : _findPrevious( routeStep ) );
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
        let routeSteps    = this._routeSteps$.value;
        let visitedRoutes = routeSteps.filter( step => step.visited ).map( step => step.route );
        let routeStep     = routeSteps.find( step => step.route == route );

        if ( routeStep && visitedRoutes.indexOf( route ) == -1 ) {
            routeStep.visited      = true;
            this._currentRouteStep = routeStep;
            this._routeSteps$.next( routeSteps );
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