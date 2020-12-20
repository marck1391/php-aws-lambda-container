const axios = require('axios')
const {spawn, exec} = require('child_process')
const fs = require('fs')

exports.handler = async (event, context)=>{
    let headers = event.headers
    let method = event.requestContext.http.method
    let path = event.rawPath
    let query = event.rawQueryString
    let sourceIp = event.headers['x-forwarded-for']||event.requestContext.http.sourceIp
    let domain = event.headers.host
    let body = event.body
    let isBase64Encoded = event.isBase64Encoded
    let date = event.requestContext.timeEpoch
    
    if(isBase64Encoded){
        let buff = new Buffer(body, 'base64')
        body = buff.toString()
    }
    
    return startServer().then(()=>{
        return axios({
            method,
            headers,
            body,
            url: 'http://localhost:8080'+path+(query?`?${query}`:''),
        }).then(res=>{
            console.log('AXIOS Response:', res.data, res.headers)
            return {
                statusCode: res.status,
                headers: res.headers,
                body: res.data
            }
        }).catch(err=>{
            console.log('AXIOS Error:', err.response?{status: err.response.status, text: err.response.statusText}:{})
            return {
                statusCode: err.response?err.response.status:500,
                body: err.response?err.response.statusText:err.message
            }
        })
    })
}

let server

async function startServer(cb){
    console.log('Starting php server')
    return new Promise((resolve, reject)=>{
        if(server){
            console.log('Server is started, getting current instance')
            return resolve()
        }
        console.log('Starting php server...')
        server = spawn('php', ['-c', '/mnt/sites/php.ini', '-S', 'localhost:8080', '-t', '/mnt/sites'])
        let output = ''
        let error = ''
        let response
        server.stdout.on('data', (data)=>{
            console.error('PHPLog:', data.toString())
        })
        server.stderr.on('data', (err)=>{
            err = err.toString()
            console.error('PHPError:', err)
            if(err.includes('started')){
                console.log('Server started')
                resolve()
            }
        })
        server.on('close', ()=>{
            console.log('Server php closed', error)
        })
    })
}
