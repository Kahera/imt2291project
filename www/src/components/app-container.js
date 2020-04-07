import { LitElement, html, css } from 'lit-element';
import {
    incrementCounter,
    selectTechnology
} from '../redux/actions';
import store from '../redux/store';

/**
 * `app-container` This is the main container of our lit-element app
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class AppContainer extends LitElement {
    static get properties() {
        return {
            lastTechnology: { type: String },
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
        this.lastTechnology = '';
        this.totalClicks = 0;

        //Subscribe the component to the store.
        //If the state changes, it will run the code inside the function
        store.subscribe(() => {
            this.handleUpdatedState(store.getState());
        });
    }

    static get styles() {
        return [
            css`
            `,
        ];
    }

    /**
     * Implement to describe the element's DOM using lit-html.
     * Use the element current props to return a lit-html template result
     * to render into the element.
     */
    render() {
        //Add the list of technologies that we will add in our buttons
        const technologies = ['JavaScript', 'Redux', 'litElement', 'Polymer'];

        return html`
            <h1>This is the AppContainer LitElement</h1>
    
            ${(this.lastTechnology.length > 0) ?
                html`<p>The last selected technology is ${this.lastTechnology}<p>` :
                html`<p>Technology never selected</p>`
            }
            ${
            html`<p>Total number of clicks: ${this.totalClicks}</p>`
            }
            <!-- 
                Here we will use lit-html to execute a javascript code 
                that create as many buttons as elements in our allTechnologies array
            -->
            ${technologies.map(tech => {
                return html`
                <button @click="${(e) => this.handleClick(e, tech)}">${tech}</button>`;
            })}
        `;
    }
    //Everytime the state is updated in the store, 
    //we will run this function to update the properties of our component
    handleUpdatedState(state) {
        this.lastTechnology = state.selectedTechnology;
        this.totalClicks = state.clickCounter;
    }

    //When the buttons are clicked, this funtion will dispatch the actions to the store
    handleClick(event, techName) {
        store.dispatch(selectTechnology(techName));
        store.dispatch(incrementCounter());
    }
}

customElements.define('app-container', AppContainer);