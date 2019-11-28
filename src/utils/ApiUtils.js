const IS_LOCAL = false;
//process.env.NODE_ENV === 'development'
//  || process.env.NODE_ENV === 'test';

export default {
  origin: IS_LOCAL ? 'http://localhost:5000' :
    'https://us-central1-barnard-project.cloudfunctions.net',
  path: IS_LOCAL ? '/barnard-project/us-central1/' : '/',
}
