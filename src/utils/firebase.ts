import { browserLocalPersistence } from 'firebase/auth';
import { appState, dispatch } from '../store/index';
import { addDoc, collection, doc, getDocs, getFirestore } from 'firebase/firestore';
import { navigate, setUserCredentials, setUserData } from '../store/actions';
import { Screens } from '../types/store';
let db: any;
let auth: any;
let storage : any;

export const getFirebaseInstance = async () => {
	if (!db) {
		const { firebaseConfig } = await import('./firebase.config');
		const { getFirestore } = await import('firebase/firestore');
		const { initializeApp } = await import('firebase/app');
		const { getAuth } = await import('firebase/auth');
		const { getStorage } = await import('firebase/storage');

		// Your web app's Firebase configuration
		//IMPORTANT: delete the firebaseConfig when you push to a public repository
		//firebaseConfig is in the .gitignore file

		const app = initializeApp(firebaseConfig);
		db = getFirestore(app);
		auth = getAuth(app);
		storage = getStorage(app)
	}
	return { db, auth, storage };
};

export const addPublications = async (product: any) => {
	try {
		const { db } = await getFirebaseInstance();
		const { collection, addDoc } = await import('firebase/firestore');

		const where = collection(db, 'publications');
		await addDoc(where, product);
		console.log('Se añadió con exito');
	} catch (error) {
		console.error('Error adding document', error);
	}
};

export const savePost = async (caption: string, file?: any) => {
	try {
	  const { db, auth, storage } = await getFirebaseInstance();
	  const user = auth.currentUser;

	  
	  if (!user) {
		throw new Error('Usuario no autenticado');
	  }
  
	  const { collection, addDoc } = await import('firebase/firestore');
	  const userPostsCollection = collection(db, 'posts');
	  let imageUrl = null;
  
	  // Subir la imagen a Firebase Storage si existe
	  if (file) {
		const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
		const storageRef = ref(storage, `images/${user.uid}/${file.name}`);
		await uploadBytes(storageRef, file);
		imageUrl = await getDownloadURL(storageRef);
	  }

	  console.log('Appstate userData:', appState.userData);
	  

	  const newPost = {
		caption,
		timestamp: new Date(),
		userId: user.uid,
		comments: [],
		imageUrl,
		likes: 0,
		// userName: appState.userData.username,
		name: appState.userData.name,
	  };
  

	  // Guardar la quote y la URL de la imagen en Firestore en la subcolección 'posts'
	  await addDoc(userPostsCollection, newPost);
  
	  console.log('Post guardado exitosamente en la subcolección posts');
	} catch (error) {
	  console.error('Error al guardar el post:', error);
	}
  };

export const getPosts = async () => {
	const querySnapshot = await getDocs(collection(db, 'posts'));
	const arrayProducts: any[] = [];

	querySnapshot.forEach((doc) => {
		const data = doc.data() as any;
		arrayProducts.push({ id: doc.id, ...data });
	});

	console.log('posts en firebase', arrayProducts);
	

	return arrayProducts;
};

export const registerUser = async (credentials: any) => {
	try {
		const { auth, db } = await getFirebaseInstance();
		const { createUserWithEmailAndPassword } = await import('firebase/auth');
		const { doc, setDoc } = await import('firebase/firestore');

		const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);

		const where = doc(db, 'users', userCredential.user.uid);
		const data = {
			userName: credentials.userName,
			name: credentials.name,
		};

		await setDoc(where, data);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const loginUser = async (email: string, password: string) => {
	try {
		const { doc, getDoc } = await import('firebase/firestore');
        const { auth } = await getFirebaseInstance();
        const { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } = await import('firebase/auth');

        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const userRef = doc(db, 'users', auth.currentUser.uid);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			const user = {
				uid: userCredential.user.uid,
				email: userCredential.user.email,
				userName: userData.userName,
				name: userData.name,
			};
			dispatch(setUserData(user));
			console.log('Usuario log', appState.userData);
			
        return userCredential; // Devuelve el resultado para manejar en el frontend
    

}} catch (error) {
	console.error("Login error", error);
	return null;
}
}

