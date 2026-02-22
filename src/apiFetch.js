import { resolve } from "bun";
import { Database } from "bun:sqlite";

const db = new Database("distros.db");

// cors
// what is PATCH and OPTIONS?
const corsHeaders = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "GET , POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers" : "Content-Type",
};

Bun.serve({
    port: 4444,
    async fetch(req) {
        const url = new URL(req.url);

        if (req.method === "OPTIONS"){
            return new Response(null, {headers : corsHeaders});
        }

        if (req.method === "GET" && url.pathname === "/api/distros"){
            const query = db.query("SELECT rowid as id, name, rating from distros").all();
            return Response.json(query, {headers: corsHeaders})
        }

        // update the rating using PATCH request
        // the expected json is { name: "distro", rating: xxxx }
        if (req.method === "PATCH" && url.pathname === "/api/update-rating"){
            try{
                const body = await req.json();

                // validate if right input is recieved
                if (!body.name || !body.rating){
                    return new Response("Missing name or rating", { status: 400, headers: corsHeaders });
                }

                // update the db with updated rating
                const stmt = db.prepare("UPDATE distros SET rating = ? WHERE name = ?");
                stmt.run(body.rating, body.name);

                return Response.json({ success: true, newRating: body.rating}, { headers: corsHeaders })
            }
            catch(error){
                console.error(error);
                return new Response("Error updating DB", { status: 500, headers: corsHeaders });
            }
        }
        return new Response("Not Found", { status: 404 });
    },
});

console.log("Server has started on http://localhost:4444");