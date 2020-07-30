const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('./server.js')

describe('Unit testing the /login and /register routes', function() {

    it('should return OK status', async function() {
        const resp = await request(app).get('/login')
        assert.equal(resp.status, 200)
    });

    it('should return OK status', async function() {
        const resp = await request(app).get('/register')
        assert.equal(resp.status, 200)
    });


});