import express from "express";
import ViteExpress from "vite-express";
import { algoliasearch } from "algoliasearch";
import { parseBody } from "./src/utils";

const API_ID = "1B842JNWGC";
const API_KEY = "fa5c93bd4d8ac780b303f49925691de0";

const client = algoliasearch(API_ID, API_KEY);
const indexName = "comercios_index";

const app = express();

app.use(express.json());

// Obtener todos los comercios o los que coincidan con el query
app.get("/comercios", async (req, res) => {
  try {
    const query: string = (req.query.q as string) || "";
    const { results } = await client.search({
      requests: [
        {
          indexName,
          query,
        },
      ],
    });

    res.send({ results });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

// Agregar nuevos comercios como al index en algolia
app.post("/comercios", async (req, res) => {
  try {
    const { id } = req.body;
    const body = parseBody(req.body);
    const record = {
      objectID: id,
      ...body,
    };

    // Add record to an index
    const { taskID } = await client.saveObject({
      indexName,
      body: record,
    });

    res.send({ taskID });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

// Obtenemos el comercio por su id
app.get("/comercios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.getObject({
      indexName,
      objectID: id,
    });
    res.status(200).send({ response });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

// PUT /comercios/:id
app.put("/comercios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.partialUpdateObject({
      indexName,
      objectID: id,
      attributesToUpdate: { ...req.body },
    });

    res.send({ response });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});
// GET /comercios-cerca-de?lat&lng
app.get("/comercios-cerca-de", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const hits = await client.searchSingleIndex({
      indexName,
      searchParams: {
        query: "", // Consulta vacía para buscar todos los elementos
        aroundLatLng: `${lat},${lng}`,
        aroundRadius: 10000, // Radio en metros
      },
    });

    res.status(200).send({ hits });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
