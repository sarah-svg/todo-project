
require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });
    //////////////////////////////////////////////////
    test.only('returns JUST JON\'s todo', async () => {

      const expectation = [
        {
          'id': 4,
          'name': 'bessie',
    
          'done': false,
          'owner_id': 2
        },
        {
          'id': 5,
          'name': 'jumpy',
          'cool_factor': 4,
      
          'owner_id': 2
        },
        {
          'id': 6,
          'name': 'spot',
          
          'done': false,
          'owner_id': 2
        }
      ];

      await fakeRequest(app)
        .post('/api/todo')
        .send(expectation[0])
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      // await fakeRequest(app)
      //   .post('/api/todo')
      //   .send(expectation[1])
      //   .set('Authorization', token)
      //   .expect('Content-Type', /json/)
      //   .expect(200);

      // await fakeRequest(app)
      //   .post('/api/todo')
      //   .send(expectation[2])
      //   .set('Authorization', token)
      //   .expect('Content-Type', /json/)
      //   .expect(200);

      const data = await fakeRequest(app)
        .get('/api/todo')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data.body);
      console.log(expectation);
      expect(data.body[0].length).toEqual(expectation);
    });

    /////////////////////////////passing
    test('returns done updated to true for Jon\'s item', async() => {


      const expectation = {
        'id': 4,
        'todo': 'laundry',
        'done': true,
        'owner_id': 1
      };

      const data = await fakeRequest(app)
        .put('/api/todo/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data.body[0]);
      console.log(expectation);
      expect(data.body.length).toEqual(0);
    });
  });
});
///////////////////////////////////
