import { describe, it, expect } from "vitest";
import { request } from "supertest";
import app from "../app.js";


describe("Index Route", () => {
    it("should return home", async() => {
        //lance le serveur express
        const response = await request(app).get("/");


        //fais une requête sur "/"

        //vérifier que ça donne "home"

        expect(response.body).toBe("home");
    });
});