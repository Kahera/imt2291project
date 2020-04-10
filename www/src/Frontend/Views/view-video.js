import { LitElement, html } from 'lit-element';
import '../Components/component-videoplayer'

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

    static styles = css`
    :host {
        display: block;
    }
    `;

    //TODO: Make sure correct video plays
    //TODO: Add the rest of the page outside of video player
    render() {
        return html`
        <component-videoplayer></component-videoplayer>
        `;
    }
}
customElements.define('view-video', ViewVideo);