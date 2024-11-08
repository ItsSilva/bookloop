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
	  const userPostsCollection = collection(db, `users/${user.uid}/posts`);
	  let imageUrl = null;
  
	  // Subir la imagen a Firebase Storage si existe
	  if (file) {
		const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
		const storageRef = ref(storage, `images/${user.uid}/${file.name}`);
		await uploadBytes(storageRef, file);
		imageUrl = await getDownloadURL(storageRef);
	  }
  
	  // Guardar la quote y la URL de la imagen en Firestore en la subcolección 'posts'
	  await addDoc(userPostsCollection, {
		caption,
		imageUrl,
		timestamp: new Date()
	  });
  
	  console.log('Post guardado exitosamente en la subcolección posts');
	} catch (error) {
	  console.error('Error al guardar el post:', error);
	}
  };

export const getPublications = async () => {
	try {
		const { db } = await getFirebaseInstance();
		const { collection, getDocs } = await import('firebase/firestore');

		const where = collection(db, 'posts');
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
		const { auth } = await getFirebaseInstance();
		const { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } = await import('firebase/auth');

		setPersistence(auth, browserLocalPersistence)
			.then((() => {
				return signInWithEmailAndPassword(auth, email, password);
			})).catch((error: any) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	} catch (error) {
		console.error(error);
	}
};

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



export const getUser = async (uid: string) => {
	const { db, auth } = await getFirebaseInstance();
	const {  doc, getDoc } = await import('firebase/firestore');
	
	const ref = doc(db, 'users', uid);
	const querySnapshot = await getDoc(ref);

	return querySnapshot.data();
};

export const getPostsByUser = async (uid: string) => {
	const posts = await getPublications();

	const filtered = posts?.filter((post: any) => post.userUID === uid);

	return filtered;
};
