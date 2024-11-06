import '../../components/elements/clubInfo/clubInfo';
import clubInfo, { AttributeClubInfo } from '../../components/elements/clubInfo/clubInfo';
import { dispatch, addObserver, appState } from '../../store/index';
import { getClubsAction } from '../../store/actions';

class ClubsContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
    }

    async connectedCallback() {
        if (appState.clubs.length === 0) {
            const action = await getClubsAction();
            if (action) dispatch(action);
        }
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = '';

            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = '../src/components/ClubsContainer/ClubsContainer.css';
            this.shadowRoot.appendChild(styleLink);

            const container = this.ownerDocument.createElement('div');
            container.className = 'clubs-container';

            // Add club titles
            const clubsTitle = this.ownerDocument.createElement('div');
            clubsTitle.className = 'clubs-title';

            const clubsTitleText = this.ownerDocument.createElement('h3');
            clubsTitleText.textContent = 'Clubs';
            clubsTitle.appendChild(clubsTitleText);

            // Add the clubs container
            const clubsContainer = this.ownerDocument.createElement('div');
            clubsContainer.className = 'clubs-content';

            // Add individual clubs
            appState.clubs.forEach((club: any) => {
                const clubElement = this.ownerDocument.createElement('club-info') as clubInfo;
                clubElement.setAttribute(AttributeClubInfo.uid, String(club.uid));
                clubElement.setAttribute(AttributeClubInfo.image, club.image);
                clubElement.setAttribute(AttributeClubInfo.name, club.name);
                clubElement.setAttribute(AttributeClubInfo.members, String(club.members));
                clubElement.setAttribute(AttributeClubInfo.button, 'Joined');

                clubsContainer.appendChild(clubElement);
            });

            // Add items to the main container
            container.appendChild(clubsTitle);
            container.appendChild(clubsContainer);

            this.shadowRoot.appendChild(container);
        }
    }
}

customElements.define('clubs-container', ClubsContainer);
export default ClubsContainer;