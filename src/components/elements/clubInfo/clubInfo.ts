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

            const bgColor = this.getAttribute('bg-color');
            if (bgColor) {
                title.style.setProperty('--banner-bg-color', bgColor);
            }

            // Crear y configurar el párrafo de miembros
            const members = this.ownerDocument.createElement('p');
            members.textContent = `${this.members || '0'}`;
            textDiv.appendChild(members);

            // Crear y configurar el botón
            const button = this.ownerDocument.createElement('button');
            button.textContent = this.button || 'Join';
            button.className = 'clubs--info__button';

            if (this.button === 'Remove') {
                button.style.backgroundColor = '#ff4444';
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (!this.uid) {
                        console.error("No uid found for club");
                        return;
                    }
                    button.disabled = true;
                    button.textContent = 'Removing...';

                    try {
                        const success = await this.removeFromClubs();
                        if (success) {
                        } else {
                            button.disabled = false;
                            button.textContent = 'Add';
                        }
                    } catch (error) {
                        console.error("Error removing from clubs:", error);
                        button.disabled = false;
                    }
                });
            } else {
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (!this.uid) {
                        console.error("No uid found for club");
                        return;
                    }
                    button.disabled = true;
                    button.textContent = 'Adding...';

                    try {
                        const success = await this.addToClubsLanding();
                        if (success) {
                            button.textContent = 'Remove';
                            button.style.backgroundColor = '#808080';
                            button.disabled = true;
                        } else {
                            button.disabled = false;
                        }
                    } catch (error) {
                        console.error("Error adding to clubs:", error);
                        button.disabled = false;
                    }
                });
            }

            section.appendChild(textDiv);
            section.appendChild(button);
            this.shadowRoot.appendChild(section);
        }
    }

    async addToClubsLanding() {
        try {
            const userId = appState.user;
            if (!userId) {
                console.error("No user ID found in appState");
                return false;
            }

            if (!this.uid) {
                console.error("No uid found for card");
                return false;
            }

            const clubData = {
                uid: this.uid,
                image: this.image || '',
                name: this.name || '',
                members: this.members || '',
            };

            const success = await addClubForUser(clubData);
            return success;

        } catch (error) {
            console.error("Error in addToClubsLanding:", error);
            return false;
        }
    }

    async removeFromClubs() {
        try {
            const userId = appState.user;

            if (!userId) {
                console.error("No user ID found in appState");
                return false;
            }

            if (!this.uid) {
                console.error("No uid found for card");
                return false;
            }

            const clubData = {
                uid: this.uid,
            };

            const success = await removeClubForUser(clubData);
            return success;

        } catch (error) {
            console.error("Error in removeFromClubs:", error);
            return false;
        }
    }
}

customElements.define('club-info', clubInfo);
export default clubInfo;