const request = require("supertest");
const app = require("../app");
const { testData } = require("../_test-common");
const db = require("../db");

beforeEach(testData);

afterAll(async () => {
    await db.end()
});

describe("GET /", function () {

    test("It should return an array of company information", async function () {
        const response = await request(app).get("/companies");
        expect(response.body).toEqual({
            "companies": [
                { code: "apple", name: "Apple Computer" },
                { code: "ibm", name: "IBM" },
            ]
        });
    })
});