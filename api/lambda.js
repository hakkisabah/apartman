const serverlessExpress = require('@vendia/serverless-express')
const app = require('./server')

const port = process.env.PORT || 8002

app.listen(port, () => {})

module.exports.universal = async (event, context) => {
  const serverlessExpressInstance = serverlessExpress({ app })
  return serverlessExpressInstance(event, context)
}
