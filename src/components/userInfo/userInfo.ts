import { dispatch, addObserver, appState } from '../../store/index';
import { navigate, getDiscoverCardsAction } from '../../store/actions';
import { Screens } from '../../types/store';
import { logOut } from '../../utils/firebase';

export enum AttributeUserInfo {
    'background' = 'background',
    'userpic' = 'userpic',
    'name' = 'name',
    'username' = 'username',
};

class UserInfo extends HTMLElement {
    background?: string;
    userpic?: string;
    name?: string;
    username?: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
        this.background = '';
        this.userpic = '';
        this.name = '';
        this.username = '';
    }

    static get observedAttributes() {
        return Object.keys(AttributeUserInfo) as Array<AttributeUserInfo>;
    }

    attributeChangedCallback(propName: AttributeUserInfo, oldValue: string | undefined, newValue: string | undefined) {
        this[propName] = newValue;
        this.render();
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }
    
  addEventListeners (){
    const logoutButton = this.shadowRoot?.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logOut();
        });
    }
  }


    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../src/components/userInfo/userInfo.css';
            this.shadowRoot.appendChild(link);

            const fontAwesomeLink = document.createElement('link');
            fontAwesomeLink.rel = 'stylesheet';
            fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            this.shadowRoot.appendChild(fontAwesomeLink);

            const container = this.ownerDocument.createElement('section');
            container.className = 'container';

            const backgroundImage = this.ownerDocument.createElement('img');
            backgroundImage.src = this.background || '';
            backgroundImage.alt = 'Background';
            container.appendChild(backgroundImage);

            const containerBackground = this.ownerDocument.createElement('div');
            containerBackground.className = 'container-background';
            container.appendChild(containerBackground);

            const containerUserpic = this.ownerDocument.createElement('div');
            containerUserpic.className = 'container-userpic';
            containerBackground.appendChild(containerUserpic);

            const userpicLink = this.ownerDocument.createElement('a');
            userpicLink.href = '#';
            containerUserpic.appendChild(userpicLink);

            const userpicImage = this.ownerDocument.createElement('img');
            userpicImage.src = this.userpic || '';
            userpicImage.alt = 'User Picture';
            userpicLink.appendChild(userpicImage);

            const containerText = this.ownerDocument.createElement('div');
            containerText.className = 'container-text';
            containerBackground.appendChild(containerText);

            const nameElement = this.ownerDocument.createElement('h2');
            nameElement.textContent = this.name || 'No Name';
            containerText.appendChild(nameElement);

            const atElement = this.ownerDocument.createElement('p');
            atElement.textContent = this.username || 'No user name';
            containerText.appendChild(atElement);

            const logoutButton = this.ownerDocument.createElement('button');
            logoutButton.className = 'logout-btn';
            logoutButton.textContent = 'Log Out';
            containerText.appendChild(logoutButton);


            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('user-info', UserInfo);
export default UserInfo;
