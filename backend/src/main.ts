import express from 'express'
import cors from 'cors'
import firebaseAdmin from 'firebase-admin';
import serviceAccount from './firebase.json'

const app = express()
const port = 3000

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
})

app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world'
  })
})


app.get('/tech-name', async (req, res) => {
  try {
    const technologyName = req.query.technologyName?.toString() || '';
    const formDataCollection = firebaseAdmin.firestore().collection('formData');
    const querySnapshot = await formDataCollection.where('technologyName', '==', technologyName).get();
    const exists = !querySnapshot.empty;

    res.json({ exists });
  } catch (e) {
    res.status(500).json({error: 'An error occurred while checking technology name'})
    console.log("error: ", e)
  }

});

app.post('/form', (req, res) => {
  
  const formData = req.body;
  const formDataCollection = firebase.firestore().collection('formData');

  formDataCollection.add(formData).then(() => {
    res.status(200).json({ message: 'FormData submitted successfully' })
  }).catch((error: any) => {
    console.error('Error submitting FormData to Firebase:', error);
    res.status(500).json({ error: 'An error occurred while submitting FormData' });
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
