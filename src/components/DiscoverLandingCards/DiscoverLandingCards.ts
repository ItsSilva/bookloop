import { dispatch, addObserver, appState } from '../../store/index';
import { getClubsAction, addClubForUser, removeClubForUser } from '../../store/actions';
import { Screens } from '../../types/store';

export enum AttributeDiscoverLandingCards {
    'uid' = 'uid',
    'image' = 'image',
    'name' = 'name',
    'members' = 'members',
    'button' = 'button',
}

class DiscoverLandingCards extends HTMLElement {
    uid?: string;
    image?: string;
    name?: string;
    members?: string;
    button?: string;

    static get observedAttributes() {
        return Object.keys(AttributeDiscoverLandingCards) as Array<AttributeDiscoverLandingCards>;
    }

    attributeChangedCallback(propName: AttributeDiscoverLandingCards, oldValue: string | undefined, newValue: string | undefined) {
        this[propName] = newValue;
        this.render();
    }

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

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../src/components/DiscoverLandingCards/DiscoverLandingCards.css';
            this.shadowRoot.appendChild(link);

            const card = this.ownerDocument.createElement('div');
            card.className = 'card';

            const image = this.ownerDocument.createElement('img');
            image.className = 'image';
            image.src = this.image || 'No image found';
            image.alt = this.name || 'No name found';
            card.appendChild(image);

            const name = this.ownerDocument.createElement('h2');
            name.className = 'name';
            name.textContent = this.name || 'No name found';
            card.appendChild(name);

            const members = this.ownerDocument.createElement('p');
            members.className = 'members';
            members.textContent = this.members || 'No members found';
            card.appendChild(members);

            const button = this.ownerDocument.createElement('button');
            button.className = 'button';
            
            if (this.button === 'Join') {
                button.textContent = 'Remove';
                button.style.backgroundColor = '#ff4444';
                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (!this.uid) {
                        console.error("No uid found for card");
                        return;
                    }
                    console.log("Remove button clicked for uid:", this.uid);
                    button.disabled = true;
                    button.textContent = 'Removing...';
                    
                    try {
                        const success = await this.removeFromClubs();
                        if (success) {
                            // the card will be deleted when the status is updated
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
                        console.error("No uid found for card");
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
            
            card.appendChild(button);
            this.shadowRoot.appendChild(card);
        }
    }

    async addToClubsLanding() {
        try {
            const userId = appState.user;
            console.log("Current userId:", userId);
    
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
    
            console.log("Attempting to add club with data:", clubData);
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
            console.log("Current userId:", userId);
    
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
    
            console.log("Attempting to remove club with data:", clubData);
            const success = await removeClubForUser(clubData);
            return success;
    
        } catch (error) {
            console.error("Error in removeFromClubs:", error);
            return false;
        }
    }
}

customElements.define('discover-landing-card', DiscoverLandingCards);
export default DiscoverLandingCards;