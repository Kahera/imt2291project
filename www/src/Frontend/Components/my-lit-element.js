import { LitElement, html, css, internalProperty } from 'lit-element';

/**
 * `my-lit-element` This is a very simple lit element component
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class MyLitElement extends LitElement {
    static get properties() {
        return {
            elementName: { type: String },
            counter: { type: Number }
        }
    }

    /**
     * Instance of the element is created/upgraded. Use: initializing state,
     * set up event listeners, create shadow dom.
     * @constructor
     */
    constructor() {
        super();
        this.elementName = '<my-lit-element>';
        this.counter = 0;
    }

    static get styles() {
        return [
            css`
            :host { 
                display: block; 
                padding: 1em;
                border: 1px solid;
                box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);
            }
            p { 
                text-transform: capitalize ;
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
            <p>Hello, ${this.elementName} component</p>
            <p>Our counter has a value of: ${this.counter}</p>
            <div>
                <label for="name">Name of the element</label>
                <input
                    @input="${(e) => this.elementName = e.target.value}" 
                    type="text" name="name" id="name" .value="${this.elementName}">
            </div>
            <button @click="${this.incrementCounter}">+1 click</button>`;
    }

    incrementCounter() {
        this.counter += 1;
    }
}

customElements.define('my-lit-element', MyLitElement);