import request from 'supertest';

import { app } from '../../../../app';

import createConnection from '../../../../database';

import { Connection } from 'typeorm';

let connection: Connection;

describe("Create a statement(deposit)", () => {
  beforeAll(async () => {
    connection = await createConnection("fin_api")
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to create a deposit", async () => {
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

    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit test"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id");
  })

  it("Should be able to create a withdraw", async () => {

    const tokenUser = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@gmail.com",
      password: "1234"
    })

    const { token } = tokenUser.body

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw test"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id");
  })

  it("Should not be able to create a withdraw", async () => {
    const tokenUser = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@gmail.com",
      password: "1234"
    })

    const { token } = tokenUser.body

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 150,
      description: "Withdraw test fail"
    })
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(400)
  })

  it("Should not be able to create a statement with a invalid user", async () => {
    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 150,
      description: "Withdraw test fail"
    })
    .set({
      Authorization: `Bearer dsadsadsadsaddsa.3213123213123213213fdsjfhgdysfgef26.uehf87f82efh8e2fg863g3f3f3`
    })

    expect(response.status).toBe(401)
  })
})
