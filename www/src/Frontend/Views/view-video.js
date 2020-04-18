import { LitElement, html } from 'lit-element';
import '../Components/component-videoplayer'
import '../Components/component-videoinfo'

export class ViewVideo extends LitElement {

    static get properties() {
        return {
            vid: Number,
            video: Object,
            user: Object,
            comments: Array
        }
    }

    constructor() {
        super();

        const state = store.getState();
        this.user = state.user;
    }

    static get styles() {
        return [
            css`
            :host {
                display: block;
                padding: 10px 20px;
            }
            `,
        ]
    }

    //TODO: Comment component
    //TODO: Texting
    //TODO: If teacher - add to playlist
    render() {
        return html`
        <component-videoplayer></component-videoplayer>
        <component-videoinfo></component-videoinfo>
        `;
    }
}
customElements.define('view-video', ViewVideo);