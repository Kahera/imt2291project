import { LitElement, html, css } from 'lit-element';
import store from '../libraries/redux/store';

/**
 * `click-visualiser` This component will show the number of clicks in the application (only for those 4 buttons)
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class ClickVisualiser extends LitElement {
    static get properties() {
        return {
            totalClicks: { type: Number }
        }
    }

    /**
     * Instance of the element is created/upgraded. Use: initializing state,
     * set up event listeners, create shadow dom.
     * @constructor
     */
    constructor() {
        super();
        this.totalClicks = 0;

        store.subscribe(() => {
            this.handleUpdatedState(store.getState());
        });

    }

    static get styles() {
        return [
            css`
                p {
                    font-weight: bold;
                }
            `,
        ];
    }

    /**
     * Implement to describe the element's DOM using lit-html.
     * Use the element current props to return a lit-html template result
     * to render into the element.
     */
    render() {
        return html`
            <h2>Click counter component</h2>
            <p>Number of clicks: ${this.totalClicks}</p>
        `;
    }

    handleUpdatedState(state) {
        this.totalClicks = state.clickCounter;
    }
}

customElements.define('click-visualiser', ClickVisualiser);