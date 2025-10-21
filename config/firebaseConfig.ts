import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// react-native-firebase auto-inicializa usando os arquivos google-services.json / GoogleService-Info.plist
// Coloque esses arquivos na raiz do projeto (conforme app.json) para inicializar corretamente.

export const firebaseAuth = auth();
export const db = firestore();
export const firebaseStorage = storage();

export type FirestoreTimestamp = FirebaseFirestoreTypes.Timestamp;
