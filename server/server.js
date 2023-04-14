import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'


dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

// initiate openai
const openai = new OpenAIApi(configuration)

const app = express()

const PORT = 5000

// middleware :

// allow crossorigin requests
app.use(cors())
// allow to path json from front-end to back-end
app.use(express.json())
app.use(express.static('client'))

// dummy root route
app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello from Brooklynites",
    })
})

// app.get('/manhattan', async (req, res) => {
//     res.status(200).send({
//         message: "Hello from manhattan",
//     })
// })

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
    
})

app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`))