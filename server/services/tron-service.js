import TronWeb from 'tronweb'
import crypto from 'crypto'

import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

const privateKey = process.env.PRIVATE_KEY_BANK 
const fullHost = process.env.TRON_FULL_NODE
const tronWeb = new TronWeb({fullHost, privateKey})

class TronService {
    convertTo(amount){
        return amount * 1000000
    }
    convertFrom(amount){
        return amount / 1000000
    }
    async sendTrx(to, amount){
        if(!to) throw new Error('Empty address to')
        if(!amount) throw new Error('Empty amount')
        
        const result = await tronWeb.trx.sendTransaction(to, this.convertTo(amount))
        return result
    }
    
    async sendUsdt(to, amount){
        if(!to) throw new Error('Empty address to')
        if(!amount) throw new Error('Empty amount')

        let contract = await tronWeb.contract().at(process.env.CONTRACT_USDT)
        const result = await contract.transfer(to,this.convertTo(amount)).send().then(output => output)
        return result
    }

    async balanceTrx(address){
        if(!address) throw new Error('Empty address')

        const result = await tronWeb.trx.getBalance(address)
        return this.convertFrom(result)
    }
    async balanceUsdt(address){
        if(!address) throw new Error('Empty address')

        const contract = await tronWeb.contract().at(process.env.CONTRACT_USDT)
        const result = await contract.balanceOf(address).call()
        return this.convertFrom(result)
    }

    async multiBalanceTrx(addresses){
        if(!addresses || addresses.length == 0) throw Error('Empty addresses')

        const balancePromises = addresses.map(address => tronWeb.trx.getBalance(address))
        const _balances = await Promise.all(balancePromises)
        const balances = _balances.map(balance => this.convertFrom(balance))
        return balances
    }

    async multiBalanceUsdt(addresses){
        if(!addresses || addresses.length == 0) throw new Error('Empty addresses')

        const contract = await tronWeb.contract().at(process.env.CONTRACT_USDT)
        const balancePromises = addresses.map(address => contract.balanceOf(address).call())
        const _balances = await Promise.all(balancePromises)
        const balances = _balances.map(balance => this.convertFrom(balance))
        return balances
    }

    async generateAddress(){
        const _privateKey = crypto.randomBytes(32).toString('hex')
        const _tronWeb = new TronWeb({fullHost, _privateKey})
        const wallet = await _tronWeb.createAccount()
        return wallet    
    }

    async getAdressFromPrivatekey(_privateKey){
        const _tronWeb = new TronWeb({fullHost, _privateKey})
        const wallet = await _tronWeb.createAccount()
        return wallet    
    }

    async distribute(address, privateKey){
        if(!address) throw new Error('Empty address')
        if(!privateKey) throw new Error('Empty private key')
        const toProfit = process.env.ADDRESS_PROFIT
        const toLiquidity = process.env.ADDRESS_LIQUIDITY

        let fullHost = process.env.TRON_FULL_NODE
        let tronWeb = new TronWeb({fullHost, privateKey})

        const balanceUsdt = await this.balanceUsdt(address)
       // const balanceTrx = await this.balanceTrx(address)

        if(balanceUsdt < 1) throw new Error('Balance USDT < 1')
       // if(balanceTrx < 1) throw new Error('Balance TRX < 1')

        const profit = balanceUsdt * 0.01
        const liquidity = balanceUsdt - profit

        let contract = await tronWeb.contract().at(process.env.CONTRACT_USDT)
        const resultLiquidity = await contract.transfer(toLiquidity, this.convertTo(liquidity)).send().then(output => output)
        const resultProfit = await contract.transfer(toProfit, this.convertTo(profit)).send().then(output => output)

        return {
            liquidity: {
                tx: resultLiquidity,
                amount: liquidity
            },
            profit: {
                tx: resultProfit,
                amount: profit
            }
        }
    }

    async getOneInfo(address){
        return {
            address: address,
            usdt: await this.balanceUsdt(address),
            trx: await this.balanceTrx(address),
        }
    }

    async getInfo(){
        const addresses = []

        addresses.push({ title: 'Адрес банка', color: 'primary', ...await this.getOneInfo(process.env.ADDRESS_BANK) })
        addresses.push({ title: 'Адрес букмекера', color: 'info', ...await this.getOneInfo(process.env.ADDRESS_LIQUIDITY) })
        addresses.push({ title: 'Адрес прибыли', color: 'success', ...await this.getOneInfo(process.env.ADDRESS_PROFIT) })

        return addresses

    }

}

export default new TronService()