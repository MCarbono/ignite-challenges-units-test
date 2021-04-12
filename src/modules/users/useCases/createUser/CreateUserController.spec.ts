import request from 'supertest';

import { hash } from 'bcryptjs';

import { app } from '../../../../app';

import createConnection from '../../../../database';
import { Connection } from 'typeorm'
import { CreateUserError } from './CreateUserError';

let  connection: Connection

describe("Create a new User", () => {

  beforeAll(async () => {
    connection = await createConnection("fin_api")
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a new user", async() => {
    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "Marcelo",
      email: "marcelo@gmail.com",
      password: "1234"
    })

    expect(response.status).toBe(201)
  })

  it("Should not be able to create a new user if it already exists", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "teste",
      email: "teste@gmail.com",
      password: "1234"
    })

    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "teste",
      email: "teste@gmail.com",
      password: "1234"
    })

    expect(response.status).toBe(400)
  })
})
