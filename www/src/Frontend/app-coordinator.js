import { LitElement, html, css } from 'lit-element';

import store from './Redux/store'
import get from './Utility/requests'

import './Views/view-login'
import './Views/view-homepage'
import './Views/view-error'
import './Views/view-admin'
import './Views/view-playlist'
import './Views/view-video'
import './Views/view-register'

export class AppCoordinator extends LitElement {

    static get styles() {
        return [
            css`
            :host {
                display: block;
            }
            `,
        ]
    }

    render() {
        return html`
        <view-homepage></view-homepage>
        `;
    }

    static get properties() {
        return {
            page: {
                type: String,
                observer: '_pageChanged'
            },
            routeData: Object,
            subroute: Object,
            user: Object
        }
    }

    constructor() {
        super();
        const data = store.getState();
        this.user = data.user;
        store.subscribe((state) => {
            this.user = store.getState().user;
        })

        //Fetch user status from server
        get('../../src/Backend/User/getUser.php').then(user => {
            if (user.loggedIn) {
                // the user is logged in, update the state
                store.dispatch(login({
                    uid: user.uid,
                    email: user.email,
                    type: user.userType
                }))
            }
        }).catch(err => {
            return html`<paper-toast text='$Failed to get user status: {err}'></paper-toast>`
        })
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page)'
        ];
    }

    _routePageChanged(page) {
        // Show the corresponding page according to the route.
        //
        // If no page was found in the route data, page will be an empty string.
        // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
        if (!page) {
            this.page = 'homepage';
        } else if (['register', 'homepage', 'playlist', 'video', 'admin', 'error'].indexOf(page) !== -1) {
            this.page = page;
        } else {
            this.page = 'error';
        }

        // Close a non-persistent drawer when the page & route are changed.
        if (!this.$.drawer.persistent) {
            this.$.drawer.close();
        }
    }

    _pageChanged(page) {
        // Import the page component on demand.
        //
        // Note: `polymer build` doesn't like string concatenation in the import
        // statement, so break it up.
        switch (page) {
            case 'register':
                import('./Views/view-register.js');
                break;
            case 'homepage':
                import('./Views/view-homepage.js');
                break;
            case 'playlist':
                import('./Views/view-playlist.js');
                break;
            case 'video':
                import('./Views/view-video.js');
                break;
            case 'admin':
                import('./Views/view-admin.js');
                break;
            case 'error':
                import('./Views/view-error.js');
                break;
        }
    }
}
customElements.define('app-coordinator', AppCoordinator);