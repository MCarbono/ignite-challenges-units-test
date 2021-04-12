import request from 'supertest';

import { app } from '../../../../app';

import createConnection from '../../../../database';

import { Connection } from 'typeorm';

let connection: Connection

describe("Show user profile", ( )=> {
  beforeAll(async () => {
    connection = await createConnection("fin_api")
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to show user profile", async () => {

    await request(app)
    .post('/api/v1/users')
    .send({
      name: "Marcelo",
      email: "marcelo@gmail.com",
      password: "1234"
    })

    const responseToken = await request(app)
    .post('/api/v1/sessions')
    .send({
      email: "marcelo@gmail.com",
      password: "1234"
    })

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/profile').set({Authorization: `Bearer ${token}`})

    expect(response.status).toBe(200)
  })

  it("Should not be able to show user's profile with a not founded user", async () => {

    const response = await request(app).get('/api/v1/profile').set({Authorization: `Bearer dsadsdsasdasdsa3i1293123u2013u12.dkjdfdjhdshfdjsfjdsfdskjfdjiksfdsk3213u71298321.dskdjsaidhisahdgsadas`})

    expect(response.status).toBe(401)
  })
})

