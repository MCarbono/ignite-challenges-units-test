import request from 'supertest';

import createConnection from '../../../../database';

import { app } from '../../../../app';

import { Connection } from 'typeorm';

let connection: Connection;

describe("Login to the api", () => {
  beforeAll(async () => {
    connection = await createConnection("fin_api")
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to login to the api", async () => {

    await request(app)
    .post("/api/v1/users")
    .send({
      name: "Marcelo",
      email: "marcelo@gmail.com",
      password: "1234"
    })

    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "marcelo@gmail.com",
      password: "1234"
    })

    expect(response.body).toHaveProperty("user")
    expect(response.body).toHaveProperty("token")
  })

  it("Should not be able to login with email or password incorrect(email)", async () => {
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "marcelo1@gmail.com",
      password: "1234"
    })

    expect(response.status).toBe(401)
  })

  it("Should not be able to login with email or password incorrect(password)", async () => {
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "marcelo1@gmail.com",
      password: "12345"
    })

    expect(response.status).toBe(401)
  })
})
