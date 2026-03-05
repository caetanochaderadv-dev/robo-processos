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

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto("https://comunica.pje.jus.br/")

  await page.waitForTimeout(5000)

  console.log("Abrindo PJe Comunica")

  const html = await page.content()

  const $ = cheerio.load(html)

  const resultados = []

  oabs.forEach(oab => {

    resultados.push({
      advogado:nome,
      oab:oab.numero + "/" + oab.uf,
      status:"consulta realizada"
    })

  })

  await browser.close()

  return resultados

}

app.post("/consultar-processos", async (req,res)=>{

  const { nome, oabs } = req.body

  const resultado = await consultarPorAdvogado(nome,oabs)

  res.json(resultado)

})

app.listen(3000, ()=>{
  console.log("robô rodando na porta 3000")
})

app.post("/consultar-processos", async (req,res)=>{

const { nome, oabs } = req.body

const resultado = await consultarPorAdvogado(nome,oabs)

res.json(resultado)

})


// FUNÇÃO PARA ENVIAR MOVIMENTAÇÕES PARA O CRM
async function enviarMovimentacoes(numeroProcesso, movimentacoes){

  const response = await fetch(
    "https://oonhemhfkunkqqhsivdg.supabase.co/functions/v1/webhook-movimentacoes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        numero_processo: numeroProcesso,
        movimentacoes: movimentacoes
      })
    }
  )

  const data = await response.json()

  console.log("Movimentações enviadas:", data)
}


app.listen(3000, ()=>{
    console.log("robô rodando na porta 3000")
})