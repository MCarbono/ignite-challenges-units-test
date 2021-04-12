import request from 'supertest';

import { app } from '../../../../app';

import createConnection from '../../../../database'

import { Connection } from 'typeorm';

let connection: Connection;

describe("Show user Balance", () => {
  beforeAll(async() => {
    connection = await createConnection("fin_api");
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to get user's balance", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "Carbono",
      email: "carbono@gmail.com",
      password: "1234"
    })

    const userLogin = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "carbono@gmail.com",
      password: "1234"
    })

    const { token } = userLogin.body;

    const response = await request(app).get('/api/v1/statements/balance').set({Authorization: `Bearer ${token}`})

    expect(response.body).toHaveProperty("statement")
    expect(response.body).toHaveProperty("balance")
  })

  it("Should not be able to get balance's from a user that was not found", async () => {
    const response = await request(app).get('/api/v1/statements/balance').set({Authorization: `Bearer dsadsdsasdasdsa3i1293123u2013u12.dkjdfdjhdshfdjsfjdsfdskjfdjiksfdsk3213u71298321.dskdjsaidhisahdgsadas`})

    expect(response.status).toBe(401)

  })
})
