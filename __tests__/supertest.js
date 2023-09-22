const request = require('supertest');
const server = 'http://localhost:3000';
const Cookies = require("js-cookie");



describe('Route integration', () => {
  xdescribe('/layers routes', () => {
    // GET to /layers/list
    describe('GET to /list', () => {
      it('response with 200 status and application json', () => {
        return request(server)
          .get('/layers/list')
          .expect('Content-Type', /application\/json/)
          .expect(200);
      })
    })
    // POST to /layers/remove
    //takes object {ARN:string, functionName:string, LayerName:string}
    describe('POST to /remove', () => {
      it('response with 200 status and application json', () => {
        
        return request(server)
          .post('/layers/remove')
          .send()
          .expect('Content-Type', /application\/json/)
          .expect(200);
      })
    })
    // POST to /layers/add
    //takes {ARN, arrayOfCheckedFunctions, layerName}
    describe('POST to /add', () => {
      it('response with 200 status and application json', () => {
        return request(server)
          .post('/layers/add')
          .send()
          .expect('Content-Type', /application\/json/)
          .expect(200);
      })
    })
    // POST to / layers/function
    //takes {ARN}
    describe('POST to /functions', () => {
      it('response with 200 status ad application json', () => {
        return request(server)
          .post('/layers/functions')
          .send()
          .expect('Content-Type', /application\/json/)
          .expect(200);
      })
    })
  })
  describe('/functions routes', () => {
    // GET to /functions/list
    describe('GET to /list', () => {
        it('response with 200 status and application/json content type', async () => {
          console.log('before request')
          const response = await request(server)
            .get('/functions/list')
            .set('Cookie', 'ARN=arn:aws:iam::082338669350:role/OSPTool')
            .expect('Content-Type', /application\/json/)
            .expect(200)
          expect(response.body.Functions).toBeTruthy();
        })
    })
    // POST to /functions/layers
    //takes {function ARN: layers}
    xdescribe('POST to /layers', () => {
        it('response with 200 status and application/json content type', () => {
            return request(server)
            .post('/functions/layers')
            .send()
            .expect('Content-Type', /application\/json/)
            .expect(200);
        })
    })
    // POST to /functions/remove
    
    // POST to /functions/add <----- not currently used

    
  })
  xdescribe('/users routes', () => {
    // POST to /users/signup
    describe('POST to /signup', () => {
      it('should create a user successfully', async () => {
        const response = await request(server)
          .post('/user/signup')
          .send({
            username: 'test',
            password: 'password',
            ARN: '1234'
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(response.body.username).toBe('test')
      })
    })
    // POST to /users/login
    describe('POST to /login', () => {
      it('should log user in successfully', async () => {
        const response = await request(server)
          .post('/user/login')
          .send({
            username: 'test',
            password: '1234'
          })
          .expect(200)
          .expect(response.body.username).toBe('test')
      })
      it('should handle incorrect username/password', async () => {
        const response = await request(server)
          .post('user/login')
          .send({
            username: 'WrongUsername',
            password: 'WrongPassword'
          })
          .expect(400)
      })
    })
    // DELETE to /users/logout <---- frontend button not implemented yet
    describe('DELETE to /logout', () => {
      // beforeEach(() => {
      //   Object.defineProperty(window.document, 'cookie', {
      //     writable: true,
      //     value: 'ARN=1234',
      //   });
      // })
      it('should handle logout successfully', async () => {
        const login = await request(server)
          .post('/user/login')
          .send({
            username: 'test',
            password: '1234'
          })
          .expect(200)
          .expect(login.body.username).toBe('test')
        const logout = await request(server)
          .post('users/logout')
          .expect(200)
          .expect(logout.header['set-cookie']).toBeUndefined();
      })
    })
  })
})