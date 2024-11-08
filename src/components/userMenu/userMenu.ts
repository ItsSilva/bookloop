import { dispatch } from '../../store/index';
import { navigate } from '../../store/actions';
import { Screens } from '../../types/store';

export enum Attribute {
    'home' = 'home',
    'clubs' = 'clubs',
    'discover' = 'discover',
    'help' = 'help',
    'setting' = 'setting',
};

class UserMenu extends HTMLElement {
    home?: string;
    clubs?: string;
    discover?: string;
    help?: string;
    setting?: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return Object.keys(Attribute) as Array<Attribute>;
    }

    attributeChangedCallback(propName: Attribute, oldValue: string | undefined, newValue: string | undefined) {
        this[propName] = newValue;
        this.render();
    }

    connectedCallback() {
        this.render();
    }



    

    navegateToDashboard() {
        dispatch(navigate(Screens.DASHBOARD));
    }

    navegateToClubsLanding() {
        dispatch(navigate(Screens.CLUBSLANDING));
    }

    navegateToDiscoverLanding() {
        dispatch(navigate(Screens.DISCOVERLANDING));
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';
            // Create the main container (section)
            const container = this.ownerDocument.createElement('section');
            container.className = 'container';
            this.shadowRoot.appendChild(container);

            // Create the container for user action items
            const actionUserElement = this.ownerDocument.createElement('div');
            actionUserElement.className = 'action-user-element';
            container.appendChild(actionUserElement);

            // Create Home element
            const homeElement = this.ownerDocument.createElement('div');
            homeElement.className = 'home-element';
            const homeButton = this.ownerDocument.createElement('button');
           // homeButton.dataset.href = this.home || 'No Link'; // We use data-href to maintain the reference
            const homeIcon = this.ownerDocument.createElement('i');
            homeIcon.className = 'fa-solid fa-house';
            homeIcon.style.color = '#ffc320';
            homeButton.appendChild(homeIcon);
            homeButton.appendChild(this.ownerDocument.createTextNode('Home'));
            homeElement.appendChild(homeButton);
            actionUserElement.appendChild(homeElement);

            // Create Clubs element
            const clubsElement = this.ownerDocument.createElement('div');
            clubsElement.className = 'clubs-element';
            const clubsButton = this.ownerDocument.createElement('button');
            // clubsButton.dataset.href = this.clubs || 'No Link';
            const clubsIcon = this.ownerDocument.createElement('i');
            clubsIcon.className = 'fa-solid fa-user';
            clubsIcon.style.color = '#6471c7';
            clubsButton.appendChild(clubsIcon);
            clubsButton.appendChild(this.ownerDocument.createTextNode('Clubs'));
            clubsElement.appendChild(clubsButton);
            actionUserElement.appendChild(clubsElement);

            // Create Discover item
            const discoverElement = this.ownerDocument.createElement('div');
            discoverElement.className = 'discover-element';
            const discoverButton = this.ownerDocument.createElement('button');
            // discoverButton.dataset.href = this.discover || 'No Link';
            const discoverIcon = this.ownerDocument.createElement('i');
            discoverIcon.className = 'fa-solid fa-compass';
            discoverIcon.style.color = '#c2be4d';
            discoverButton.appendChild(discoverIcon);
            discoverButton.appendChild(this.ownerDocument.createTextNode('Discover'));
            discoverElement.appendChild(discoverButton);
            actionUserElement.appendChild(discoverElement);

            // Create the container for configuration items
            const settingUserElement = this.ownerDocument.createElement('div');
            settingUserElement.className = 'setting-user-element';
            container.appendChild(settingUserElement);

            // Create Help element
            const helpElement = this.ownerDocument.createElement('div');
            helpElement.className = 'help-element';
            const helpButton = this.ownerDocument.createElement('button');
            // helpButton.dataset.href = this.help || 'No Link';
            const helpIcon = this.ownerDocument.createElement('i');
            helpIcon.className = 'fa-solid fa-circle-question';
            helpIcon.style.color = '#322316';
            helpButton.appendChild(helpIcon);
            helpButton.appendChild(this.ownerDocument.createTextNode('Help & Support'));
            helpElement.appendChild(helpButton);
            settingUserElement.appendChild(helpElement);

            // Create Settings item
            const settingElement = this.ownerDocument.createElement('div');
            settingElement.className = 'setting-element';
            const settingButton = this.ownerDocument.createElement('button');
            // settingButton.dataset.href = this.setting || 'No Link';
            const settingIcon = this.ownerDocument.createElement('i');
            settingIcon.className = 'fa-solid fa-gear';
            settingIcon.style.color = '#332231';
            settingButton.appendChild(settingIcon);
            settingButton.appendChild(this.ownerDocument.createTextNode('Settings & Privacy'));
            settingElement.appendChild(settingButton);
            settingUserElement.appendChild(settingElement);

            // Add the styles
            const linkStylesheet = this.ownerDocument.createElement('link');
            linkStylesheet.rel = 'stylesheet';
            linkStylesheet.href = '../src/components/userMenu/userMenu.css';
            this.shadowRoot.appendChild(linkStylesheet);

            const fontAwesomeLink = this.ownerDocument.createElement('link');
            fontAwesomeLink.rel = 'stylesheet';
            fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            this.shadowRoot.appendChild(fontAwesomeLink);
        }
        
        // Add event listeners for the buttons
        const navegateToDashboard = this.shadowRoot?.querySelector('.home-element');
        navegateToDashboard?.addEventListener('click', this.navegateToDashboard);

        const navegateToClubsLanding = this.shadowRoot?.querySelector('.clubs-element');
        navegateToClubsLanding?.addEventListener('click', this.navegateToClubsLanding);

        const navegateToDiscoverLanding = this.shadowRoot?.querySelector('.discover-element');
        navegateToDiscoverLanding?.addEventListener('click', this.navegateToDiscoverLanding);
        
    }
}

customElements.define('user-menu', UserMenu);
export default UserMenu;