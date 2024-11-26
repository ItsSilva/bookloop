import { dispatch, addObserver, appState } from '../../store/index';
import { navigate, getDiscoverCardsAction } from '../../store/actions';
import { Screens } from '../../types/store';
import { logOut } from '../../utils/firebase';

export enum AttributeUserInfo {
    'background' = 'background',
    'userpic' = 'userpic',
    'name' = 'name',
    'userName' = 'userName',
};

class UserBanner extends HTMLElement {
    background?: string;
    userpic?: string;
    name?: string;
    userName?: string;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
        this.background = '';
        this.userpic = '';
        this.name = '';
        this.userName = '';
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
        const goToProfile = this.shadowRoot?.querySelector('.home-btn');
        goToProfile?.addEventListener('click', () => {
            dispatch(navigate(Screens.DASHBOARD));
        });

        const editButton = this.shadowRoot?.querySelector('.edit-btn');
        editButton?.addEventListener('click', () => {
            dispatch(navigate(Screens.EDITPROFILE));
        });

        const logoutButton = this.shadowRoot?.querySelector('.logout-btn');

        logoutButton?.addEventListener('click', async () => {
            if (!appState.user || appState.user === null) {
                // Redirect directly if user is null
                await clearSiteData();
                dispatch(navigate(Screens.LOGIN));
            } else {
                // Delete site data, log out and redirect
                await clearSiteData();
                logOut();
                dispatch(navigate(Screens.LOGIN));
            }
        });

        // Additional validation: automatically redirect if user is not logged in
        if (!appState.user || appState.user === null) {
            (async () => {
                await clearSiteData();
                dispatch(navigate(Screens.LOGIN));
            })();
        }

        // Function to clean site data
        async function clearSiteData() {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            }

            localStorage.clear();
            sessionStorage.clear();

            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.split('=');
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
            });
        }

    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../src/components/userBanner/userBanner.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<section class="user-banner">
<div class="container">
  <div class="user-info">
    <div class="user-picture">
      <img src="${this.userpic}" alt="User Picture" />
    </div>
    <div class="user-details">
      <h2 class="user-name">${this.name}</h2>
      <p class="user-userName">${this.userName}</p>
    </div>
  </div>
  <div class="actions">
      <button class="home-btn">
      <i class="fa-solid fa-house"></i>
    </button>
    <button class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button class="logout-btn">
      <i class="fas fa-sign-out-alt"></i>
    </button>
  </div>
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
