import { LitElement, html } from 'lit-element';
import '@polymer/iron-selector/iron-selector'

export class ComponentVideoplayer extends LitElement {

    static get properties() {
        return {
            videofile: String,
            thumbnail: String,
            caption: String,
            cues: Array,
        }
    }

    constructor() {
        super();

        this.cues = [];
    }

    static styles = css`
    :host {
        display: block;
    }
    `;

    render() {
        return html`
        <video poster="${this.thumbnail}" controls>
            <source src="${this.videofile}">
            <track src="${this.caption}" @load='${this._loadCaption}' default>
        </video>
        <div class="speed">
            <iron-selector slected="1">
                <b>Speed</b>
                <div @click="${this.adjustSpeed}" data-speed='2'>2x</div>
                <div @click="${this.adjustSpeed}" data-speed='1.75'>1.75x</div>
                <div @click="${this.adjustSpeed}" data-speed='1.5'>1.5x</div>
                <div @click="${this.adjustSpeed}" data-speed='1.25'>1.25x</div>
                <div @click="${this.adjustSpeed}" data-speed='1'>1x</div>
                <div @click="${this.adjustSpeed}" data-speed='0.75'>0.75x</div>
                <div @click="${this.adjustSpeed}" data-speed='0.5'>0.5x</div>
            </iron-selector>
        </div>
        `;
    }

    _adjustSpeed(e) {
        let target = (e.originalTarget || e.path[0]);
        const video = this.shadowRoot.querySelector('video');
        video.playbackRate = target.dataset.speed;
    }

    //To load captions on video load
    _loadCaption(e) {
        const video = this.shadowRoot.querySelector('video');
        const list = this.shadowRoot.querySelector('#caption ul');
        const track = e.path[0].track.cues;

        //Listen for cue changes
        track.this.addEventListener('cuechange', e => this._updateCaption(e));

        //Store cues
        for (let i = 0; i < track.cues.length; i++) {
            const cue = track.cues[i];
            this.cues.push(cue);

            //Create and insert cue elements
            const li = document.createElement('li');
            li.dataset.id = cue.id;
            li.innerHTML = cue.text;
            li.addEventListener('click', e => this._selectCaption(e));

            list.appendChild(li);
        }
    }

    //Triggered by click in caption list.
    _selectCaption(e) {
        const target = (e.originalTarget || e.Target);
        const id = target.dataset.id - 1;

        //Change location in video
        this.shadowRoot.querySelector('video').currentTime = this.cues[id].startTime;
    }

    //Keeps caption up to date with playing video
    // and scrolls caption list
    _updateCaption(e) {
        const caption = this.shadowRoot.getElementById('caption');
        caption.querySelector('li').forEach(el.classList.remove('active'));

        //Iterate active cues
        const active = e.target.activeCues;
        for (let i = 0; i < active.length; i++) {
            //Set current cue to active
            const cue = caption.querySelector(`li[data-id='${active[i].id}']`);
            cue.classList.add('active');

            //Scrolls so caption is about centered
            caption.scrollTo({
                top: cue.offsetTop - (caption.offsetHeight / 2),
                left: 0,
                behavior: 'smooth'
            })
        }


    }
}
customElements.define('component-videoplayer', ComponentVideoplayer);