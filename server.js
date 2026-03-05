const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do robo-processos funcionando");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/consultar-processos", async (req, res) => {
  try {

    const { nome, oabs } = req.body;

    res.json({
      advogado: nome,
      oabs: oabs,
      status: "endpoint funcionando"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "erro interno"
    });

  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
