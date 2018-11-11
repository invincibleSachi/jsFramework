const request=require('request');

module.exports={
    doPost:function(uri,postJson,header,body){
        let options={
            url:uri,
            method:'POST',
            headers:header,
            body:body,
        }
        request.post()
    }
}