export const getDiscoverCards = async () => {
	try {
		const { db } = await getFirebaseInstance();
		const { collection, getDocs } = await import('firebase/firestore');

		const where = collection(db, 'discover');
		const querySnapshot = await getDocs(where);
		const data: any[] = [];

		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});

		return data;
	} catch (error) {
		console.error('Error getting documents', error);
	}
};

export const addClubsCards = async (clubData: any) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayUnion, getDoc } = await import('firebase/firestore');

        const userId = appState.user;
        console.log("Current userId:", userId);

        if (!userId) {
            throw new Error("No user ID found in appState");
        }

        // Reference to the specific document in discover collection
        const discoverRef = doc(db, 'discover', clubData.uid.toString());
        
        // Get current document data to verify it exists
        const docSnap = await getDoc(discoverRef);
        if (!docSnap.exists()) {
            throw new Error("Discover document doesn't exist");
        }

        // Update the usersid array with the new userId
        await updateDoc(discoverRef, {
            usersid: arrayUnion(userId)
        });

        console.log("User added to club successfully");
        return true;

    } catch (error) {
        console.error("Error in addClubsCards:", error);
        throw error;
    }
};

export const getClubsCards = async () => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, getDocs, query, where } = await import('firebase/firestore');

        const userId = appState.user;
        console.log("Fetching clubs for userId:", userId);

        if (!userId) {
            throw new Error("No user ID found in appState");
        }

        const discoverRef = collection(db, 'discover');
        const querySnapshot = await getDocs(discoverRef);

        const data: any[] = [];
        querySnapshot.forEach((doc) => {
            const clubData = doc.data();
            // only include cards where the user is in usersid
            if (clubData.usersid && Array.isArray(clubData.usersid) && clubData.usersid.includes(userId)) {
                data.push({
                    uid: doc.id,
                    ...clubData
                });
            }
        });

        console.log("Retrieved user's clubs:", data);
        return data;

    } catch (error) {
        console.error("Error in getClubsCards:", error);
        throw error;
    }
};

export const getUserName = async () => {
	try {
		const { db } = await getFirebaseInstance();
		const { collection, getDocs } = await import('firebase/firestore');

		const where = collection(db, 'users');
		const querySnapshot = await getDocs(where);
		const data: any[] = [];

		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});

		return data;
	} catch (error) {
		console.error('Error getting documents', error);
	}
};

export const removeClubsCards = async (clubData: any) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayRemove, getDoc } = await import('firebase/firestore');

        const userId = appState.user;
        console.log("Current userId:", userId);

        if (!userId) {
            throw new Error("No user ID found in appState");
        }

        // Reference to the specific document in discover collection
        const discoverRef = doc(db, 'discover', clubData.uid.toString());
        
        // Get current document data to verify it exists
        const docSnap = await getDoc(discoverRef);
        if (!docSnap.exists()) {
            throw new Error("Discover document doesn't exist");
        }

        // Remove the userId from the usersid array
        await updateDoc(discoverRef, {
            usersid: arrayRemove(userId)
        });

        console.log("User removed from club successfully");
        return true;

    } catch (error) {
        console.error("Error in removeClubsCards:", error);
        throw error;
    }
};

export const getUser = async (uid: string) => {
	const { db, auth } = await getFirebaseInstance();
	const {  doc, getDoc } = await import('firebase/firestore');
	
	const ref = doc(db, 'users', uid);
	const querySnapshot = await getDoc(ref);

	return querySnapshot.data();
};

export const getPostsByUser = async (uid: string) => {
	const posts = await getPosts();

	const filtered = posts?.filter((post: any) => post.userUID === uid);

	return filtered;
};

export const addLikes = async (uid: string, liked: boolean) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc, arrayUnion, arrayRemove } = await import('firebase/firestore');

        const userId = appState.user;
        console.log("Current userId:", userId);

        if (!userId) {
            throw new Error("No user ID found in appState");
        }

        // Reference to the specific document in posts collection
        const postRef = doc(db, 'posts', uid);

        // Update the likes array based on the liked state
        if (liked) {
            await updateDoc(postRef, {
                likes: arrayUnion(userId)
            });
        } else {
            await updateDoc(postRef, {
                likes: arrayRemove(userId)
            });
        }

        console.log("Likes updated successfully");
        return true;

    } catch (error) {
        console.error("Error in addLikes:", error);
        throw error;
    }
};
