import app from './app'

const port = parseInt(process.env.APP_SELF_PORT, 10) || 3000
const host = process.env.APP_SELF_HOST || '0.0.0.0'

const server = app.listen(port, host, () => {
  console.log(`Sakiewka-client server is running at http://${host}:${port}`)
})

export default server
