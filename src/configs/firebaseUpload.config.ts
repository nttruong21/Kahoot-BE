import firebaseAdmin from 'firebase-admin'
import fs from 'fs'

import firebaseAccountService from '../keys/kahoot-nodejs-c67a0-firebase-adminsdk-kkws4-1b0890ee47.json'

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseAccountService as any),
  storageBucket: 'kahoot-nodejs-c67a0.appspot.com'
})

const bucket = firebaseAdmin.storage().bucket()

const uploadImage = async (fileName: string): Promise<string> => {
  const file = bucket.file(`images/${fileName}`)
  await file.save(fs.readFileSync(`src/public/images/${fileName}`), {
    contentType: 'image/*'
  })

  const downloadUrl = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500'
  })
  return downloadUrl[0]
}

export { uploadImage }
