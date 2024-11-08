export type Observer = { render: () => void } & HTMLElement;

export type AppState = {
	screen: string;
	posts: [];
	userData: {
		username: string;
		uid: string;
		email: string;
		name: string;
	};
	cards: any[],
	clubs: any[],
	isFetched: boolean;
	user: {};
};

export enum Screens {
	'REGISTER' = 'REGISTER',
	'LOGIN' = 'LOGIN',
	'DASHBOARD' = 'DASHBOARD',
	'CLUBSLANDING' = 'CLUBSLANDING',
	'CLUBSMAIN' = 'CLUBSMAIN',
	'DISCOVERLANDING' = 'DISCOVERLANDING',
	'DISCOVERMAIN' = 'DISCOVERMAIN',
	'LANDING' = 'LANDING',
}

export enum Actions {
	'NAVIGATE' = 'NAVIGATE',
	'SETUSERCREDENTIALS' = 'SETUSERCREDENTIALS',
	'SETUSERDATA' = 'SETUSERDATA',
	'GETDISCOVERCARDSACTION' = 'GETDISCOVERCARDSACTION',
	'GETCLUBSARDSACTION' = 'GETCLUBSARDSACTION',
	'ADDCLUBSARDSACTION' = 'ADDCLUBSARDSACTION',
	'GETUSERNAME' = 'GETUSERNAME',
	'GETPOSTS' = 'GETPOSTS',
	'ADDLIKES' = 'ADDLIKES',
}