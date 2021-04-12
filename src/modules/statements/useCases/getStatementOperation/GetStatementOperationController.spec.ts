import request from 'supertest';

import { app } from '../../../../app';

import createConnection from '../../../../database';

import { Connection } from 'typeorm';

let connection: Connection;

describe("Get statement operation", () => {
  beforeAll(async () => {
    connection = await createConnection("fin_api")
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to show statement by user", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "Teste",
      email: "teste@gmail.com",
      password: "1234"
    })

    const tokenUser = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@gmail.com",
      password: "1234"
    })

    const { token } = tokenUser.body

    const state = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "teste deposit"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    const { id } = state.body;

    const response = await request(app)
    .get(`/api/v1/statements/${id}`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
  })

  it("Should not be able to return a statement resume with a invalid one", async () => {
    const response = await request(app)
    .get(`/api/v1/statements/dasdasdas12313-32312-34435454-dsdasdsa`)

    expect(response.status).toBe(401)
  })

  it("Should not be able to return a statement with a invalid user", async () => {
    const response = await request(app)
    .get(`/api/v1/statements/dasdasdas12313-32312-34435454-dsdasdsa`)
    .set({
      Authorization: `Bearer dsadasdasdsa.3231311.dsadasdasdasd.5454545454`
    })

    expect(response.status).toBe(401)
  })
})
