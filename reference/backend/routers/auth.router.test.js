const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const { setupDB } = require('../setup-test');
setupDB('api-auth');

const { CONFIG_AUTH } = require('../config/');
const { User } = require('../models');


// Create mock for EmailController
const sendMailMock = jest.fn()
jest.mock('../controllers/email.controller');
const mockEmailController = require('../controllers/email.controller');
mockEmailController.sendLoginLink.mockReturnValue({ sendMail: sendMailMock });

beforeEach(() => {
  sendMailMock.mockClear();
  mockEmailController.sendLoginLink.mockClear();
});

const headers = {};
headers['x-customrequired-header'] = CONFIG_AUTH.CUSTOM_REQUEST_HEADER;
headers.Accept = 'application/json';

// API Tests
describe('CREATE User', () => {
  test('Create user with POST to /users', async () => {
    // Test Data
    const submittedData = {
      name: { firstName: 'test_first', lastName: 'test_last' },
      email: 'test@test.com',
    };

    // Add a user using the API.
    const res = await request.post('/api/users').send(submittedData).set(headers);

    expect(res.status).toBe(201);

    // Retrieve and compare the the User values using the DB.
    const databaseUserQuery = await User.find();

    const databaseUser = databaseUserQuery[0];

    expect(databaseUserQuery.length).toBeGreaterThanOrEqual(1);
    expect(databaseUser.name.firstName).toBe(submittedData.name.firstName);
    expect(databaseUser.name.lastName).toBe(submittedData.name.lastName);

    // Retrieve and compare the User values using the API.
    const response = await request.get('/api/users').set(headers);
    expect(response.statusCode).toBe(200);
    const APIData = response.body[0];
    expect(APIData.name.firstName).toBe(submittedData.name.firstName);
    expect(APIData.name.lastName).toBe(submittedData.name.lastName);

  });

  test('Create user with POST to /auth/signup', async () => {
    // setupDBRoles();
    // Test Data
    const goodUserData = {
      name: { firstName: 'testname', lastName: 'testlast' },
      email: 'test@test.com',
    };

    const res = await request
      .post('/api/auth/signup')
      .send(goodUserData)
      .set(headers);

    expect(res.status).toBe(201);
  });
});

describe('SIGNUP Validation', () => {
  test('Invalid data to /api/auth/signup returns 403', async () => {
    // Test Data
    const badUserData = {
      firstName: 'test_first',
      lastName: 'test_last',
      email: 'test@test.com',
    };

     const res = await request
      .post('/api/auth/signup')
      .send(badUserData)
      .set(headers);

    expect(res.status).toBe(403);
    const errorMessage = JSON.parse(res.text);

    expect(errorMessage.errors).toEqual([
      { msg: 'Invalid value', param: 'name.firstName', location: 'body' },
      { msg: 'Invalid value', param: 'name.lastName', location: 'body' },
    ]);
  });

  test('Existing user returns 400', async () => {
    // Test Data
    const userOneWithSameEmail = {
      name: { firstName: 'one', lastName: 'two' },
      email: 'test@test.com',
    };

    const userTwoWithSameEmail = {
      name: { firstName: 'three', lastName: 'four' },
      email: 'test@test.com',
    };

    await request
      .post('/api/auth/signup')
      .send(userOneWithSameEmail)
      .set(headers);

    const res2 = await request
      .post('/api/auth/signup')
      .send(userTwoWithSameEmail)
      .set(headers);

    expect(res2.status).toBe(400);
  });

});

describe('SIGNIN User', () => {
  test('User can signin and returns 200', async () => {
    // Create user in DB
    const goodUserData = {
      name: {
        firstName: 'Free',
        lastName: 'Mason',
      },
      email: 'test@test.com',
      accessLevel: 'admin',
    };
    await User.create(goodUserData);

    // POST to the DB with that same data.
    const res = await request
      .post('/api/auth/signin')
      .send(goodUserData)
      .set(headers)
      .set('Origin', 'localhost');

    expect(res.status).toBe(200);
  });
});

describe('SIGNIN Validation', () => {
  test('Non admin user returns 401', async () => {
    // Test Data

    // Create user in DB
    const notValidPermission = {
      name: {
        firstName: 'Free',
        lastName: 'Mason',
      },
      email: 'test@test.com',
      accessLevel: 'user',
    };
    await User.create(notValidPermission);

    // POST to the DB with that same data.
    const res = await request
      .post('/api/auth/signin')
      .send(notValidPermission)
      .set(headers)
      .set('Origin', 'localhost');

    expect(res.status).toBe(401);
  });

  test('A non-valid email return 403', async () => {
    // Create user in DB
    const notValidEmailPayload = {
      name: {
        firstName: 'Free',
        lastName: 'Mason',
      },
      email: 'test',
      accessLevel: 'admin',
    };
    await User.create(notValidEmailPayload);

    // POST to the DB with that same data.
    const res = await request
      .post('/api/auth/signin')
      .send(notValidEmailPayload)
      .set(headers);

    expect(res.status).toBe(403);
    const errorMessage = JSON.parse(res.text);

    expect(errorMessage.errors).toEqual([
      {
        value: 'test',
        msg: 'Invalid email',
        param: 'email',
        location: 'body',
      },
    ]);
  });
})
