import { Part, IncomingForm, Options } from 'formidable'
import Formidable from 'formidable/Formidable'

const filterFunction = ({ name, originalFilename, mimetype }: Part): boolean => {
  if (!originalFilename) return false
  return originalFilename.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|jfif|JFIF)$/) ? true : false
}

const options: Partial<Options> = {
  multiples: true,
  uploadDir: 'src/public/images/',
  keepExtensions: true,
  allowEmptyFiles: false,
  maxFileSize: 5 * 1024 * 1024 * 1024,
  filename: (name: string, ext: string, part: Part, form: Formidable) => name + ext,
  filter: filterFunction
}

export default new IncomingForm(options)
