import Router from 'express'
import TronController from '../controllers/tron-controller.js'

const router = new Router()


router.post('/sendtrx', TronController.sendTrx)
router.post('/sendusdt', TronController.sendUsdt)
router.post('/balanceusdt', TronController.balanceUsdt)
router.post('/balancetrx', TronController.balanceTrx)
router.post('/generateaddress', TronController.generateAddress)
router.post('/multibalancetrx', TronController.multiBalanceTrx)
router.post('/multibalanceusdt', TronController.multiBalanceUsdt)
router.post('/distribute', TronController.distribute)
router.post('/getInfo', TronController.getInfo)


export default router