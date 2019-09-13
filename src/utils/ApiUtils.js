const IS_LOCAL = process.env.NODE_ENV === 'development';

export default {
  origin: IS_LOCAL ? 'http://localhost:5000' :
    'https://us-central1-barnard-project.cloudfunctions.net',
  path: IS_LOCAL ? '/barnard-project/us-central1/' : '/',
}
