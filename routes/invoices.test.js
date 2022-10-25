const request = require("supertest");
const app = require("../app");
const { testData } = require("../_test-common");
const db = require("../db");

beforeEach(testData);

afterAll(async () => {
    await db.end()
});

describe("GET /", function () {

    test("It should return an array of invoices", async function () {
        const response = await request(app).get("/invoices");
        expect(response.body).toEqual({
            "invoices": [
                { id: 1, comp_code: "apple" },
                { id: 2, comp_code: "apple" },
                { id: 3, comp_code: "apple" },
                { id: 4, comp_code: "ibm" },
            ]
        });
    })

});