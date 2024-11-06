import { dispatch, addObserver, appState } from '../../../store/index';
import { getClubsAction, addClubForUser, removeClubForUser } from '../../../store/actions';

export enum AttributeClubInfo {
    'uid' = 'uid',
    'image' = 'image',
    'name' = 'name',
    'members' = 'members',
    'button' = 'button',
};

export class clubInfo extends HTMLElement {
    uid?: string;
    image?: string;
    name?: string;
    members?: string;
    button?: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
        this.uid = undefined;
        this.image = '';
        this.name = '';
        this.members = '';
        this.button = '';
    }

    static get observedAttributes() {
        return Object.keys(AttributeClubInfo) as Array<AttributeClubInfo>;
    }

    attributeChangedCallback(propName: AttributeClubInfo, oldValue: string | undefined, newValue: string | undefined) {
        this[propName] = newValue;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    async addToClubsLanding() {
        if (this.uid) {
            try {
                await addClubForUser(this.uid);
                return true;
            } catch (error) {
                console.error("Error adding club:", error);
                return false;
            }
        }
        return false;
    }

    async removeFromClubs() {
        if (this.uid) {
            try {
                await removeClubForUser(this.uid);
                return true;
            } catch (error) {
                console.error("Error removing club:", error);
                return false;
            }
        }
        return false;
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

            // Crear y añadir el link de estilos
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = '../src/components/elements/clubInfo/clubInfo.css';
            this.shadowRoot.appendChild(styleLink);

            // Crear la sección principal
            const section = this.ownerDocument.createElement('section');
            section.className = 'clubs--info';

            // Crear y configurar la imagen
            const image = this.ownerDocument.createElement('img');
            image.src = this.image || 'No image found';
            image.alt = 'Club picture';
            section.appendChild(image);

            // Crear el div para el texto
            const textDiv = this.ownerDocument.createElement('div');
            textDiv.className = 'clubs--info__text';

            // Crear y configurar el título
            const title = this.ownerDocument.createElement('h4');
            title.textContent = this.name || 'No name found';
            textDiv.appendChild(title);

            // Crear y configurar el párrafo de miembros
            const members = this.ownerDocument.createElement('p');
            members.textContent = `${this.members || '0'}`;
            textDiv.appendChild(members);

            // Crear y configurar el botón
            const button = this.ownerDocument.createElement('button');
            button.className = 'clubs--info__button';
            
            if (this.button === 'Joined') {
                button.textContent = 'Remove';
                button.style.backgroundColor = '#ff4444';
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (!this.uid) {
                        console.error("No uid found for club");
                        return;
                    }
                    console.log("Remove button clicked for uid:", this.uid);
                    button.disabled = true;
                    button.textContent = 'Removing...';
                    
                    try {
                        const success = await this.removeFromClubs();
                        if (success) {
                            console.log("Successfully removed from clubs");
                        } else {
                            button.disabled = false;
                            button.textContent = 'Remove';
                        }
                    } catch (error) {
                        console.error("Error removing from clubs:", error);
                        button.disabled = false;
                        button.textContent = 'Remove';
                    }
                });
            } else {
                button.textContent = 'Join';
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (!this.uid) {
                        console.error("No uid found for club");
                        return;
                    }
                    console.log("Join button clicked for uid:", this.uid);
                    button.disabled = true;
                    button.textContent = 'Adding...';
                    
                    try {
                        const success = await this.addToClubsLanding();
                        if (success) {
                            button.textContent = 'Joined';
                            button.style.backgroundColor = '#808080';
                            button.disabled = true;
                        } else {
                            button.disabled = false;
                            button.textContent = 'Join';
                        }
                    } catch (error) {
                        console.error("Error adding to clubs:", error);
                        button.disabled = false;
                        button.textContent = 'Join';
                    }
                });
            }

            section.appendChild(textDiv);
            section.appendChild(button);
            this.shadowRoot.appendChild(section);
        }
    }
}

customElements.define('club-info', clubInfo);
export default clubInfo;