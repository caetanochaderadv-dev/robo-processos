const express = require("express")
const cors = require("cors")
const { chromium } = require("playwright")
const cheerio = require("cheerio")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
  res.send("Robô jurídico funcionando")
})

async function consultarPorAdvogado(nome, oabs){

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox","--disable-setuid-sandbox"]
  })

  const page = await browser.newPage()

  await page.goto("https://comunica.pje.jus.br/")
  await page.waitForTimeout(5000)

  const html = await page.content()

  const $ = cheerio.load(html)

  const resultados = []

  oabs.forEach(oab => {
    resultados.push({
      advogado: nome,
      oab: oab.numero + "/" + oab.uf,
      status: "consulta realizada"
    })
  })

  await browser.close()

  return resultados
}

app.post("/consultar-processos", async (req,res)=>{

  try{

    const { nome, oabs } = req.body

    const resultado = await consultarPorAdvogado(nome,oabs)

    res.json(resultado)

  }catch(error){

    console.error(error)

    res.status(500).json({
      erro:"erro ao consultar processos"
    })

  }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
  console.log("robô rodando na porta", PORT)
})
