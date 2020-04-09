import { LitElement, html, css } from 'lit-element';
import store from './Redux/store'
import './Utility/login'

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
        <p>Coordinator kjører</p>
        <utility-login></utility-login>
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
            user: {
                type: String
            }
        }
    }

    constructor() {
        super();
        const data = store.getState();
        this.user = data.user;
        store.subscribe((state) => {
            this.user = store.getState().user;
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
        } else if (['homepage', 'view2', 'view3', 'teacher', 'student', 'admin'].indexOf(page) !== -1) {
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
            case 'homepage':
                import('./Views/homepage.js');
                break;
            case 'view2':
                import('./my-view2.js');
                break;
            case 'view3':
                import('./my-view3.js');
                break;
            case 'teacher':
                import('./teacher-view.js');
                break;
            case 'admin':
                import('./admin-view.js');
                break;
            case 'student':
                import('./student-view.js');
                break;
            case 'error':
                import('./Views/error.js');
                break;
        }
    }
}
customElements.define('app-coordinator', AppCoordinator);