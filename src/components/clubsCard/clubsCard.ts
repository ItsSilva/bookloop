import '../../components/elements/clubInfo/clubInfo';
import { dispatch, addObserver, appState } from '../../store/index';
import { getClubsAction, navigate } from '../../store/actions';
import { Screens } from '../../types/store';

export enum AttributeClubsCard {
    'cardtitle' = 'cardtitle',
    'buttontext' = 'buttontext',
    'cardcolor' = 'cardcolor',
    'buttoncolor' = 'buttoncolor',
}

class ClubsCard extends HTMLElement {
    clubs: any[] = [];
    cardtitle: string = '';
    buttontext: string = '';
    cardcolor: string = 'black';
    buttoncolor: string = 'gray';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);
    }

    static get observedAttributes() {
        return Object.values(AttributeClubsCard);
    }

    attributeChangedCallback(propName: AttributeClubsCard, oldValue: string | null, newValue: string | null) {
        if (newValue) {
            switch(propName) {
                case AttributeClubsCard.cardtitle:
                    this.cardtitle = newValue;
                    break;
                case AttributeClubsCard.buttontext:
                    this.buttontext = newValue;
                    break;
                case AttributeClubsCard.cardcolor:
                    this.cardcolor = newValue;
                    break;
                case AttributeClubsCard.buttoncolor:
                    this.buttoncolor = newValue;
                    break;
            }
            this.render();
        }
    }

    async connectedCallback() {
        try {
            if (appState.cards.length === 0) {
                const action = await getClubsAction();
                if (action) {
                    dispatch(action);
                    this.clubs = appState.cards;
                    this.render();
                }
            } else {
                this.clubs = appState.cards;
                this.render();
            }
        } catch (error) {
            console.error("Error loading clubs:", error);
        }
    }

    navegateToYourClub() {
        dispatch(navigate(Screens.CLUBSLANDING));
    }

    render() {
        if (this.shadowRoot) {
          this.shadowRoot.innerHTML = '';
      
          // Create and append the style link
          const styleLink = document.createElement('link');
          styleLink.rel = 'stylesheet';
          styleLink.href = '../src/components/clubsCard/clubsCard.css';
          this.shadowRoot.appendChild(styleLink);
      
          // Create the main section
          const section = this.ownerDocument.createElement('section');
      
          // Create the card div with the title
          const cardDiv = this.ownerDocument.createElement('div');
          cardDiv.className = 'card';
      
          const title = this.ownerDocument.createElement('h3');
          title.style.color = this.cardcolor;
          title.textContent = this.cardtitle || 'Default Title';
          cardDiv.appendChild(title);
          section.appendChild(cardDiv);
      
          // Create the club list
          const clubList = this.ownerDocument.createElement('div');
          clubList.className = 'club-list';
          
          // Create and add each club
          const userClubs = appState.cards.filter((club: any) => 
            club.usersid && Array.isArray(club.usersid) && club.usersid.includes(appState.user)
        );
        
          userClubs.forEach(club => {
            const clubContainer = this.ownerDocument.createElement('div');
            clubContainer.className = 'club-info-container';
      
            const clubInfo = this.ownerDocument.createElement('club-info');
            clubInfo.setAttribute('uid', club.uid || '');
            clubInfo.setAttribute('image', club.image || 'placeholder.jpg'); // Use a placeholder image if club.image is empty
            clubInfo.setAttribute('name', club.name);
            clubInfo.setAttribute('bg-color', '#6471c7');
            clubInfo.setAttribute('members', club.members.toString());
            clubInfo.setAttribute('button', 'Remove');
            clubContainer.appendChild(clubInfo);
      
            clubList.appendChild(clubContainer);
          });
      
          // Create the main button
          const mainButton = this.ownerDocument.createElement('button');
          mainButton.style.backgroundColor = this.buttoncolor;
          mainButton.textContent = this.buttontext || 'Default Button';
          mainButton.className = 'main-button';
          clubList.appendChild(mainButton);
      
          section.appendChild(clubList);
          this.shadowRoot.appendChild(section);
        }
        const navegateToYourClub = this.shadowRoot?.querySelector('.main-button');
        navegateToYourClub?.addEventListener('click', this.navegateToYourClub);
      }
}

customElements.define('clubs-card', ClubsCard);
export default ClubsCard;