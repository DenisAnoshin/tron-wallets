import tronService from '../services/tron-service.js'

const response = (res, result) => {
    res.json({status: true, result}) 
}
const error = (res, result) =>{
    res.status(400).json({status: false, result: result.message}) 
}

class TronController {
    
    async generateAddress(req, res){
        await tronService.generateAddress().then((result) => response(res, result))
        .catch((e) => error(res, e))
    }

    async sendTrx(req, res){
        await tronService.sendTrx(req.body.to, req.body.amount).then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
    
    async sendUsdt(req, res){
        await tronService.sendUsdt(req.body.to, req.body.amount).then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
    async balanceTrx(req, res){
        await tronService.balanceTrx(req.body.address).then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
    async multiBalanceTrx(req, res){
        await tronService.multiBalanceTrx(req.body.addresses).then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
    async multiBalanceUsdt(req, res){
        await tronService.multiBalanceUsdt(req.body.addresses).then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
    
    async balanceUsdt(req, res){
        await tronService.balanceUsdt(req.body.address).then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
    async distribute(req, res){
        await tronService.distribute(req.body.address, req.body.privateKey).then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
    async getInfo(req, res){
        await tronService.getInfo().then((result) => response(res, result))
        .catch((e) => error(res, e))
    }
}

export default new TronController() 