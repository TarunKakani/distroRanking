import { Database } from "bun:sqlite";

Bun.serve({
    port: 4444,
    routes: {
        "/api/distros": async () => {
            const db = new Database("distros.db", {readonly: true}, {strict: true});
            const query = db.query("SELECT name FROM distros").all();

            return Response.json(query, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                },
            });
        },
    },
});