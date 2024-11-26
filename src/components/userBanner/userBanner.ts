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

class UserBanner extends HTMLElement {
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

    addEventListeners() {
        const goToProfile = this.shadowRoot?.querySelector('.container');
        goToProfile?.addEventListener('click', () => {
            dispatch(navigate(Screens.DASHBOARD));
        });

        const editButton = this.shadowRoot?.querySelector('.edit-btn');
        editButton?.addEventListener('click', () => {
            dispatch(navigate(Screens.PROFILE));
        });

        const logoutButton = this.shadowRoot?.querySelector('.logout-btn');
        logoutButton?.addEventListener('click', () => {
            logOut();
        });
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../src/components/userBanner/userBanner.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<section class="user-banner">
  <div class="user-info">
    <div class="user-picture">
      <img src="${this.userpic}" alt="User Picture" />
    </div>
    <div class="user-details">
      <h2 class="user-name">${this.name}</h2>
      <p class="user-username">@${this.username}</p>
    </div>
  </div>
  <div class="actions">
    <button class="edit-profile">Edit Profile</button>
    <button class="log-out">Log Out</button>
  </div>
  <div class="background-image">
    <img src="${this.background}" alt="Background Image" />
  </div>
</section>
        `;
        }
    }
}

customElements.define('user-banner', UserBanner);
export default UserBanner;
