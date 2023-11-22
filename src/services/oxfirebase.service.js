import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { getFirestore, collection, getDocs, setDoc, 
    doc, 
    updateDoc, 
    getDoc, 
    query, 
    orderBy, 
    Timestamp, 
    where} from 'firebase/firestore/lite';

/**
 * Class to connect with firebase
 */
class OxFirebase {
    
    /**
     * Variables
     */
    firebase_collection = null;
    app = null;
    db = null; 
    auth = null;
    
    /**
     * Constructor. Initialize the firebase app
     * 
     * @param   firebase configuration 
     * @param   name of the collection
     */
    constructor(config, collection) { 
        this.firebase_collection = collection;
        this.app = initializeApp(config);
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
    } 

    /**
     * Create new user in authentication screen
     * 
     * @param   user email and password
     * @returns authentication credentials
     */
    register(data) {
        return createUserWithEmailAndPassword(this.auth, data.email, data.pass);
    }

    /**
     * Login userd based on authentication
     * 
     * @param   email 
     * @param   password 
     * @returns authentication credentials
     */
    login(email, password) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    /**
     * Create a new user in the collection
     * @param   user info 
     * @returns new user
     */
    async insertUser(user) {
        user.timestamp = Timestamp.fromDate(new Date());
        user.score = 0;
        try {
            await setDoc(doc(this.db, this.firebase_collection, user.uuid), user);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * Search user in collection
     * @param   user identifier
     * @returns user info
     */
    async getUser(uuid) {
        try {
            const snapshot = await getDoc(doc(this.db, this.firebase_collection, uuid));
            if (snapshot && snapshot.exists()) {
                return snapshot.data();
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * Update the score of the user
     * @param   user info
     * @returns updated user info
     */
    async updateUser(user) {
        try {
            return await updateDoc(doc(this.db, this.firebase_collection, user.uuid),
                { score: user.score }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    /**
     * Get all users ordered by score
     * @returns list of users
     */
    async getAllUsers() {
        try {
            const q = query(collection(this.db, this.firebase_collection),
            orderBy("score", "desc"), orderBy("timestamp"), orderBy("nickname"), orderBy("email"), orderBy("name"));
            const docs = await getDocs(q);
            const users = [];
            docs.forEach(u => users.push(u.data()));
            return users;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getUserByEmail(email) {
        try {
            const q = query(collection(this.db, this.firebase_collection), where("email", "==", email));
            const docs = await getDocs(q);
            const users = [];
            docs.forEach(u => users.push(u.data()));
            return users;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default OxFirebase;