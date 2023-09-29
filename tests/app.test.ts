import supertest from "supertest";
import app from "../src/app";
import fruits from "data/fruits";
import { CreateFruit } from "repositories/fruits-repository";


const server = supertest(app)


beforeEach(async () => {
    fruits.length = 0
  });
  

describe("api", () => {
    it("/health", async () => {
        const result = await server.get("/health");
        const {statusCode} = result
        expect(statusCode).toBe(200)
    })
})

describe("POST", () => {
      it("should return 409 when inserting a fruit that is already registered", async () => {
        const fruitData = {
            id: fruits.length + 1,
            name: "Laranja",
            price: 10
          };

          const fruitDataDois: CreateFruit = {
            name: "Laranja",
            price: 10
          };

          fruits.push(fruitData)
    
          const { status } = await server.post("/fruits").send(fruitDataDois);
          expect(status).toBe(409);
        });

      it("should return 422 when inserting a fruit with data missing", async () => {

        const fruitDataWithoutPrice = {
            name: "Laranja",
          };

        const {status} = await server.post("/fruits").send(fruitDataWithoutPrice)
        expect(status).toBe(422)
      });

      it("should return 201 when inserting a fruit", async () => {
        const fruitDataDois: CreateFruit = {
            name: "Laranja",
            price: 10
          };
        
          const { status } = await server.post("/fruits").send(fruitDataDois);
        expect(status).toBe(201)
      });
})

describe("GET", () => {

    it("should return 404 when trying to get a fruit by an id that doesn't exist", async () => {
        const {status} = await server.get("/fruits/2837482")
        expect(status).toBe(404)
      });

      it("should return 400 when id param is present but not valid", async () => {
        const {status} = await server.get("/fruits/-1")
        expect(status).toBe(400)
      });

      it("should return one fruit when given a valid and existing id", async () => {
        const fruitDataDois = {
            id: fruits.length + 1,
            name: "Laranja",
            price: 10
          };
        
        fruits.push(fruitDataDois)

        const {status} = await server.get(`/fruits/${fruits.length}}`)
        expect(status).toBe(200)
      });

      it("should return all fruits if no id is present", async () => {

        const fruitData = {
            id: fruits.length + 1,
            name: "Laranja",
            price: 10
          };

          const fruitDataDois: CreateFruit = {
            name: "Acerola",
            price: 8
          };

          fruits.push(fruitData)
    
         await server.post("/fruits").send(fruitDataDois);
        
        const {status} = await server.get("/fruits")
        expect(status).toBe(200)
      });

})