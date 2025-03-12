// ameen ahmad dababat
// ameendababat07@gmail.com
const request = require('supertest');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.static('dist'));
app.get('/', (req, res) => res.sendFile(path.resolve('dist/index.html')));

const server = app.listen(0); 

jest.setTimeout(10000); 

describe('GET / endpoint', () => {
    afterAll(() => {
        server.close(); 
    });

    it('should return the index.html file with status code 200', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/text\/html; charset=UTF-8/);
    });
});