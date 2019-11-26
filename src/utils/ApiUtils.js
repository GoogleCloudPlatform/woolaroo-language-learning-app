const IS_LOCAL = process.env.NODE_ENV === 'development'
  || process.env.NODE_ENV === 'test';

export default {
  origin: IS_LOCAL ? 'http://localhost:5000' :
    'https://us-central1-final-test-woolaroo.cloudfunctions.net',
  path: IS_LOCAL ? '/barnard-project/us-central1/' : '/',
}
